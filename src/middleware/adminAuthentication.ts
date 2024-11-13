import { Request, Response, NextFunction } from "express";

import quicker from "../utils/quicker";
import { AppConfig } from "../config";
import { JwtPayload } from "jsonwebtoken";

import httpError from "../utils/httpError";
import { EResponseMessage } from "../constant/responseMessage";
import { EErrorStatusCode } from "../constant/application";

export interface IDecryptedToken extends JwtPayload {
  username: string;
}

const adminAuthMiddleware = (request: Request, _response: Response, next: NextFunction) => {
  try {
    const { cookies } = request;
    const { accessToken } = cookies as { accessToken: string | undefined };

    if (!accessToken) {
      return httpError(next, new Error(EResponseMessage.NO_TOKEN_FOUND), request, EErrorStatusCode.UNAUTHORIZED);
    }

    const { username } = quicker.verifyToken(accessToken, AppConfig.get("ACCESS_TOKEN_SECRET") as string) as IDecryptedToken;

    if (!username) {
      return httpError(next, new Error(EResponseMessage.UNAUTHORIZED), request, EErrorStatusCode.UNAUTHORIZED);
    }

    return next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      return httpError(next, new Error(EResponseMessage.TOKEN_EXPIRED), request, EErrorStatusCode.UNAUTHORIZED);
    }
    return httpError(next, error, request, EErrorStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export default adminAuthMiddleware;
