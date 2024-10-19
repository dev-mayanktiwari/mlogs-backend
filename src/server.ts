import { AppConfig } from "./config";
import app from "./app";
import logger from "./utils/logger";

const server = app.listen(AppConfig.get("PORT") || 3000, () => {
  logger.info("Server started", {
    meta: {
      PORT: AppConfig.get("PORT") || 3000,
      SERVER_URL: AppConfig.get("SERVER_URL")
    }
  });
});

(() => {
  try {
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

