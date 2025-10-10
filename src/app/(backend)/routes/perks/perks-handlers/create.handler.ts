/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { perks } from "@/database/schema/perks.schema";
import { categories, subcategories } from "@/database/schema/categories.schema";
import { SelectPerkT } from "@/lib/zod/perks.zod";
import type { CreatePerkRouteT } from "../routes";

// Create perk route handler
export const create: AppRouteHandler<CreatePerkRouteT> = async (c) => {
  try {
    const body = c.req.valid("json");

    // Convert string dates to Date objects if provided
    let processedBody = {
      ...body,
      startDate: body.startDate
        ? typeof body.startDate === "string"
          ? new Date(body.startDate)
          : body.startDate
        : null,
      endDate: body.endDate
        ? typeof body.endDate === "string"
          ? new Date(body.endDate)
          : body.endDate
        : null
    };

    // Generate slug from title if not provided
    let slug = processedBody.slug;
    if (!slug) {
      slug = processedBody.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();
    }

    // Check if slug already exists
    const existingPerk = await db.query.perks.findFirst({
      where: eq(perks.slug, slug)
    });

    if (existingPerk) {
      return c.json(
        {
          message: `Perk with slug "${slug}" already exists`
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Check if leadFormSlug already exists (if provided)
    if (processedBody.leadFormSlug) {
      const existingLeadForm = await db.query.perks.findFirst({
        where: eq(perks.leadFormSlug, processedBody.leadFormSlug)
      });

      if (existingLeadForm) {
        return c.json(
          {
            message: `Lead form slug "${processedBody.leadFormSlug}" already exists`
          },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Validate category exists if provided
    if (processedBody.categoryId) {
      const categoryExists = await db.query.categories.findFirst({
        where: eq(categories.id, processedBody.categoryId)
      });

      if (!categoryExists) {
        return c.json(
          {
            message: "Category not found"
          },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Validate subcategory exists and belongs to category if provided
    if (processedBody.subcategoryId) {
      const subcategoryExists = await db.query.subcategories.findFirst({
        where: processedBody.categoryId
          ? and(
              eq(subcategories.id, processedBody.subcategoryId),
              eq(subcategories.categoryId, processedBody.categoryId)
            )
          : eq(subcategories.id, processedBody.subcategoryId)
      });

      if (!subcategoryExists) {
        return c.json(
          {
            message: processedBody.categoryId
              ? "Subcategory not found or doesn't belong to the specified category"
              : "Subcategory not found"
          },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Validate and transform leadFormConfig if provided
    if (processedBody.leadFormConfig) {
      const leadFormConfig: any = { ...processedBody.leadFormConfig };

      // Handle redirect configuration
      if (leadFormConfig.redirect) {
        const { redirect } = leadFormConfig;

        if (redirect.enabled) {
          // If redirect is enabled, url must be provided
          if (!redirect.url) {
            return c.json(
              {
                message: "Redirect URL is required when redirect is enabled"
              },
              HttpStatusCodes.BAD_REQUEST
            );
          }

          // Create properly typed redirect config
          leadFormConfig.redirect = {
            enabled: true,
            url: redirect.url as string, // Type assertion after validation
            delay: redirect.delay
          };
        } else {
          // If redirect is disabled, remove it entirely
          delete leadFormConfig.redirect;
        }
      }

      // Handle notification configuration
      if (leadFormConfig.notification) {
        const { notification } = leadFormConfig;

        if (notification.enabled) {
          // If notification is enabled, partnerEmail must be provided
          if (!notification.partnerEmail) {
            return c.json(
              {
                message:
                  "Partner email is required when notifications are enabled"
              },
              HttpStatusCodes.BAD_REQUEST
            );
          }

          // Create properly typed notification config
          leadFormConfig.notification = {
            enabled: true,
            partnerEmail: notification.partnerEmail as string, // Type assertion after validation
            sendImmediately: notification.sendImmediately
          };
        } else {
          // If notification is disabled, remove it entirely
          delete leadFormConfig.notification;
        }
      }

      processedBody = {
        ...processedBody,
        leadFormConfig
      };
    }

    // Get the highest display order for new perk positioning
    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`max(${perks.displayOrder})` })
      .from(perks);

    const nextDisplayOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

    // Insert the new perk
    const { leadFormConfig, ...bodyWithoutLeadForm } = processedBody;

    const insertData: any = {
      ...bodyWithoutLeadForm,
      slug,
      displayOrder: nextDisplayOrder
    };

    // Add leadFormConfig if it exists
    if (leadFormConfig) {
      insertData.leadFormConfig = leadFormConfig;
    }

    const [newPerk] = await db
      .insert(perks)
      .values({ ...(insertData as any), og_image_id: processedBody.ogImageId })
      .returning();

    // Fetch the created perk with all relations
    const createdPerk = await db.query.perks.findFirst({
      where: eq(perks.id, newPerk.id),
      with: {
        category: {
          with: {
            ogImage: true
          }
        },
        subcategory: {
          with: {
            ogImage: true
          }
        },
        bannerImage: true,
        logoImage: true,
        opengraphImage: true
      }
    });

    if (!createdPerk) {
      return c.json(
        {
          message: "Failed to retrieve created perk"
        },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Format the response to match SelectPerkT schema
    const formattedPerk = {
      ...createdPerk,
      category: createdPerk.category
        ? {
            ...createdPerk.category,
            ogImageId: createdPerk.category.og_image_id
          }
        : undefined,
      subcategory: createdPerk.subcategory
        ? {
            ...createdPerk.subcategory,
            ogImageId: createdPerk.subcategory.og_image_id
          }
        : undefined
    } as SelectPerkT;

    return c.json(formattedPerk, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Error in create perk handler:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return c.json(
        {
          message: "A perk with this slug or lead form slug already exists"
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
