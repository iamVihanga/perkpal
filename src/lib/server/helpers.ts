import { z } from "zod";

export const errorMessageSchema = z.object({
  message: z.string()
});

export const stringIdParamSchema = z.object({
  id: z.string()
});

export const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional()
});

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export function getPaginatedSchema<T>(data: z.ZodType<T>) {
  return z.object({
    data,
    meta: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalCount: z.number(),
      limit: z.number()
    })
  });
}
