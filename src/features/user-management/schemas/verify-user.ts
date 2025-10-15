import { z } from "zod";

export const verifyUserSchema = z.object({
  userId: z.string(),
  emailVerified: z.boolean()
});

export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;
