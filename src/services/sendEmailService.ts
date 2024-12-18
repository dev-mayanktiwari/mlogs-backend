import { Queue } from "bullmq";
import { AppConfig } from "../config";

const generalQueueName = "general-service-queue";
const passwordQueueName = "password-service-queue";

const generalQueue = new Queue(generalQueueName, {
  connection: {
    host: AppConfig.get("REDIS_HOST") as string,
    port: Number(AppConfig.get("REDIS_PORT")),
    password: AppConfig.get("REDIS_PASSWORD") as string
  }
});

const passwordEmailQueue = new Queue(passwordQueueName, {
  connection: {
    host: AppConfig.get("REDIS_HOST") as string,
    port: Number(AppConfig.get("REDIS_PORT")),
    password: AppConfig.get("REDIS_PASSWORD") as string
  }
});

export const sendVerificationEmail = async (email: string, name: string, token: string, code: string) => {
  await passwordEmailQueue.add("sendAccountConfirmationEmail", {
    email,
    name,
    token,
    code
  });
};

export const accountConfirmedEmail = async (email: string, name: string) => {
  await generalQueue.add("sendWelcomeEmail", {
    email,
    name
  });
};

export const sendPasswordResetLink = async (email: string, name: string, token: string) => {
  await passwordEmailQueue.add("sendPasswordResetEmail", {
    email,
    name,
    token
  });
};

export const sendPasswordChangeEmail = async (email: string, name: string) => {
  await generalQueue.add("sendPasswordChangedMail", {
    email,
    name
  });
};

export const sendBlogPostEmail = async (email: string[], blogId: number, blogTitle: string, blogHeadline: string) => {
  await generalQueue.add("sendBlogPostEmail", {
    email,
    blogId,
    blogTitle,
    blogHeadline
  });
};
