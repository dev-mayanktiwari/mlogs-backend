 
 
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "../config";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (AppConfig.get("ENV") === "production") {
  prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
  });
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ["query", "info", "error", "warn"]
    });
  }
  prisma = global.__prisma;
}

export default prisma;

