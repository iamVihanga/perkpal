"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import slug from "slug";

import { cn } from "@/lib/utils";
import { createPerkSchema, CreatePerkT } from "@/lib/zod/perks.zod";
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
import { useCreatePerk } from "../queries/use-create-perk";

type Props = {
  className?: string;
};

export function CreatePerk({ className }: Props) {
  const { mutate: saveMedia } = useSaveMedia();
  const { mutate: createPerk, isPending: creatingPerk } = useCreatePerk();

  const form = useForm({
    resolver: zodResolver(createPerkSchema),
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

  // Watch redemption method for reactive updates
  const redemptionMethod = form.watch("redemptionMethod");
  const categoryId = form.watch("categoryId");

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

  // Form submit handler
  const onSubmit = (data: CreatePerkT) => {
    console.log("Form Data:", data);

    // Validate with schema on client side for debugging
    try {
      const validatedData = createPerkSchema.parse(data);
      console.log("Client validation passed:", validatedData);
      createPerk(validatedData);
    } catch (error) {
      console.error("Client validation failed:", error);
      return;
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col gap-6", className)}>
          <div className="flex flex-1 items-center gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Perk Title</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="Enter perk title"
                      {...field}
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
                <FormItem className="flex-1">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="Enter perk slug"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="shadow-none"
                    placeholder="Enter short description"
                    {...field}
                    value={field.value || ""}
                    rows={3}
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
              <FormItem className="flex-1">
                <FormLabel>Long Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field?.value || ""}
                    onChange={field.onChange}
                    className="min-h-[200px] bg-card shadow-none"
                    // placeholder="Write full description here..."
                    // disabled={isPending}
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
              <FormItem className="flex-1">
                <FormLabel>Vendor Name</FormLabel>
                <FormControl>
                  <Input
                    className="shadow-none"
                    placeholder="Enter vendor / brand name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Uploads */}
          <div className="flex items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
                  <FormLabel>Banner</FormLabel>
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

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-2">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center gap-6"
                  >
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="Global" />
                      </FormControl>
                      <FormLabel className="font-normal">Global</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="Malaysia" />
                      </FormControl>
                      <FormLabel className="font-normal">Malaysia</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="Singapore" />
                      </FormControl>
                      <FormLabel className="font-normal">Singapore</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Validity Date Selector */}
          <div className="space-y-2">
            <ValidityDateSelector
              startDate={
                form.watch("startDate") as Date | string | null | undefined
              }
              endDate={
                form.watch("endDate") as Date | string | null | undefined
              }
              onStartDateChange={(date) =>
                form.setValue("startDate", date || null)
              }
              onEndDateChange={(date) => form.setValue("endDate", date || null)}
            />

            {(form.watch("startDate") || form.watch("endDate")) && (
              <p
                onClick={() => {
                  form.setValue("startDate", null);
                  form.setValue("endDate", null);
                }}
                className="text-xs text-secondary-foreground cursor-pointer hover:underline"
              >
                Clear Dates
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <ParentCategoryFormSelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  className="flex-1"
                  label="Category"
                />
              )}
            />
            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => (
                <SubcategoryFormSelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  categoryId={categoryId}
                  className="flex-1"
                  label="Subcategory"
                />
              )}
            />
          </div>

          <div className="space-y-2 mt-4">
            <h2 className="font-semibold text-secondary-foreground/60">
              Redemption Details
            </h2>

            <Separator />
          </div>

          {/* Redemption selector */}
          <FormField
            control={form.control}
            name="redemptionMethod"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>Redemption Method</FormLabel>
                <FormControl>
                  <RedemptionSelector
                    selected={field.value}
                    onSelect={(val) => field.onChange(val)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="space-y-2 mt-4">
            <h2 className="font-semibold text-secondary-foreground/60">
              SEO Details
            </h2>

            <Separator />
          </div>

          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>SEO Title</FormLabel>
                <FormControl>
                  <Input
                    className="shadow-none"
                    placeholder="Enter SEO Title"
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
              <FormItem className="flex-1">
                <FormLabel>SEO Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="shadow-none"
                    placeholder="Enter SEO Description"
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
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Canonical URL</FormLabel>
                <FormControl>
                  <Input
                    className="shadow-none"
                    placeholder="Enter Canonical URL"
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
              <FormItem className="flex-1">
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

          <div className="space-y-2 mt-4">
            <h2 className="font-semibold text-secondary-foreground/60">
              Additional Details
            </h2>

            <Separator />
          </div>

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Keywords
                    keywords={field.value || []}
                    onKeywordsChange={field.onChange}
                    placeholder="Add keywords for better discoverability..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-secondary/40 border border-secondary rounded-md mt-8 p-4 flex items-center justify-between">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={field.value === "active" ? true : false}
                      onCheckedChange={(val) => {
                        if (val === true) {
                          field.onChange("active");
                        } else {
                          field.onChange("inactive");
                        }
                      }}
                    />

                    <FormLabel>
                      Status -{" "}
                      <span
                        className={cn("", {
                          "text-primary": field.value === "active",
                          "text-red-600": field.value === "inactive"
                        })}
                      >
                        {field.value === "active" ? "Active" : "Inactive"}
                      </span>
                    </FormLabel>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={creatingPerk}>
              {creatingPerk ? "Creating..." : "Create Perk"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
