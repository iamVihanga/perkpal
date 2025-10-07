"use client";

import { UploadIcon } from "lucide-react";
import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { cloudinaryPreset } from "@/lib/helpers";

interface MediaUploadWidgetProps {
  widgetProps?: CldUploadWidgetProps;
  children?: React.ReactNode;
}

export function MediaUploadWidget(props: MediaUploadWidgetProps) {
  return (
    <CldUploadWidget uploadPreset={cloudinaryPreset} {...props.widgetProps}>
      {({ open }) => {
        return props.children ? (
          <div onClick={() => open()}>{props.children}</div>
        ) : (
          <Button onClick={() => open()} icon={<UploadIcon />}>
            Upload Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
