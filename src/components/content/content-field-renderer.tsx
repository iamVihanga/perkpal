import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ContentFieldsSelectT } from "@/lib/zod/pages.zod";

interface ContentFieldRendererProps {
  field: ContentFieldsSelectT;
  className?: string;
}

export function ContentFieldRenderer({
  field,
  className
}: ContentFieldRendererProps) {
  const { key, value, type } = field;

  if (!value) return null;

  switch (type) {
    case "text":
      return (
        <div className={className} data-field-key={key}>
          {value}
        </div>
      );

    case "rich_text":
      return (
        <div
          className={className}
          data-field-key={key}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );

    case "image":
      return (
        <div className={className} data-field-key={key}>
          <Image
            src={value}
            alt={key}
            width={800}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
            priority={key.includes("hero") || key.includes("banner")}
          />
        </div>
      );

    case "video":
      return (
        <div className={className} data-field-key={key}>
          <video
            src={value}
            controls
            className="w-full h-auto rounded-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );

    case "link":
      try {
        const url = value.startsWith("http") ? value : `https://${value}`;
        const urlObj = new URL(url);
        const isExternal =
          typeof window !== "undefined" &&
          urlObj.hostname !== window.location.hostname;

        return (
          <Link
            href={value.startsWith("http") ? value : `https://${value}`}
            className={className}
            data-field-key={key}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Link>
        );
      } catch {
        return (
          <span className={className} data-field-key={key}>
            {value}
          </span>
        );
      }

    case "number":
      return (
        <span className={className} data-field-key={key}>
          {Number(value).toLocaleString()}
        </span>
      );

    case "boolean":
      return (
        <span className={className} data-field-key={key}>
          {value === "true" ? "Yes" : "No"}
        </span>
      );

    default:
      return (
        <div className={className} data-field-key={key}>
          {value}
        </div>
      );
  }
}
