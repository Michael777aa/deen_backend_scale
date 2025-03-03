require("dotenv").config();
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../libs/utils/sendMail";
import ErrorHandler from "../libs/Error";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import { sendToken } from "../libs/utils/jwt";
import { redis } from "../redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";
import MembeModel, { IUser } from "../schema/Member.model";
const memberController: T = {};

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await MembeModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400)); // Throw error instead of next()
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../libs/mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate you account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit code
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret, // Ensure ENV variable is cast as a string
    {
      expiresIn: "30d",
    }
  );

  return { token, activationCode }; // ✅ Return the required IActivationToken object
};

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await MembeModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400)); // Throw error instead of next()
      }
      await MembeModel.create({ name, email, password });

      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await MembeModel.findOne({ email }).select("password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutUser = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      console.log(req.user, "REQUEST USER");

      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next(); // Always remember to call next() if the check passes
  };
};

// Update access token
export const updateAccessToken = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      if (!refresh_token) {
        return next(new ErrorHandler("No refresh token provided", 400));
      }

      let decoded: JwtPayload | null = null;
      try {
        decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as string
        ) as JwtPayload;
      } catch (error) {
        return next(new ErrorHandler("Invalid or expired refresh token", 400));
      }

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
      }

      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(
          new ErrorHandler("Session not found. Please login again.", 401)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "30m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "7d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 60 * 1000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await redis.set(
        user._id.toString(),
        JSON.stringify(user),
        "EX",
        7 * 24 * 60 * 60
      );

      // Instead of sending the response here, call next to continue with the next middleware
      next();
    } catch (error: any) {
      console.error(error);
      return next(
        new ErrorHandler(error.message || "Internal server error", 500)
      );
    }
  }
);

export const getUserInfo = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
export const socialAuth = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await MembeModel.findOne({ email });
      if (!user) {
        const newUser = await MembeModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info

interface IUpdateUserInfo {
  name?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401)); // ✅ Ensure user is logged in
      }

      const user: any = await MembeModel.findById(userId);
      console.log("fetched data", user);

      if (name && user) {
        user.name = name;
      }

      await user.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      // Check if user exists
      if (!req.user || !req.user._id) {
        return next(new ErrorHandler("User not found", 404));
      }

      const user = await MembeModel.findById(req.user._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();

      // Update the user data in Redis cache
      await redis.set(req.user._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;
      console.log("AVATAR", avatar);

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401)); // ✅ Ensures user is logged in
      }

      const user = await MembeModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404)); // ✅ Ensures user exists
      }

      if (!avatar) {
        return next(new ErrorHandler("No avatar provided", 400)); // ✅ Prevents processing empty avatar
      }

      if (user.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 250,
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await user.save();
      await redis.set(userId.toString(), JSON.stringify(user)); // ✅ Ensures Redis key is a string

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all users only afor admin

export const getAllUsers = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export default memberController;

// update user role

export const updateUserRole = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, role } = req.body;
      updateUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete user

export const deleteUser = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.body;
      console.log("Result", req.body);

      const user = await MembeModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
