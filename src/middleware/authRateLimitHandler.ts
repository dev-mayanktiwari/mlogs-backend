import { NextFunction, Request, Response } from "express";
import { AppConfig } from "../config";
import { EApplicationEnvirontment } from "../constant/application";
import { authLimiter } from "../config/rateLimiter";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.DEVELOPMENT) {
    return next();
  }

  await authLimiter(req, res, next);
};
