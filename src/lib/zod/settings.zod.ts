import { z } from "zod";

// Key-Value Mapper for Site Settings
export const siteSettingsMap = z.object({
  defaultMetaTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  defaultOpenGraphImage: z.string().optional(),

  // Contact Information
  primaryEmail: z.string().optional(),
  secondaryEmail: z.string().optional(),

  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),

  currentAddress: z.string().optional(),

  // socials
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),

  robotsTxt: z.string().optional(),
  sitemapJson: z.string().optional(),

  // Analytics and Tracking
  g4TrackingId: z.string().optional(),
  metaPixelId: z.string().optional()
});

export const siteSettingsMapInsert = siteSettingsMap.partial();

export type SiteSettingsMapT = z.infer<typeof siteSettingsMap>;

export type SiteSettingsMapInsertT = z.infer<typeof siteSettingsMapInsert>;
