"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import slug from "slug";

import { cn } from "@/lib/utils";
import { updatePerkSchema, UpdatePerkT } from "@/lib/zod/perks.zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/modules/rich-text/editor";
import { Separator } from "@/components/ui/separator";
import { useSaveMedia } from "@/modules/media/queries/use-save-media";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RedemptionSelector } from "./redemption-selector";
import { ValidityDateSelector } from "./validity-date-selector";
import { ParentCategoryFormSelect } from "@/features/subcategories/components/parent-category-form-select";
import { SubcategoryFormSelect } from "@/features/subcategories/components/subcategory-form-select";
import { Switch } from "@/components/ui/switch";
import { Keywords } from "./keywords";
import { useUpdatePerk } from "../queries/use-update-perk";
import { useGetOnePerk } from "../queries/use-get-one-perk";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdatePerkProps {
  perkId: string;
  className?: string;
}

export function UpdatePerk({ perkId, className }: UpdatePerkProps) {
  const router = useRouter();
  const { mutate: saveMedia } = useSaveMedia();
  const { mutate: updatePerk, isPending: updatingPerk } = useUpdatePerk(perkId);

  // Fetch existing perk data
  const {
    data: existingPerk,
    isPending: fetchingPerk,
    error
  } = useGetOnePerk({ id: perkId });

  const form = useForm<UpdatePerkT>({
    resolver: zodResolver(updatePerkSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: null,
      longDescription: null,
      vendorName: null,
      logo: null,
      banner: null,
      location: "Global" as const,
      redemptionMethod: "affiliate_link" as const,
      affiliateLink: null,
      couponCode: null,
      leadFormSlug: null,
      leadFormConfig: null,
      startDate: null,
      endDate: null,
      keywords: [],
      categoryId: null,
      subcategoryId: null,
      isFeatured: false,
      status: "active",
      seoTitle: null,
      seoDescription: null,
      ogImageId: null,
      canonicalUrl: null
    }
  });

  // Watch category for reactive updates
  const categoryId = form.watch("categoryId");

  // Populate form with existing data
  useEffect(() => {
    if (existingPerk) {
      form.reset({
        title: existingPerk.title || "",
        slug: existingPerk.slug || "",
        shortDescription: existingPerk.shortDescription || null,
        longDescription: existingPerk.longDescription || null,
        vendorName: existingPerk.vendorName || null,
        logo: existingPerk.logoImage?.id || null,
        banner: existingPerk.bannerImage?.id || null,
        location: existingPerk.location || "Global",
        redemptionMethod: existingPerk.redemptionMethod || "affiliate_link",
        affiliateLink: existingPerk.affiliateLink || null,
        couponCode: existingPerk.couponCode || null,
        leadFormSlug: existingPerk.leadFormSlug || null,
        leadFormConfig: existingPerk.leadFormConfig || null,
        startDate: existingPerk.startDate || null,
        endDate: existingPerk.endDate || null,
        keywords: existingPerk.keywords || [],
        categoryId: existingPerk.category?.id || null,
        subcategoryId: existingPerk.subcategory?.id || null,
        isFeatured: existingPerk.isFeatured || false,
        status: existingPerk.status || "active",
        seoTitle: existingPerk.seoTitle || null,
        seoDescription: existingPerk.seoDescription || null,
        ogImageId: existingPerk.opengraphImage?.id || null,
        canonicalUrl: existingPerk.canonicalUrl || null
      });
    }
  }, [existingPerk, form]);

  // Watch redemption method for reactive updates
  const redemptionMethod = form.watch("redemptionMethod");

  // Update slug listener
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        if (value.title === "" || !value.title) {
          form.setValue("slug", "");
          return;
        }

        form.setValue("slug", slug(value.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Clear subcategory when category changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "categoryId") {
        // Clear subcategory when category changes
        form.setValue("subcategoryId", null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: UpdatePerkT) => {
    updatePerk(values, {
      onSuccess: () => {
        router.push("/dashboard/perks");
      }
    });
  };

  // Loading state
  if (fetchingPerk) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Failed to load perk data: {error.message}
        </p>
        <Button
          onClick={() => router.push("/dashboard/perks")}
          variant="outline"
          className="mt-4"
        >
          Back to Perks
        </Button>
      </div>
    );
  }

  // No data found
  if (!existingPerk) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Perk not found</p>
        <Button
          onClick={() => router.push("/dashboard/perks")}
          variant="outline"
          className="mt-4"
        >
          Back to Perks
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">
              Essential details about the perk.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perk Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter perk title"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="perk-slug"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the perk..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Detailed description with rich formatting..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company or vendor name"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Media Upload Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Media Assets</h3>
            <p className="text-sm text-muted-foreground">
              Upload logo and banner images for the perk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {field.value ? (
                        <IDImageViewer id={field.value} />
                      ) : (
                        <MediaUploadWidget
                          widgetProps={{
                            onSuccess: ({ info }, widget) => {
                              widget.close();

                              if (typeof info === "string") return;

                              saveMedia(
                                {
                                  url: info?.url || null,
                                  filename: info?.original_filename || "",
                                  publicId: info?.public_id || null,
                                  size: info?.bytes || 0,
                                  seoDescription:
                                    form.getValues("seoDescription") || "",
                                  seoTitle: form.getValues("seoTitle") || "",
                                  seoKeywords: ""
                                },
                                {
                                  onSuccess: (data) =>
                                    form.setValue("logo", data.id)
                                }
                              );
                            }
                          }}
                        >
                          <Button
                            type="button"
                            variant="secondary"
                            className="bg-blue-600/10 text-blue-600 shadow-none hover:bg-blue-600/20 rounded-full"
                          >
                            Upload Image
                          </Button>
                        </MediaUploadWidget>
                      )}

                      <div className="">
                        {field.value && (
                          <p
                            className="cursor-pointer underline text-secondary-foreground"
                            onClick={() => form.setValue("logo", null)}
                          >
                            Clear Selection
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {field.value ? (
                        <IDImageViewer id={field.value} />
                      ) : (
                        <MediaUploadWidget
                          widgetProps={{
                            onSuccess: ({ info }, widget) => {
                              widget.close();

                              if (typeof info === "string") return;

                              saveMedia(
                                {
                                  url: info?.url || null,
                                  filename: info?.original_filename || "",
                                  publicId: info?.public_id || null,
                                  size: info?.bytes || 0,
                                  seoDescription:
                                    form.getValues("seoDescription") || "",
                                  seoTitle: form.getValues("seoTitle") || "",
                                  seoKeywords: ""
                                },
                                {
                                  onSuccess: (data) =>
                                    form.setValue("banner", data.id)
                                }
                              );
                            }
                          }}
                        >
                          <Button
                            type="button"
                            variant="secondary"
                            className="bg-blue-600/10 text-blue-600 shadow-none hover:bg-blue-600/20 rounded-full"
                          >
                            Upload Image
                          </Button>
                        </MediaUploadWidget>
                      )}

                      <div className="">
                        {field.value && (
                          <p
                            className="cursor-pointer underline text-secondary-foreground"
                            onClick={() => form.setValue("banner", null)}
                          >
                            Clear Selection
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Location & Status */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Location & Status</h3>
            <p className="text-sm text-muted-foreground">
              Set the availability and status of the perk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Malaysia" id="malaysia" />
                        <FormLabel htmlFor="malaysia">Malaysia</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Singapore" id="singapore" />
                        <FormLabel htmlFor="singapore">Singapore</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Global" id="global" />
                        <FormLabel htmlFor="global">Global</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Perk</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark this perk as featured
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Redemption Method */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Redemption Details</h3>
            <p className="text-sm text-muted-foreground">
              Configure how users can redeem this perk.
            </p>
          </div>

          <RedemptionSelector
            selected={
              (form.watch("redemptionMethod") || "affiliate_link") as
                | "affiliate_link"
                | "coupon_code"
                | "form_submission"
            }
            onSelect={(value) => form.setValue("redemptionMethod", value)}
          />
        </div>

        {/* Redemption values */}
        {redemptionMethod === "affiliate_link" && (
          <FormField
            control={form.control}
            name="affiliateLink"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>Affiliate Link</FormLabel>
                <FormControl>
                  <Input
                    className="shadow-none"
                    placeholder="Enter affiliate link"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {redemptionMethod === "coupon_code" && (
          <FormField
            control={form.control}
            name="couponCode"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    className="shadow-none"
                    placeholder="Enter coupon code"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {redemptionMethod === "form_submission" && (
          <FormField
            control={form.control}
            name="leadFormConfig"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>Lead form configuration</FormLabel>
                <FormControl>
                  <Button
                    variant={"secondary"}
                    onClick={() => console.log(field)}
                  >
                    Config
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Separator />

        {/* Validity Dates */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Validity Period</h3>
            <p className="text-sm text-muted-foreground">
              Set the start and end dates for this perk (optional).
            </p>
          </div>

          <ValidityDateSelector
            startDate={
              form.watch("startDate") as Date | string | null | undefined
            }
            endDate={form.watch("endDate") as Date | string | null | undefined}
            onStartDateChange={(date) =>
              form.setValue("startDate", date || null)
            }
            onEndDateChange={(date) => form.setValue("endDate", date || null)}
          />
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Categories</h3>
            <p className="text-sm text-muted-foreground">
              Organize your perk with categories and subcategories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <ParentCategoryFormSelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => (
                <SubcategoryFormSelect
                  categoryId={categoryId || undefined}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <Separator />

        {/* SEO Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">SEO & Meta Information</h3>
            <p className="text-sm text-muted-foreground">
              Optimize your perk for search engines and social sharing.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SEO optimized title"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="SEO meta description..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {field.value ? (
                        <IDImageViewer id={field.value} />
                      ) : (
                        <MediaUploadWidget
                          widgetProps={{
                            onSuccess: ({ info }, widget) => {
                              widget.close();

                              if (typeof info === "string") return;

                              saveMedia(
                                {
                                  url: info?.url || null,
                                  filename: info?.original_filename || "",
                                  publicId: info?.public_id || null,
                                  size: info?.bytes || 0,
                                  seoDescription:
                                    form.getValues("seoDescription") || "",
                                  seoTitle: form.getValues("seoTitle") || "",
                                  seoKeywords: ""
                                },
                                {
                                  onSuccess: (data) =>
                                    form.setValue("ogImageId", data.id)
                                }
                              );
                            }
                          }}
                        >
                          <Button
                            type="button"
                            variant="secondary"
                            className="bg-blue-600/10 text-blue-600 shadow-none hover:bg-blue-600/20 rounded-full"
                          >
                            Upload Image
                          </Button>
                        </MediaUploadWidget>
                      )}

                      <div className="">
                        {field.value && (
                          <p
                            className="cursor-pointer underline text-secondary-foreground"
                            onClick={() => form.setValue("ogImageId", null)}
                          >
                            Clear Selection
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canonicalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/canonical-url"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Keywords */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Keywords</h3>
            <p className="text-sm text-muted-foreground">
              Add relevant keywords to help users find this perk.
            </p>
          </div>

          <Keywords
            keywords={form.watch("keywords") || []}
            onKeywordsChange={(keywords) => form.setValue("keywords", keywords)}
          />
        </div>

        <Separator />

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/perks")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={updatingPerk} disabled={updatingPerk}>
            Update Perk
          </Button>
        </div>
      </form>
    </Form>
  );
}
