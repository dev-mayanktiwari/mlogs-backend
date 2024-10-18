/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import util from "util";
import moment from "moment";
import path from "path";
import "winston-mongodb";
import { blue, green, magenta, red, yellow } from "colorette";
import { AppConfig } from "../config";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import { createLogger, transports, format } from "winston";
import { EApplicationEnvirontment } from "../constant/application";
import * as sourceMapSupport from "source-map-support";
import { MongoDBTransportInstance } from "winston-mongodb";

sourceMapSupport.install();

const colorizeLevel = (level: string): string => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "warn":
      return yellow(level);
    case "INFO":
      return blue(level);

    default:
      return level;
  }
};
const consoleLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const customLevel = colorizeLevel(level.toUpperCase());

  const customTimestamp = green(moment(timestamp).format("YYYY-MM-DD HH:mm:ss"));

  const customMessage = message;
  const customMeta = util.inspect(meta, { showHidden: false, depth: null, colors: true });
  const customLog = `${customLevel} - ${customTimestamp} - ${customMessage}\n${magenta(`META`)} ${customMeta}\n`;

  return customLog;
});

const fileLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const logMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = [
        {
          name: value.name,
          message: value.message,
          trace: value.stack || ""
        }
      ];
    } else {
      logMeta[key] = value;
    }
  }
  const logData = {
    level: level.toUpperCase(),
    timestamp: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    message,
    meta: logMeta
  };
  return JSON.stringify(logData, null, 2);
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat)
      })
    ];
  }
  return [];
};

const mongoTransport = (): Array<MongoDBTransportInstance> => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.PRODUCTION) {
    return [
      new transports.MongoDB({
        level: "info",
        db: AppConfig.get("DATABASE_URL") as string,
        expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
      })
    ];
  }
  return [];
};

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, `../../logs/${AppConfig.get("ENV")}.log`),
      level: "info",
      format: format.combine(format.timestamp(), fileLogFormat)
    })
  ];
};

export default createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...fileTransport(), ...consoleTransport(), ...mongoTransport()]
});

