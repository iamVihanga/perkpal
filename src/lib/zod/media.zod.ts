import { z } from "zod";

export const mediaSchema = z.object({
  id: z.string(),
  url: z.string().nullable(),
  publicId: z.string().nullable(),
  filename: z.string(),
  size: z.number(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  uploadedBy: z.string().nullable()
});

export type Media = z.infer<typeof mediaSchema>;

export const mediaUploadSchema = mediaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadedBy: true
});

export type MediaUploadType = z.infer<typeof mediaUploadSchema>;

export const mediaUpdateSchema = mediaSchema
  .omit({
    id: true,
    createdAt: true,
    uploadedBy: true
  })
  .partial();

export type MediaUpdateType = z.infer<typeof mediaUpdateSchema>;

export interface UploadParams {
  file: File;
  path?: string;

  seoTitle?: string | null | undefined;
  seoDescription?: string | null | undefined;
  seoKeywords?: string | null | undefined;
}
