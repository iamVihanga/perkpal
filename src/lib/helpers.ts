import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

import { media } from "@/database/schema";
import type { FieldTypeT } from "@/lib/zod/perks.zod";

import { z } from "zod";

// Constants
export const cloudinaryPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "perkpal";

// ---------- Database Helpers ----------
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
};

export const seoFields = {
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  og_image_id: text("og_image_id").references(() => media.id, {
    onDelete: "set null"
  })
};

// --------- Reorder Schema -----------
export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(0)
    })
  )
});

export type ReorderItemsT = z.infer<typeof reorderItemsSchema>;

// --------- Form Field Config Type -----------
export interface FormFieldConfigT {
  fields: Array<{
    id: string;
    type: FieldTypeT;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    validation?: {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
      errorMessage?: string;
    };
    helpText?: string;
  }>;

  // Post-submission behavior
  thankYou: {
    title: string; // "Thank you!"
    message: string; // "We'll contact you soon"
    showPerkDetails: boolean; // Show perk info on thank you page
  };

  // Redirect configuration
  redirect?: {
    enabled: boolean;
    url: string; // External URL to redirect to
    delay: number; // Milliseconds to wait before redirect
  };

  // Partner notification
  notification?: {
    enabled: boolean;
    partnerEmail: string; // Where to send lead notifications
    sendImmediately: boolean; // Or batch weekly
  };

  // Privacy/compliance
  consent: {
    required: boolean;
    text: string; // "I agree to share my information..."
  };
}
