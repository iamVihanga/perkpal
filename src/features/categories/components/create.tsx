"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  createCategorySchema,
  type CreateCategoryT
} from "@/lib/zod/categories.zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useCreateCategory } from "../queries/use-create-category";
import { Separator } from "@/components/ui/separator";

export function AddNewCategory() {
  const { mutateAsync, isPending } = useCreateCategory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<CreateCategoryT>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
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

  const onSubmit = async (values: CreateCategoryT) => {
    try {
      await mutateAsync(values, {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        }
      });
    } catch (error) {
      // Error is handled by the mutation itself
      console.error("Create failed:", error);
    }
  };

  // Handle form submission manually to prevent default behavior
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px] h-[85vh] p-0 flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Add a new parent category to organize your perks.
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
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Life Style, Co-Working etc..."
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
                        <FormLabel className="text-sm">Category Slug</FormLabel>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Category Description"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">SEO Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Category SEO Optimized Title"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            SEO Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Category SEO Optimized Description"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            Test OG Image ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Test Field"
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
                Add Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
