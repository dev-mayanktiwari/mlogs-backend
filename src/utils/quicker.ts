import os from "os";
import bcrypt, { compare } from "bcryptjs";
import { AppConfig } from "../config";
import { v4 } from "uuid";
import { randomInt } from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";

export default {
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
    };
  },
  getApplicationHealth: () => {
    return {
      environment: AppConfig.get("ENV"),
      uptime: `${process.uptime().toFixed(2)} seconds`,
      memoryUsage: {
        totalHeap: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        usedHeap: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      }
    };
  },
  hashPassword: (password: string) => {
    return bcrypt.hash(password, 10);
  },
  generateRandomToken: () => v4(),
  generateOTP: (digits: number = 6) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return randomInt(min, max).toString();
  },
  comparePassword: (password: string, hashedPassword: string) => {
    return compare(password, hashedPassword);
  },
  generateToken: (payload: object, secret: string, expiry: string) => {
    const options: SignOptions = { expiresIn: expiry };
    const loginToken = jwt.sign(payload, secret, options);
    return loginToken;
  }
};

