import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import quicker from "../utils/quicker";
import { AppConfig } from "../config";
import { EResponseMessage } from "../constant/responseMessage";
import { adminLoginSchema } from "../types/adminType";

interface IAdminLogin extends Request {
  body: {
    username: string;
    password: string;
  };
}

export default {
  login: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req as IAdminLogin;

      // Validate the request body
      const parsed = adminLoginSchema.safeParse(body);
      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Check if admin exists
      if (AppConfig.get("ADMIN_USERNAME") !== parsed.data.username && AppConfig.get("ADMIN_PASSWORD") !== parsed.data.password) {
        return httpError(next, new Error(EResponseMessage.INVALID_CREDENTIALS), req, EErrorStatusCode.UNAUTHORIZED);
      }

      //Generate JWT token
      const accessToken = quicker.generateToken(
        {
          username: parsed.data.username
        },
        AppConfig.get("ACCESS_TOKEN_SECRET") as string,
        AppConfig.get("ACCESS_TOKEN_EXPIRY") as string
      );

      // Set Cookie
      res.cookie("accessToken", accessToken, {
        path: "/api/v1/admin",
        domain: AppConfig.get("DOMAIN") as string,
        sameSite: "strict",
        httpOnly: true,
        secure: !(AppConfig.get("ENV") === "development"),
        maxAge: AppConfig.get("ACCESS_TOKEN_EXPIRY") as number
      });

      // Return response
      httpResponse(req, res, EResponseStatusCode.OK, EResponseMessage.LOGIN_SUCCESS, {
        accessToken: `Bearer ${accessToken}`
      });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear the cookies
      const clearAuthCookies = () => {
        const cookieOptions = {
          path: "/api/v1/admin",
          domain: AppConfig.get("DOMAIN") as string,
          sameSite: "strict" as const,
          httpOnly: true,
          secure: !(AppConfig.get("ENV") === "development")
        };

        res.clearCookie("accessToken", cookieOptions);
      };
      clearAuthCookies();

      httpResponse(req, res, EResponseStatusCode.OK, EResponseMessage.LOGOUT_SUCCESS, {});
    } catch (error) {
      httpError(next, error, req);
    }
  }
};
