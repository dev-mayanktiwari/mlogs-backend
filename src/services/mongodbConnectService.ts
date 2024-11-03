import mongoose from "mongoose";
import { AppConfig } from "../config";

export default {
  connect: async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(AppConfig.get("MONGO_URL") as string);
      return mongoose.connection;
    } catch (error) {
      throw error;
    }
  }
};

