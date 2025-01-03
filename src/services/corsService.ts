import { AppConfig } from "../config";

const corsOptions = () => {
  if (AppConfig.get("ENV") === "production") {
    const origins = AppConfig.get("CORS_ORIGIN") as string;
    const allowedOrigins = origins.split(",");
    return {
      origin: allowedOrigins,
      credentials: true
    };
  } else {
    return {
      origin: "*",
      credentials: true
    };
  }
};

export default corsOptions;
