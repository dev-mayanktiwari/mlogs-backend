import { CorsOptions } from "cors";
import { AppConfig } from "../config";

const corsOptions = (): CorsOptions => {
  if (AppConfig.get("ENV") === "production") {
    const origins = AppConfig.get("CORS_ORIGIN") as string;
    const allowedOrigins = origins.split(",").map((origin) => origin.trim());

    //  console.log("Configured CORS origins:", allowedOrigins); // Debug log

    return {
      origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
        //    console.log("Incoming request origin:", requestOrigin); // Debug log

        if (!requestOrigin) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
        } else {
          // console.log("Origin not allowed:", requestOrigin); // Debug log
          // console.log("Allowed origins:", allowedOrigins); // Debug log
          callback(new Error(`Origin ${requestOrigin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    };
  } else {
    return {
      origin: true, // More permissive than "*" when credentials are needed
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    };
  }
};

export default corsOptions;
