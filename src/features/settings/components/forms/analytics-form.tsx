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

const analyticsSettingsSchema = z.object({
  g4TrackingId: z.string().optional(),
  metaPixelId: z.string().optional()
});

type AnalyticsSettingsFormValues = z.infer<typeof analyticsSettingsSchema>;

interface FormProps {
  initialData: SiteSettingsMapT;
}

export function AnalyticsSettingsForm({ initialData }: FormProps) {
  const { mutate, isPending } = useUpdateSettings();

  const form = useForm<AnalyticsSettingsFormValues>({
    resolver: zodResolver(analyticsSettingsSchema),
    defaultValues: {
      g4TrackingId: initialData.g4TrackingId || "",
      metaPixelId: initialData.metaPixelId || ""
    }
  });

  const onSubmit = (values: AnalyticsSettingsFormValues) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Tracking</CardTitle>
            <CardDescription>
              Configure analytics and tracking tools for your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="g4TrackingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics 4 Tracking ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Pixel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890123456" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Meta (Facebook) Pixel ID for tracking and advertising
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
