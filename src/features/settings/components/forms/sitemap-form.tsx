"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, TrashIcon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const sitemapPageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  priority: z.string().optional(),
  changefreq: z.string().optional(),
  lastmod: z.string().optional()
});

const sitemapSettingsSchema = z.object({
  pages: z.array(sitemapPageSchema)
});

type SitemapSettingsFormValues = z.infer<typeof sitemapSettingsSchema>;
type SitemapPage = z.infer<typeof sitemapPageSchema>;

interface FormProps {
  initialData: SiteSettingsMapT;
}

export function SitemapSettingsForm({ initialData }: FormProps) {
  const { mutate, isPending } = useUpdateSettings();

  // Parse sitemapJson from database or use default
  const parseSitemapJson = (jsonString?: string): SitemapPage[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse sitemap JSON:", error);
      return [];
    }
  };

  const form = useForm<SitemapSettingsFormValues>({
    resolver: zodResolver(sitemapSettingsSchema),
    defaultValues: {
      pages: parseSitemapJson(initialData.sitemapJson)
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pages"
  });

  const onSubmit = (values: SitemapSettingsFormValues) => {
    // Stringify the pages array to save in database
    const sitemapJson = JSON.stringify(values.pages);
    mutate({ sitemapJson });
  };

  const addNewPage = () => {
    append({
      slug: "",
      title: "",
      priority: "0.5",
      changefreq: "weekly",
      lastmod: new Date().toISOString().split("T")[0]
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap Configuration</CardTitle>
            <CardDescription>
              Manage pages to include in your XML sitemap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pages added yet. Click &quot;Add Page&quot; to get started.
              </div>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border bg-transparent dark:bg-secondary-foreground/5 rounded-lg p-4 space-y-4 relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Page {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`pages.${index}.slug`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="/about-us" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL path (e.g., /about-us)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`pages.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="About Us" {...field} />
                        </FormControl>
                        <FormDescription>Page title</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`pages.${index}.priority`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                            <SelectItem value="0.9">0.9</SelectItem>
                            <SelectItem value="0.8">0.8</SelectItem>
                            <SelectItem value="0.7">0.7</SelectItem>
                            <SelectItem value="0.6">0.6</SelectItem>
                            <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                            <SelectItem value="0.4">0.4</SelectItem>
                            <SelectItem value="0.3">0.3</SelectItem>
                            <SelectItem value="0.2">0.2</SelectItem>
                            <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Page importance (0.0 - 1.0)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`pages.${index}.changefreq`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Change Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How often the page changes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`pages.${index}.lastmod`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Last Modified</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Last modification date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addNewPage}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
