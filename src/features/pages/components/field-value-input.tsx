"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TrashIcon } from "lucide-react";

import { ContentFieldsSelectT } from "@/lib/zod/pages.zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/modules/rich-text/editor";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useUpdateField } from "../queries/use-update-field";
import { useRemoveField } from "../queries/use-remove-field";

type Props = {
  contentField: ContentFieldsSelectT;
};

export function FieldValueInput({ contentField }: Props) {
  const [fieldValue, setFieldValue] = useState(contentField.value);
  const { mutate: updateField, isPending } = useUpdateField();
  const { mutate: deleteField, isPending: isDeleting } = useRemoveField();

  const handleFieldUpdate = () => {
    updateField({
      pageId: contentField.pageId,
      fieldId: contentField.id,
      value: fieldValue
    });
  };

  const handleRemoveField = () => {
    deleteField({
      pageId: contentField.pageId,
      fieldId: contentField.id
    });
  };

  if (!contentField) return <></>;

  return (
    <div className="w-full flex items-center justify-end gap-2">
      {/* Input */}
      {contentField.type === "text" && (
        <Input
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="shadow-none w-full flex-1"
        />
      )}

      {contentField.type === "rich_text" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-blue-600/10 text-blue-600 shadow-none hover:bg-blue-600/20 rounded-full"
            >
              Open Editor
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[700px]">
            <RichTextEditor
              content={fieldValue}
              onChange={(content) => setFieldValue(content)}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close Editor</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {contentField.type === "image" && (
        <>
          {fieldValue ? (
            <Image
              src={fieldValue}
              alt="Field Image"
              width={100}
              height={100}
              className="size-10 object-cover rounded-md"
            />
          ) : (
            <MediaUploadWidget
              widgetProps={{
                onSuccess: ({ info }, widget) => {
                  widget.close();

                  if (!info || typeof info === "string") return;

                  setFieldValue(info.secure_url);
                }
              }}
            >
              <Button
                type="button"
                variant="secondary"
                className="bg-blue-600/10 text-blue-600 shadow-none hover:bg-blue-600/20 rounded-full"
              >
                Upload Image
              </Button>
            </MediaUploadWidget>
          )}
        </>
      )}

      {/* Action Buttons */}
      <Button
        onClick={handleFieldUpdate}
        variant={"outline"}
        disabled={fieldValue === contentField.value}
        loading={isPending}
      >
        Update
      </Button>

      <Button
        onClick={handleRemoveField}
        variant={"outline"}
        icon={<TrashIcon />}
        loading={isDeleting}
      >
        Remove
      </Button>
    </div>
  );
}
