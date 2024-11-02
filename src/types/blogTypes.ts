import { z } from "zod";

export const likeBlogSchema = z.object({
  blogId: z.number()
});

