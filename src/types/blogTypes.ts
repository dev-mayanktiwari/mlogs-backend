import { z } from "zod";

export const blogCommentSchema = z.object({
  text: z.string().min(1, "Minimum one character is required to comment").max(300, "Maximum 300 characters are allowed to comment").trim()
});

export const postBlogSchema = z.object({
  title: z.string().min(1, "Minimum one character is required for title").max(100, "Maximum 100 characters are allowed for title").trim(),
  content: z.string().min(1, "Minimum one character is required for body").max(5000, "Maximum 5000 characters are allowed for body").trim(),
  headline: z.string().min(1, "Minimum one character is required for headline").max(300, "Maximum 300 characters are allowed for headline").trim(),
  category: z
    .array(z.string().min(1, "Minimum one character is required for tag").max(50, "Maximum 50 characters are allowed for tag").trim())
    .max(5, "Maximum 5 tags are allowed")
});
