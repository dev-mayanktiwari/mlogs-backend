import { z } from "zod";

export const blogCommentSchema = z.object({
  text: z.string().min(1, "Minimum one character is required to comment").max(300, "Maximum 300 characters are allowed to comment").trim()
});
