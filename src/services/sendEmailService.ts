import { Queue } from "bullmq";
import { AppConfig } from "../config";

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: AppConfig.get("REDIS_HOST") as string, 
    port: Number(AppConfig.get("REDIS_PORT"))
  }
});

export const sendVerificationEmail = async (email: string, name: string, token: string, code: string) => {
  await emailQueue.add("sendVerificationEmail", {
    email,
    name,
    token,
    code
  });
};

export const accountConfirmedEmail = async (email: string, name: string) => {
  await emailQueue.add(
    "sendAccountConfirmedEmail",
    {
      email,
      name
    },
    { priority: 3 }
  );
};

