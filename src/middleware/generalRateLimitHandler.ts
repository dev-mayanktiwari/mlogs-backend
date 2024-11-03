import { NextFunction, Request, Response } from "express";
import { AppConfig } from "../config";
import { EApplicationEnvirontment } from "../constant/application";
import { generalRateLimiter } from "../config/rateLimiter";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.DEVELOPMENT) {
    return next();
  }

  await generalRateLimiter(req, res, next);
};

