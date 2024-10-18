import { AppConfig } from "./config";
import app from "./app";
import logger from "./utils/logger";
import databaseService from "./services/databaseService";


const server = app.listen(AppConfig.get("PORT") || 3000, () => {
  logger.info("Server started", {
    meta: {
      PORT: AppConfig.get("PORT") || 3000,
      SERVER_URL: AppConfig.get("SERVER_URL")
    }
  });
});


// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const connection = await databaseService.connect();

    logger.info("DATABASE_CONNECTION", {
      meta: {
        CONNECTION_NAME: connection?.name || "Unknown"
      }
    });

    logger.info("Server is running", {
      meta: {
        PORT: AppConfig.get("PORT"),
        SERVER_URL: AppConfig.get("SERVER_URL")
      }
    });
  } catch (error) {
    logger.error("Error starting server", {
      meta: { error }
    });

    // Close the server if there's an error during initialization
    server.close(() => {
      logger.error("Server closed due to initialization error", { meta: { error } });
      process.exit(1); // Exit with failure
    });
  }
})();
