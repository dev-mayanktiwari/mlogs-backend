import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "localhost", // or your Redis host
    port: 6379 // or your Redis port
  }
});

// Function to add a job to the email queue
export const sendEmail = async (email: string, name: string, token: string, code: string) => {
  await emailQueue.add("sendEmail", {
    email,
    name,
    token,
    code
  });
};
