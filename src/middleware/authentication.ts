import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/prismaUserTypes";
import quicker from "../utils/quicker";
import { AppConfig } from "../config";
import { JwtPayload } from "jsonwebtoken";
import userAuthDbServices from "../services/userAuthDbServices";
import httpError from "../utils/httpError";
import { EResponseMessage } from "../constant/responseMessage";
import { EErrorStatusCode } from "../constant/application";

interface IAuthenticatedRequest extends Request {
  authenticatedUser: IUser;
}

export interface IDecryptedToken extends JwtPayload {
  userId: string;
  email: string;
  username: string;
}

const authMiddleware = async (request: Request, _response: Response, next: NextFunction) => {
  try {
    const req = request as IAuthenticatedRequest;
    const { cookies } = req;
    const { accessToken } = cookies as { accessToken: string | undefined };

    if (!accessToken) {
      return httpError(next, new Error(EResponseMessage.NO_TOKEN_FOUND), req, EErrorStatusCode.UNAUTHORIZED);
    }

    const { userId } = quicker.verifyToken(accessToken, AppConfig.get("ACCESS_TOKEN_SECRET") as string) as IDecryptedToken;

    const user = await userAuthDbServices.findUserById(userId);

    if (!user) {
      return httpError(next, new Error(EResponseMessage.UNAUTHORIZED), req, EErrorStatusCode.UNAUTHORIZED);
    }

    req.authenticatedUser = user;
    return next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      return httpError(next, new Error(EResponseMessage.TOKEN_EXPIRED), request, EErrorStatusCode.UNAUTHORIZED);
    }
    return httpError(next, error, request, EErrorStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export default authMiddleware;
