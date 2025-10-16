/* eslint-disable @typescript-eslint/no-explicit-any */
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { globalSettings } from "@/database/schema";
import type { GetSiteSettingsRoute, UpsertSiteSettingsRoute } from "./routes";
import { SiteSettingsMapT } from "@/lib/zod/settings.zod";
import { eq } from "drizzle-orm";

// List media route handler
export const getSiteSettingsHandler: AppRouteHandler<
  GetSiteSettingsRoute
> = async (c) => {
  const allValues = await db.query.globalSettings.findMany();

  const mappedSiteSettings: SiteSettingsMapT = {
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultOpenGraphImage: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
    currentAddress: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    robotsTxt: "",
    sitemapJson: "",
    g4TrackingId: "",
    metaPixelId: ""
  };

  for (const setting of allValues) {
    switch (setting.key) {
      case "defaultMetaTitle":
        mappedSiteSettings.defaultMetaTitle = setting.value || "";
        break;
      case "defaultMetaDescription":
        mappedSiteSettings.defaultMetaDescription = setting.value || "";
        break;
      case "defaultOpenGraphImage":
        mappedSiteSettings.defaultOpenGraphImage = setting.value || "";
        break;
      case "primaryEmail":
        mappedSiteSettings.primaryEmail = setting.value || "";
        break;
      case "secondaryEmail":
        mappedSiteSettings.secondaryEmail = setting.value || "";
        break;
      case "primaryPhone":
        mappedSiteSettings.primaryPhone = setting.value || "";
        break;
      case "secondaryPhone":
        mappedSiteSettings.secondaryPhone = setting.value || "";
        break;
      case "currentAddress":
        mappedSiteSettings.currentAddress = setting.value || "";
        break;
      case "facebook":
        mappedSiteSettings.facebook = setting.value || "";
        break;
      case "linkedin":
        mappedSiteSettings.linkedin = setting.value || "";
        break;
      case "twitter":
        mappedSiteSettings.twitter = setting.value || "";
        break;
      case "instagram":
        mappedSiteSettings.instagram = setting.value || "";
        break;
      case "robotsTxt":
        mappedSiteSettings.robotsTxt = setting.value || "";
        break;
      case "sitemapJson":
        mappedSiteSettings.sitemapJson = setting.value || "";
        break;
      case "g4TrackingId":
        mappedSiteSettings.g4TrackingId = setting.value || "";
        break;
      case "metaPixelId":
        mappedSiteSettings.metaPixelId = setting.value || "";
        break;
    }
  }

  return c.json(mappedSiteSettings, HttpStatusCodes.OK);
};

// Upsert Site Settings Handler
export const upsertSiteSettingsHandler: AppRouteHandler<
  UpsertSiteSettingsRoute
> = async (c) => {
  const session = c.get("session");
  const body = c.req.valid("json");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  await Promise.all(
    Object.keys(body).map(async (key: string) => {
      const keyValue: string | undefined = (body as Record<string, any>)[key];

      if (keyValue) {
        // Check if the setting already exists
        const existingSetting = await db.query.globalSettings.findFirst({
          where: eq(globalSettings.key, key)
        });

        if (existingSetting) {
          // Update the existing setting
          await db
            .update(globalSettings)
            .set({ value: keyValue, updatedAt: new Date() })
            .where(eq(globalSettings.id, existingSetting.id));
        } else {
          // Insert a new setting
          await db.insert(globalSettings).values({ key, value: keyValue });
        }
      }
    })
  );

  const allValues = await db.query.globalSettings.findMany();

  const mappedSiteSettings: SiteSettingsMapT = {
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultOpenGraphImage: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
    currentAddress: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    robotsTxt: "",
    sitemapJson: "",
    g4TrackingId: "",
    metaPixelId: ""
  };

  for (const setting of allValues) {
    switch (setting.key) {
      case "defaultMetaTitle":
        mappedSiteSettings.defaultMetaTitle = setting.value || "";
        break;
      case "defaultMetaDescription":
        mappedSiteSettings.defaultMetaDescription = setting.value || "";
        break;
      case "defaultOpenGraphImage":
        mappedSiteSettings.defaultOpenGraphImage = setting.value || "";
        break;
      case "primaryEmail":
        mappedSiteSettings.primaryEmail = setting.value || "";
        break;
      case "secondaryEmail":
        mappedSiteSettings.secondaryEmail = setting.value || "";
        break;
      case "primaryPhone":
        mappedSiteSettings.primaryPhone = setting.value || "";
        break;
      case "secondaryPhone":
        mappedSiteSettings.secondaryPhone = setting.value || "";
        break;
      case "currentAddress":
        mappedSiteSettings.currentAddress = setting.value || "";
        break;
      case "facebook":
        mappedSiteSettings.facebook = setting.value || "";
        break;
      case "linkedin":
        mappedSiteSettings.linkedin = setting.value || "";
        break;
      case "twitter":
        mappedSiteSettings.twitter = setting.value || "";
        break;
      case "instagram":
        mappedSiteSettings.instagram = setting.value || "";
        break;
      case "robotsTxt":
        mappedSiteSettings.robotsTxt = setting.value || "";
        break;
      case "sitemapJson":
        mappedSiteSettings.sitemapJson = setting.value || "";
        break;
      case "g4TrackingId":
        mappedSiteSettings.g4TrackingId = setting.value || "";
        break;
      case "metaPixelId":
        mappedSiteSettings.metaPixelId = setting.value || "";
        break;
    }
  }

  return c.json(mappedSiteSettings, HttpStatusCodes.OK);
};
