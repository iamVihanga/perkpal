import { z } from "zod";

import { selectPerkSchema } from "./perks.zod";

// Query and other api related schemas
export const leadsQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  perkId: z.string().optional()
});

export type LeadsQueryParamsSchema = z.infer<typeof leadsQueryParamsSchema>;

export const leadBaseSchema = z.object({
  id: z.string(),

  perkId: z.string(),
  data: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string()), z.boolean()])
  ),
  ip: z.string().nullable().optional(),

  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

export const selectLeadSchema = leadBaseSchema.extend({
  perk: selectPerkSchema.optional()
});

export const insertLeadSchema = leadBaseSchema.omit({
  id: true,
  ip: true,
  createdAt: true,
  updatedAt: true
});

export type SelectLeadSchema = z.infer<typeof selectLeadSchema>;
export type InsertLeadSchema = z.infer<typeof insertLeadSchema>;
