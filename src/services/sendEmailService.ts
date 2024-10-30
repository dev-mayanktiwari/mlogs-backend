import { Queue } from "bullmq";
import { AppConfig } from "../config";

const generalQueueName = "general-service-queue";
const passwordQueueName = "password-service-queue";

const generalQueue = new Queue(generalQueueName, {
  connection: {
    host: AppConfig.get("REDIS_HOST") as string,
    port: Number(AppConfig.get("REDIS_PORT"))
  }
});

const passwordEmailQueue = new Queue(passwordQueueName, {
  connection: {
    host: AppConfig.get("REDIS_HOST") as string,
    port: Number(AppConfig.get("REDIS_PORT"))
  }
});

export const sendVerificationEmail = async (email: string, name: string, token: string, code: string) => {
  await generalQueue.add("sendAccountConfirmationEmail", {
    email,
    name,
    token,
    code
  });
};

export const accountConfirmedEmail = async (email: string, name: string) => {
  await generalQueue.add(
    "sendAccountConfirmedEmail",
    {
      email,
      name
    },
    { priority: 3 }
  );
};

export const sendPasswordResetLink = async (email: string, name: string, token: string) => {
  await passwordEmailQueue.add("sendPasswordResetEmail", {
    email,
    name,
    token
  });
};
