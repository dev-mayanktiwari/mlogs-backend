import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import httpError from "../utils/httpError";
import { EErrorStatusCode } from "../constant/application";
import { EResponseMessage } from "../constant/responseMessage";

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req: Request, _res: Response, next: NextFunction) => {
    httpError(next, new Error(EResponseMessage.AUTH_TOO_MANY_REQUESTS), req, EErrorStatusCode.TOO_MANY_REQUESTS);
  }
});

export const generalRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 5 minutes",
  handler: (req: Request, _res: Response, next: NextFunction) => {
    httpError(next, new Error(EResponseMessage.AUTH_TOO_MANY_REQUESTS), req, EErrorStatusCode.TOO_MANY_REQUESTS);
  }
});

