import { z } from "zod";

export const selectUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type SelectUserSchema = z.infer<typeof selectUserSchema>;
