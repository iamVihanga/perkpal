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
  FormDescription,
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

type Props = {
  className?: string;
};

export function CreatePerk({ className }: Props) {
  const { mutate: saveMedia } = useSaveMedia();

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
      startDate: new Date(),
      endDate: undefined,
      keywords: [],
      categoryId: null,
      subcategoryId: null,
      isFeatured: false,
      status: "active",
      seoTitle: null,
      seoDescription: null,
      ogImageId: null
    }
  });

  // Update slug listener
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        if (value.title === "") {
          form.setValue("slug", "");
          return;
        }

        form.setValue("slug", slug(value.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Form submit handler
  const onSubmit = (data: CreatePerkT) => {
    console.log("Form Data: ", data);
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
          </div>
        </div>
      </form>
    </Form>
  );
}
