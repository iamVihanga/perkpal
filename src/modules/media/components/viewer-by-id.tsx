/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import { useGetMediaByID } from "../queries/use-get-media-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";

type Props = {
  id?: string;
  url?: string;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function IDImageViewer({
  id,
  url,
  className,
  width,
  height,
  alt
}: Props) {
  if (!id && url) {
    return (
      <CldImage
        alt={alt || "Media Image"}
        width={width || 500}
        height={height || 500}
        src={url || ""}
        sizes="100vw"
        className={cn(
          "size-12 object-cover rounded-md border border-secondary",
          className
        )}
      />
    );
  }

  const { data, isLoading, error } = useGetMediaByID(id!);

  if (isLoading)
    return (
      <Skeleton
        className={cn(
          "size-12 rounded-md flex items-center justify-center",
          className
        )}
      >
        <Loader2 className="size-6 text-secondary animate-spin" />
      </Skeleton>
    );

  if (error) return <></>;

  const publicID = data?.publicId;
  const publicUrl = data?.url;

  return (
    <CldImage
      alt={alt || "Media Image"}
      width={width || 500}
      height={height || 500}
      src={publicID || publicUrl || ""}
      sizes="100vw"
      className={cn(
        "size-12 object-cover rounded-md border border-secondary",
        className
      )}
    />
  );
}
