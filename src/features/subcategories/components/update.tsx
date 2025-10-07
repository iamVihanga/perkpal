"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slug from "slug";

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
import { Input } from "@/components/ui/input";

import {
  updateSubcategorySchema,
  type UpdateSubcategoryT
} from "@/lib/zod/categories.zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { useUpdateSubcategory } from "../queries/use-update-subcategory";
import { useGetSubcategoryByID } from "../queries/use-get-subcategory-by-id";
import { PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";
import { useSaveMedia } from "@/modules/media/queries/use-save-media";
import { Card } from "@/components/ui/card";
import { useSubcategoryTableFilters } from "./subcategories-table/use-subcategory-table-filters";
import { ParentCategoryFormSelect } from "@/features/subcategories/components/parent-category-form-select";

interface UpdateSubcategoryProps {
  children?: React.ReactNode;
}

export function UpdateSubcategory({ children }: UpdateSubcategoryProps) {
  const { updateId, setUpdateId } = useSubcategoryTableFilters();

  const { data: currentSubcategory, isPending: isFetching } =
    useGetSubcategoryByID(updateId);

  const { mutate: saveMedia } = useSaveMedia();
  const { mutateAsync, isPending } = useUpdateSubcategory(updateId);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (updateId !== "") {
      setIsOpen(true);
    }
  }, [updateId]);

  const form = useForm<UpdateSubcategoryT>({
    resolver: zodResolver(updateSubcategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentCategoryId: "",
      seoTitle: null,
      seoDescription: null,
      ogImageId: null
    }
  });

  // Watch form "name" field and update "slug" field accordingly
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && value.name) {
        form.setValue("slug", slug(value.name));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (currentSubcategory) {
      form.reset({
        name: currentSubcategory.name || "",
        slug: currentSubcategory.slug || "",
        description: currentSubcategory.description || "",
        parentCategoryId: currentSubcategory.categoryId || "",
        seoTitle: currentSubcategory.seoTitle || null,
        seoDescription: currentSubcategory.seoDescription || null,
        ogImageId: currentSubcategory?.opengraphImage?.id || null
      });
    }
  }, [currentSubcategory, form]);

  const onSubmit = async (values: UpdateSubcategoryT) => {
    try {
      await mutateAsync(values, {
        onSuccess: () => {
          form.reset();
          setUpdateId("");
          setIsOpen(false);
        }
      });
    } catch (error) {
      // Error is handled by the mutation itself
      console.error("Update failed:", error);
    }
  };

  // Handle form submission manually to prevent default behavior
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(state) => {
          if (!state) {
            setUpdateId("");
          }
          setIsOpen(state);
        }}
        modal={false}
      >
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent
          className="sm:max-w-[480px] h-[85vh] p-0 flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
            <DialogTitle>Update Subcategory</DialogTitle>
            <DialogDescription>
              Update the details of the selected subcategory.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-6">
                  <div className="space-y-5 pb-6">
                    <ParentCategoryFormSelect
                      value={form.watch("parentCategoryId")}
                      onValueChange={(value: string) =>
                        form.setValue("parentCategoryId", value)
                      }
                      label="Parent Category"
                      required={true}
                      disabled={isFetching}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      disabled={isFetching}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Premium Dining, Gym Access etc..."
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
                        <FormItem>
                          <FormLabel className="text-sm">
                            Subcategory Slug
                          </FormLabel>
                          <FormControl>
                            <Input disabled {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      disabled={isFetching}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Subcategory Description"
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

                    <Separator />

                    <div className="space-y-5">
                      <h1 className="text-lg font-semibold">SEO Settings</h1>

                      <FormField
                        control={form.control}
                        name="seoTitle"
                        disabled={isFetching}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">SEO Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Subcategory SEO Optimized Title"
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
                        name="seoDescription"
                        disabled={isFetching}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              SEO Description
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Subcategory SEO Optimized Description"
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
                        name="ogImageId"
                        disabled={isFetching}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              OpenGraph Image
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-3">
                                {field.value ? (
                                  <IDImageViewer id={field.value} />
                                ) : (
                                  <MediaUploadWidget
                                    widgetProps={{
                                      onSuccess: ({ info }) => {
                                        if (typeof info === "string") return;

                                        saveMedia(
                                          {
                                            url: info?.url || null,
                                            filename:
                                              info?.original_filename || "",
                                            publicId: info?.public_id || null,
                                            size: info?.bytes || 0,
                                            seoDescription:
                                              form.getValues(
                                                "seoDescription"
                                              ) || "",
                                            seoTitle:
                                              form.getValues("seoTitle") || "",
                                            seoKeywords: ""
                                          },
                                          {
                                            onSuccess: (data) =>
                                              form.setValue(
                                                "ogImageId",
                                                data.id
                                              )
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
                                        form.setValue("ogImageId", null)
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
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 bg-secondary/40">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending} loading={isPending}>
                  Save Changes
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
