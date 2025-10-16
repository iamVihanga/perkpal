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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RichTextEditor } from "@/modules/rich-text/editor";

const robotsSettingsSchema = z.object({
  robotsTxt: z.string().optional()
});

type RobotsSettingsFormValues = z.infer<typeof robotsSettingsSchema>;

interface FormProps {
  initialData: SiteSettingsMapT;
}

export function RobotsSettingsForm({ initialData }: FormProps) {
  const { mutate, isPending } = useUpdateSettings();

  const form = useForm<RobotsSettingsFormValues>({
    resolver: zodResolver(robotsSettingsSchema),
    defaultValues: {
      robotsTxt: initialData.robotsTxt || ""
    }
  });

  const onSubmit = (values: RobotsSettingsFormValues) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Robots.txt Configuration</CardTitle>
            <CardDescription>
              Configure robots.txt file content to control search engine
              crawlers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="robotsTxt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robots.txt Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="User-agent: *&#10;Disallow: /admin&#10;Allow: /"
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Define rules for search engine crawlers. This will be used
                    to generate your robots.txt file.
                  </FormDescription>
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
