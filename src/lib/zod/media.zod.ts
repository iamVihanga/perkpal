import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { media, mediaTypeEnum } from "@/database/schema";

export const mediaTypeSchema = createSelectSchema(mediaTypeEnum);

export type MediaType = z.infer<typeof mediaTypeSchema>;

export const mediaSchema = createSelectSchema(media);

export type Media = z.infer<typeof mediaSchema>;

export const mediaUploadSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadedBy: true
});

export type MediaUploadType = z.infer<typeof mediaUploadSchema>;

export const mediaUpdateSchema = createInsertSchema(media)
  .omit({
    id: true,
    createdAt: true,
    uploadedBy: true,
    type: true
  })
  .partial();

export type MediaUpdateType = z.infer<typeof mediaUpdateSchema>;

export enum MediaUploadPaths {
  AGENTS = "agents",
  PROFILES = "profiles",
  PROPERTIES = "properties",
  PROPERTY_TYPES = "property_types",
  CITIES = "cities"
}

export interface UploadParams {
  file: File;
  type?: MediaType;
  path?: string;

  seoTitle?: string | null | undefined;
  seoDescription?: string | null | undefined;
  seoKeywords?: string | null | undefined;
}
