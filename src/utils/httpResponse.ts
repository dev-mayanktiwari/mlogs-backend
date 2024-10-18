import { Request, Response } from "express";
import { THTTPResponse } from "../types";
import { AppConfig } from "../config";
import { EApplicationEnvirontment } from "../constant/application";
import logger from "./logger";

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null) => {
  const response: THTTPResponse = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl
    },
    message: responseMessage,
    data: data
  };

  // Log the response
  logger.info(`Controller Response`, {
    meta: response
  });

  //Production env check
  if (AppConfig.get("ENV") === EApplicationEnvirontment.PRODUCTION) {
    delete response.request.ip;
  }
  res.status(responseStatusCode).json(response);
};

