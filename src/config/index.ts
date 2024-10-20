import dotenv from "dotenv";
dotenv.config();

type ConfigKeys = "PORT" | "DATABASE_URL" | "SERVER_URL" | "ENV" | "REDIS_PORT" | "REDIS_HOST";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_URL: process.env.SERVER_URL,
  ENV: process.env.ENV,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    if (key === "PORT") {
      return Number(value);
    }

    return value;
  }
};

