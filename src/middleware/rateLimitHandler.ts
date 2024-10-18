import { NextFunction, Request, Response } from "express";
import { AppConfig } from "../config";
import { EApplicationEnvirontment, EErrorStatusCode } from "../constant/application";
import { rateLimiterMongo } from "../config/rateLimiter";
import httpError from "../utils/httpError";
import { ResponseMessage } from "../constant/responseMessage";

export default (req: Request, _: Response, next: NextFunction) => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.DEVELOPMENT) {
    return next();
  }
  if (rateLimiterMongo) {
    rateLimiterMongo
      .consume(req.ip as string, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        return httpError(next, new Error(ResponseMessage.TOO_MANY_REQUESTS), req, EErrorStatusCode.TOO_MANY_REQUESTS);
      });
  }
};
