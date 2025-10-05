"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  updateEducationSchema,
  type UpdateEducationSchemaT
} from "@/lib/zod/education.zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useUpdateEducation } from "../queries/use-update-education";
import { useGetEducationByID } from "../queries/use-get-category-by-id";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateEducationProps {
  id: string;
  children: React.ReactNode;
}

export function UpdateEducation({ id, children }: UpdateEducationProps) {
  const {
    data: currentEducation,
    isPending: isFetching,
    error: fetchError
  } = useGetEducationByID(id);
  const { mutateAsync, isPending } = useUpdateEducation(id);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<UpdateEducationSchemaT>({
    resolver: zodResolver(updateEducationSchema),
    defaultValues: {
      title: "",
      institution: "",
      year: ""
    }
  });

  useEffect(() => {
    if (currentEducation) {
      form.reset({
        title: currentEducation.title || "",
        institution: currentEducation.institution || "",
        year: currentEducation.year || ""
      });
    }
  }, [currentEducation, form]);

  const onSubmit = async (values: UpdateEducationSchemaT) => {
    try {
      await mutateAsync(values, {
        onSuccess: () => {
          form.reset();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Update Education</DialogTitle>
              <DialogDescription>
                Update education entry in your portfolio
              </DialogDescription>
            </DialogHeader>

            {isFetching && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}

            {fetchError && (
              <div className="text-red-500">{fetchError.message}</div>
            )}

            {currentEducation && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bachelor of Computer Science"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University of Technology"
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Year</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2020-2024"
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
              </>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
