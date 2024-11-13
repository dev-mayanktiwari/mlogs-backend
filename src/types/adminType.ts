import { z } from "zod";

const adminLoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export { adminLoginSchema };
