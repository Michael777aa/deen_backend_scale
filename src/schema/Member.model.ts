import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const memberSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true } // createdAt, updateAt
);

// Hash the password before saving the user
memberSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to sign access token
memberSchema.methods.SignAccessToken = function () {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h", // Set a short expiry time for access tokens
      }
    );
  } catch (error) {
    console.error("Error while generating access token:", error);
    throw new Error("Error while generating access token");
  }
};

memberSchema.methods.SignRefreshToken = function () {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        "REFRESH_TOKEN_SECRET is not defined in environment variables"
      );
    }
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d", // Set a longer expiry time for refresh tokens
      }
    );
  } catch (error) {
    console.error("Error while generating refresh token:", error);
    throw new Error("Error while generating refresh token");
  }
};

// Method to compare password with hashed password
memberSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MembeModel: Model<IUser> = mongoose.model("member", memberSchema);
export default MembeModel;
