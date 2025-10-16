"use client";

import { CldUploadButton, CldUploadButtonProps } from "next-cloudinary";

import { cloudinaryPreset } from "@/lib/helpers";

interface MediaUploadButtonProps {
  buttonProps?: CldUploadButtonProps;
  children?: React.ReactNode;
}

export function MediaUploadButton(props: MediaUploadButtonProps) {
  return (
    <CldUploadButton
      uploadPreset={cloudinaryPreset}
      className=""
      {...props.buttonProps}
    >
      {props.children ? props.children : "Upload"}
    </CldUploadButton>
  );
}
