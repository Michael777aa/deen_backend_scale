import { Request, Response } from "express";
import * as jose from "jose";
import { MemberService } from "../services/auth.service";
import { v4 as uuidv4 } from "uuid";
import {
  APP_SCHEME,
  GOOGLE_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  BASE_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_TOKEN_URL,
  JWT_EXPIRATION_TIME,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRY,
  KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI,
  KAKAO_AUTH_URL,
  KAKAO_CLIENT_SECRET,
  KAKAO_TOKEN_URL,
  KAKAO_USER_INFO_URL,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URI,
  NAVER_AUTH_URL,
  NAVER_CLIENT_SECRET,
  NAVER_TOKEN_URL,
  NAVER_USER_INFO_URL,
} from "../libs/utils/constants";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Error";

const memberService = new MemberService();
const authController: T = {};

/**********************   
    AUTHENTICATION
**********************/

authController.googleAuthorizeHandler = async (req: Request, res: Response) => {
  try {
    if (!GOOGLE_CLIENT_ID) {
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        Message.GOOGLE_ID_NOT_SET
      );
    }

    const stateParam = req.query.state as string;
    let platform;
    const redirectUri = req.query.redirect_uri as string;

    if (redirectUri === APP_SCHEME) {
      platform = "mobile";
    } else {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REDIRECT);
    }

    const state = platform + "|" + stateParam;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid profile email",
      state,
      prompt: "select_account",
    });

    return res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  } catch (err) {
    console.log("Error: googleAuthorizeHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Google OAuth: Handle callback after user consents.
 */
authController.googleCallbackHandler = async (req: Request, res: Response) => {
  try {
    const { code, state: combinedPlatformAndState } = req.query as {
      code: string;
      state: string;
    };

    if (!combinedPlatformAndState) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_STATE);
    }

    const [platform, state] = combinedPlatformAndState.split("|");
    const outgoingParams = new URLSearchParams({
      code: code || "",
      state: state || "",
    });

    const redirectTo =
      platform === "web"
        ? `${BASE_URL}?${outgoingParams.toString()}`
        : `${APP_SCHEME}?${outgoingParams.toString()}`;

    return res.redirect(redirectTo);
  } catch (err) {
    console.log("Error: googleCallbackHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Google OAuth: Exchange code for tokens and return JWTs.
 */
authController.googleTokenHandler = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.MISSING_AUTHORIZATION_CODE
      );
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.GOOGLE_CLIENT_CONFIGURATION
      );
    }

    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });

    const data = await tokenRes.json();
    if (!data.id_token) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.GOOGLE_ID_NOT_SET);
    }

    const decoded = jose.decodeJwt(data.id_token) as any;
    const userInfo: any = {
      ...decoded,
      provider: "google",
    };
    const { exp, ...userInfoWithoutExp } = userInfo;
    const sub = userInfo.sub;
    const issuedAt = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const accessToken = await new jose.SignJWT(userInfoWithoutExp)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .setSubject(sub)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    const refreshToken = await new jose.SignJWT({
      sub,
      jti,
      type: "refresh",
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      email_verified: userInfo.email_verified,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    await memberService.findOrCreateSocialMember(userInfo);

    res.status(HttpCode.OK).json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("Error: googleTokenHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// [Similar pattern for all other handlers - kakaoAuthorizeHandler, kakaoCallbackHandler,
// kakaoTokenHandler, naverAuthorizeHandler, naverCallbackHandler, naverTokenHandler]

// ... (previous imports remain the same)

/**
 * Kakao OAuth: Redirect user to Kakao consent page.
 */
authController.kakaoAuthorizeHandler = async (req: Request, res: Response) => {
  try {
    if (!KAKAO_CLIENT_ID) {
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        Message.KAKAO_ID_NOT_SET
      );
    }

    const redirectUri = req.query.redirect_uri as string;
    const state = req.query.state as string;

    let platform;
    if (redirectUri === APP_SCHEME) {
      platform = "mobile";
    } else {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REDIRECT);
    }

    const combinedState = platform + "|" + state;

    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      response_type: "code",
      state: combinedState,
      prompt: "select_account",
    });

    return res.redirect(`${KAKAO_AUTH_URL}?${params.toString()}`);
  } catch (err) {
    console.log("Error: kakaoAuthorizeHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Kakao OAuth: Handle callback after user consents.
 */
authController.kakaoCallbackHandler = async (req: Request, res: Response) => {
  try {
    const { code, state: combinedPlatformAndState } = req.query as {
      code: string;
      state: string;
    };

    if (!combinedPlatformAndState) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_STATE);
    }

    const [platform, state] = combinedPlatformAndState.split("|");

    const outgoingParams = new URLSearchParams({
      code: code || "",
      state,
    });

    const redirectTo =
      platform === "web"
        ? `${BASE_URL}?${outgoingParams.toString()}`
        : `${APP_SCHEME}?${outgoingParams.toString()}`;

    return res.redirect(redirectTo);
  } catch (err) {
    console.log("Error: kakaoCallbackHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Kakao OAuth: Exchange code for tokens and return JWTs.
 */
authController.kakaoTokenHandler = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.MISSING_AUTHORIZATION_CODE
      );
    }

    if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.KAKAO_CLIENT_CONFIGURATION
      );
    }

    const tokenResponse = await fetch(KAKAO_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });

    const data = await tokenResponse.json();
    if (!data.access_token) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NOT_AUTHENTICATED);
    }

    const userResponse = await fetch(KAKAO_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const userData = await userResponse.json();
    if (userData.error) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.FAILED_TO_FETCH_USER_INFO);
    }

    const kakaoAccount = userData.kakao_account;
    const profile = kakaoAccount?.profile;

    const userInfo: any = {
      sub: userData.id ? userData.id.toString() : "unknown",
      name: profile?.nickname || "Kakao User",
      email: kakaoAccount?.email || `${userData.id}@kakao.com`,
      picture: profile?.profile_image_url || "https://i.imgur.com/0LKZQYM.png",
      email_verified: kakaoAccount?.is_email_verified || false,
      provider: "kakao",
    };

    await memberService.findOrCreateSocialMember(userInfo);

    const issuedAt = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const accessToken = await new jose.SignJWT(userInfo)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .setSubject(userInfo.sub)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    const refreshToken = await new jose.SignJWT({
      ...userInfo,
      jti,
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    res.status(HttpCode.OK).json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("Error: kakaoTokenHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Naver OAuth: Redirect user to Naver consent page.
 */
authController.naverAuthorizeHandler = async (req: Request, res: Response) => {
  try {
    if (!NAVER_CLIENT_ID) {
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        Message.NAVER_ID_NOT_SET
      );
    }

    const redirectUri = req.query.redirect_uri as string;
    const state = req.query.state as string;

    let platform;
    if (redirectUri === APP_SCHEME) {
      platform = "mobile";
    } else {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REDIRECT);
    }

    const combinedState = platform + "|" + state;

    const params = new URLSearchParams({
      client_id: NAVER_CLIENT_ID,
      redirect_uri: NAVER_REDIRECT_URI,
      response_type: "code",
      state: combinedState,
    });

    return res.redirect(`${NAVER_AUTH_URL}?${params.toString()}`);
  } catch (err) {
    console.log("Error: naverAuthorizeHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Naver OAuth: Handle callback after user consents.
 */
authController.naverCallbackHandler = async (req: Request, res: Response) => {
  try {
    const { code, state: combinedPlatformAndState } = req.query as {
      code: string;
      state: string;
    };

    if (!combinedPlatformAndState) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_STATE);
    }

    const [platform, state] = combinedPlatformAndState.split("|");
    const outgoingParams = new URLSearchParams({
      code: code || "",
      state,
    });

    const redirectTo =
      platform === "web"
        ? `${BASE_URL}?${outgoingParams.toString()}`
        : `${APP_SCHEME}?${outgoingParams.toString()}`;

    return res.redirect(redirectTo);
  } catch (err) {
    console.log("Error: naverCallbackHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Naver OAuth: Exchange code for tokens and return JWTs.
 */
authController.naverTokenHandler = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.MISSING_AUTHORIZATION_CODE
      );
    }

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      throw new Errors(
        HttpCode.BAD_REQUEST,
        Message.NAVER_CLIENT_CONFIGURATION
      );
    }

    const tokenResponse = await fetch(NAVER_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        redirect_uri: NAVER_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });

    const data = await tokenResponse.json();
    if (!data.access_token) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NOT_AUTHENTICATED);
    }

    const userResponse = await fetch(NAVER_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const userResponseData = await userResponse.json();
    const userData = userResponseData?.response;

    const userInfo: any = {
      sub: userData.id ? userData.id.toString() : "unknown",
      name: userData.name || "Naver User",
      email: userData.email || `${userData.id}@naver.com`,
      picture: userData.profile_image || "https://i.imgur.com/0LKZQYM.png",
      email_verified: userData.email_verified || false,
      provider: "naver",
    };

    await memberService.findOrCreateSocialMember(userInfo);

    const issuedAt = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const accessToken = await new jose.SignJWT(userInfo)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .setSubject(userInfo.sub)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    const refreshToken = await new jose.SignJWT({
      ...userInfo,
      jti,
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    res.status(HttpCode.OK).json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("Error: naverTokenHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// ... (rest of the file remains the same)
/**
 * Get user info from access token.
 */
authController.userInfoHandler = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const token = authHeader.split(" ")[1];
    const verified = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    res.status(HttpCode.OK).json({ ...verified.payload });
  } catch (err) {
    console.log("Error: userInfoHandler", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**
 * Refresh access and refresh tokens.
 */
authController.refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    let refreshToken: string | null = null;
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      refreshToken = req.body.refreshToken || null;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      refreshToken = req.body.refreshToken || null;
    }

    if (!refreshToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const accessToken = authHeader.split(" ")[1];
        const decoded = await jose.jwtVerify(
          accessToken,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userInfo = decoded.payload;
        const issuedAt = Math.floor(Date.now() / 1000);

        const newAccessToken = await new jose.SignJWT({ ...userInfo })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(JWT_EXPIRATION_TIME)
          .setSubject(userInfo.sub as string)
          .setIssuedAt(issuedAt)
          .sign(new TextEncoder().encode(JWT_SECRET));

        return res.status(HttpCode.OK).json({
          accessToken: newAccessToken,
        });
      }
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const decoded = await jose.jwtVerify(
      refreshToken,
      new TextEncoder().encode(JWT_SECRET)
    );

    const payload = decoded.payload;
    if (payload.type !== "refresh") {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.INVALID_TOKEN_TYPE);
    }

    const sub = payload.sub;
    if (!sub) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.INVALID_TOKEN_PAYLOAD);
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const userInfo = {
      ...payload,
      type: undefined,
      name: payload.name || "mobile-user",
      email: payload.email || "user@example.com",
      picture: payload.picture || "https://ui-avatars.com/api/?name=User",
    };

    const newAccessToken = await new jose.SignJWT(userInfo)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .setSubject(sub)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    const newRefreshToken = await new jose.SignJWT({
      ...userInfo,
      jti,
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setIssuedAt(issuedAt)
      .sign(new TextEncoder().encode(JWT_SECRET));

    res.status(HttpCode.OK).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.log("Error: refreshTokenHandler", err);
    if (err instanceof jose.errors.JWTExpired) {
      res
        .status(HttpCode.UNAUTHORIZED)
        .json(new Errors(HttpCode.UNAUTHORIZED, Message.REFRESH_TOKEN_EXPIRED));
    } else if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default authController;
