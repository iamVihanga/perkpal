import { z } from "zod";

export const setupOrgSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  logo: z.string(),

  // Metadata
  company: z.string(),
  phoneNumber: z.string(),
  website: z.string()
});

export type SetupOrgSchemaT = z.infer<typeof setupOrgSchema>;
