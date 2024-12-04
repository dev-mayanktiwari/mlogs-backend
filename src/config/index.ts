import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "DATABASE_URL"
  | "SERVER_URL"
  | "ENV"
  | "REDIS_PORT"
  | "REDIS_HOST"
  | "ACCESS_TOKEN_SECRET"
  | "REFRESH_TOKEN_SECRET"
  | "ACCESS_TOKEN_EXPIRY"
  | "REFRESH_TOKEN_EXPIRY"
  | "DOMAIN"
  | "MONGO_URL"
  | "REDIS_PASSWORD"
  | "ADMIN_USERNAME"
  | "CORS_ORIGIN"
  | "ADMIN_PASSWORD";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_URL: process.env.SERVER_URL,
  ENV: process.env.ENV,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  DOMAIN: process.env.DOMAIN,
  MONGO_URL: process.env.MONGO_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  CORS_ORIGIN: process.env.CORS_ORIGIN
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    if (key === "PORT" || key === "REDIS_PORT") {
      return Number(value);
    }

    return value;
  }
};
