"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUpdateSettings } from "../../queries/use-update-settings";
import { SiteSettingsMapT } from "@/lib/zod/settings.zod";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RichTextEditor } from "@/modules/rich-text/editor";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";
import { PlusIcon } from "lucide-react";

const seoSettingsSchema = z.object({
  defaultMetaTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  defaultOpenGraphImage: z.string().optional()
});

type SEOSettingsFormValues = z.infer<typeof seoSettingsSchema>;

interface FormProps {
  initialData: SiteSettingsMapT;
}

export function SEOSettingsForm({ initialData }: FormProps) {
  const { mutate, isPending } = useUpdateSettings();

  const form = useForm<SEOSettingsFormValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      defaultMetaTitle: initialData.defaultMetaTitle || "",
      defaultMetaDescription: initialData.defaultMetaDescription || "",
      defaultOpenGraphImage: initialData.defaultOpenGraphImage || ""
    }
  });

  const onSubmit = (values: SEOSettingsFormValues) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Configure default meta tags and SEO settings for your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="defaultMetaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Website Name - Tagline"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Default title tag for pages without a specific title (50-60
                    characters recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultMetaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write a compelling description of your website..."
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Default meta description for pages without a specific
                    description (150-160 characters recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultOpenGraphImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Open Graph Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {field.value ? (
                        <IDImageViewer url={field.value} />
                      ) : (
                        <MediaUploadWidget
                          widgetProps={{
                            onSuccess: ({ info }, widget) => {
                              widget.close();

                              if (!info || typeof info === "string") return;

                              form.setValue("defaultOpenGraphImage", info.url);
                            }
                          }}
                        >
                          <Card className="bg-secondary/60 hover:bg-secondary/30 cursor-pointer transition-colors duration-200 ease-in-out size-12 p-0 border border-dashed flex items-center justify-center">
                            <PlusIcon className="size-6 text-secondary-foreground/80" />
                          </Card>
                        </MediaUploadWidget>
                      )}

                      <div className="">
                        {field.value && (
                          <p
                            className="cursor-pointer underline text-secondary-foreground"
                            onClick={() =>
                              form.setValue("defaultOpenGraphImage", "")
                            }
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
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
