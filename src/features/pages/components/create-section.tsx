"use client";

import React, { useState } from "react";

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
import { useForm } from "react-hook-form";
import { sectionsCreateSchema, SectionsCreateT } from "@/lib/zod/pages.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useCreateSection } from "../queries/use-create-section";

type Props = {
  pageSlug: string;
};

export function CreatePageSection({ pageSlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreateSection();

  const form = useForm<SectionsCreateT>({
    resolver: zodResolver(sectionsCreateSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  });

  const onSubmit = (value: SectionsCreateT) => {
    mutate({ pageSlug, value }, { onSuccess: () => setIsOpen(false) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add New Section
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px] p-0  flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Add a new content section for the page.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden px-6"
          >
            <div className="space-y-4 flex-1 pb-6 overflow-y-auto">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hero Section, FAQ, Contact"
                        {...field}
                      />
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
                        placeholder="e.g., This is the hero section of the page"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 bg-secondary/40 -mx-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Add Field
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
