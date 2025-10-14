"use client";

import React, { useState } from "react";
import slugify from "slug";

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
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import {
  contentFieldsCreateSchema,
  type ContentFieldsCreateT,
  type ContentFieldType
} from "@/lib/zod/pages.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateField } from "../queries/use-create-field";
import { PlusCircleIcon } from "lucide-react";

type Props = {
  sectionId?: string;
  pageSlug: string;
};

export function CreateFieldDialog({ sectionId, pageSlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreateField();

  const form = useForm<ContentFieldsCreateT>({
    resolver: zodResolver(contentFieldsCreateSchema),
    defaultValues: {
      sectionId: sectionId || null,
      type: "text",
      key: "",
      metadata: {}
    }
  });

  const onSubmit = (data: ContentFieldsCreateT) => {
    mutate(
      {
        pageSlug,
        value: data
      },
      {
        onSuccess: () => setIsOpen(false)
      }
    );
  };

  const contentFieldTypes: { value: ContentFieldType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "rich_text", label: "Rich Text" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "link", label: "Link" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add New Field
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px] p-0  flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>Add New Field</DialogTitle>
          <DialogDescription>
            Add a new content field for page/section.
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
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., heading, description, title"
                        {...field}
                        onChange={(val) =>
                          field.onChange(slugify(val.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {`* This field is slugify by the default`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Field Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contentFieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
