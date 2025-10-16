"use client";

import React, { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Settings, PlusIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { pagesUpdateSchema, PagesUpdateT } from "@/lib/zod/pages.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";

import { useSaveMedia } from "@/modules/media/queries/use-save-media";
import { useUpdatePage } from "../queries/use-update-page";
import { useGetPage } from "../queries/use-get-page";

type Props = {
  pageSlug: string;
};

export function EditPageSettings({ pageSlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch existing page data
  const {
    data: pageData,
    error: pageDataError,
    isPending: isPageLoading
  } = useGetPage({ pageSlug });

  const { mutate: saveMedia } = useSaveMedia();
  const { mutate: updatePage, isPending: isUpdating } = useUpdatePage();

  const form = useForm<PagesUpdateT>({
    resolver: zodResolver(pagesUpdateSchema),
    defaultValues: {
      title: "",
      seoTitle: "",
      seoDescription: "",
      og_image_id: null
    }
  });

  // Populate form with existing data when page data is loaded
  useEffect(() => {
    if (pageData && isOpen) {
      form.reset({
        title: pageData.title || "",
        seoTitle: pageData.seoTitle || "",
        seoDescription: pageData.seoDescription || "",
        og_image_id: pageData.ogImage?.id || null
      });
    }
  }, [pageData, isOpen, form]);

  // Check if form has any changes from original data
  const formValues = form.watch();
  const hasChanges =
    pageData &&
    (formValues.title !== (pageData.title || "") ||
      formValues.seoTitle !== (pageData.seoTitle || "") ||
      formValues.seoDescription !== (pageData.seoDescription || "") ||
      formValues.og_image_id !== (pageData.ogImage?.id || null));

  const onSubmit = (data: PagesUpdateT) => {
    updatePage(
      { pageSlug, value: data },
      {
        onSuccess: () => {
          setIsOpen(false);
          // Reset form after successful update
          form.reset();
        }
      }
    );
  };

  // Show error state if page data failed to load
  if (pageDataError) {
    return (
      <Button variant="outline" disabled>
        <Settings className="mr-2 h-4 w-4" />
        Error Loading Page
      </Button>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isPageLoading}>
            {isPageLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}
            Edit Page Settings
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[480px] p-0 flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
            <DialogTitle>Edit Page Settings</DialogTitle>
            <DialogDescription>
              {`Adjust metadata to improve page's SEO presence.`}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden px-6"
            >
              {isPageLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading page data...
                  </span>
                </div>
              ) : (
                <div className="space-y-4 flex-1 pb-6 overflow-y-auto">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              pageData?.title
                                ? `Current: ${pageData.title}`
                                : "e.g., Homepage, About, Contact"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">SEO Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              pageData?.seoTitle
                                ? `Current: ${pageData.seoTitle}`
                                : "Enter SEO title for better search visibility"
                            }
                            {...field}
                            value={(field.value as string) || ""}
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
                        <FormLabel className="text-sm">
                          SEO Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              pageData?.seoDescription
                                ? `Current: ${pageData.seoDescription}`
                                : "Enter SEO description for better search visibility"
                            }
                            {...field}
                            name={field.name}
                            value={(field.value as string) || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="og_image_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          OpenGraph Image
                          {pageData?.ogImage && !field.value && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Current image will be retained)
                            </span>
                          )}
                        </FormLabel>
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
                                          form.getValues("seoDescription") ||
                                          "",
                                        seoTitle:
                                          form.getValues("seoTitle") || "",
                                        seoKeywords: ""
                                      },
                                      {
                                        onSuccess: (data) =>
                                          form.setValue("og_image_id", data.id)
                                      }
                                    );
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
                                    form.setValue("og_image_id", null)
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
                </div>
              )}

              <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 bg-secondary/40 -mx-6">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isUpdating || !pageData || !hasChanges}
                  loading={isUpdating}
                >
                  {isUpdating
                    ? "Updating..."
                    : hasChanges
                    ? "Update Page"
                    : "No Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
      )}
    </>
  );
}
