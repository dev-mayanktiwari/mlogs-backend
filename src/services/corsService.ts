import { CorsOptions } from "cors";
import { AppConfig } from "../config";

const corsOptions = (): CorsOptions => {
  if (AppConfig.get("ENV") === "production") {
    const origins = AppConfig.get("CORS_ORIGIN") as string;
    const allowedOrigins = origins.split(",");
    return {
      origin: function (requestOrigin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"), false);
        }
      },
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
