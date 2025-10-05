"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

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
  insertEducationSchema,
  type InsertEducationSchemaT
} from "@/lib/zod/education.zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useCreateEducation } from "../queries/use-create-education";

export function AddNewEducation() {
  const { mutateAsync, isPending } = useCreateEducation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<InsertEducationSchemaT>({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: {
      title: "",
      institution: "",
      year: ""
    }
  });

  const onSubmit = async (values: InsertEducationSchemaT) => {
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
          Add New Education
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Add New Education</DialogTitle>
              <DialogDescription>
                Add a new education entry to your portfolio
              </DialogDescription>
            </DialogHeader>

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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Add Education
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
