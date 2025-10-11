import { eq, and } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import slugify from "slug";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { perks } from "@/database/schema/perks.schema";
import { categories, subcategories } from "@/database/schema/categories.schema";
import { SelectPerkT } from "@/lib/zod/perks.zod";
import type { FormFieldConfigT } from "@/lib/helpers";

import type { UpdatePerkRouteT } from "../routes";

export const update: AppRouteHandler<UpdatePerkRouteT> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const { id } = c.req.param();
    const body = c.req.valid("json");

    // Find existing perk
    const existingPerk = await db.query.perks.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });

    if (!existingPerk) {
      return c.json(
        {
          message: "Perk not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Convert string dates to Date objects if provided
    const processedBody = {
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
    let bodySlug = processedBody.slug;
    if (!bodySlug && processedBody.title) {
      bodySlug = slugify(processedBody.title);
    }

    // Check if slug already exists (excluding current perk)
    if (bodySlug && bodySlug !== existingPerk.slug) {
      const slugExisting = await db.query.perks.findFirst({
        where: eq(perks.slug, bodySlug)
      });

      if (slugExisting) {
        return c.json(
          {
            message: `Perk with slug "${bodySlug}" already exists`
          },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Check if leadFormSlug already exists (if provided and different from current)
    if (
      processedBody.leadFormSlug &&
      processedBody.leadFormSlug !== existingPerk.leadFormSlug
    ) {
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
    let validatedLeadFormConfig: FormFieldConfigT | null = null;
    if (processedBody.leadFormConfig) {
      const leadFormConfig = { ...processedBody.leadFormConfig };

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
          // Ensure the redirect config matches FormFieldConfigT
          leadFormConfig.redirect = {
            enabled: true,
            url: redirect.url,
            delay: redirect.delay || 3000
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
          // Ensure the notification config matches FormFieldConfigT
          leadFormConfig.notification = {
            enabled: true,
            partnerEmail: notification.partnerEmail,
            sendImmediately: notification.sendImmediately || true
          };
        } else {
          // If notification is disabled, remove it entirely
          delete leadFormConfig.notification;
        }
      }

      validatedLeadFormConfig = leadFormConfig as FormFieldConfigT;
    }

    // Prepare update data without leadFormConfig first
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { leadFormConfig: _, ...bodyWithoutLeadForm } = processedBody;

    const updateData = {
      ...bodyWithoutLeadForm,
      ...(validatedLeadFormConfig && {
        leadFormConfig: validatedLeadFormConfig
      }),
      updatedAt: new Date(),
      og_image_id: bodyWithoutLeadForm.ogImageId
    };

    // Update slug if provided
    if (bodySlug) {
      updateData.slug = bodySlug;
    }

    // Update the perk
    await db.update(perks).set(updateData).where(eq(perks.id, id));

    // Fetch the updated perk with all relations
    const updatedPerkWithRelations = await db.query.perks.findFirst({
      where: eq(perks.id, id),
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

    if (!updatedPerkWithRelations) {
      return c.json(
        {
          message: "Failed to retrieve updated perk"
        },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Format the response to match SelectPerkT schema
    const formattedPerk = {
      ...updatedPerkWithRelations,
      category: updatedPerkWithRelations.category
        ? {
            ...updatedPerkWithRelations.category,
            ogImageId: updatedPerkWithRelations.category.og_image_id
          }
        : undefined,
      subcategory: updatedPerkWithRelations.subcategory
        ? {
            ...updatedPerkWithRelations.subcategory,
            ogImageId: updatedPerkWithRelations.subcategory.og_image_id
          }
        : undefined
    } as SelectPerkT;

    return c.json(formattedPerk, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
