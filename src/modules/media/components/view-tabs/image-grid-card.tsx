import React from "react";
import Image from "next/image";
import { useMediaLibraryStore } from "../../store/library-store";
import { Media } from "@/lib/zod/media.zod";
import { CheckIcon } from "lucide-react";

export default function ImageGridCard({ media }: { media: Media }) {
  const { id, url, filename, type } = media;
  const { selectedFiles, setSelectedFiles } = useMediaLibraryStore();
  const isSelected = selectedFiles.some((file) => file.id === id);

  const handleSelect = () => {
    if (isSelected) {
      setSelectedFiles(selectedFiles.filter((file) => file.id !== id));
    } else {
      setSelectedFiles([...selectedFiles, media]);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`group w-full aspect-square rounded-md relative overflow-hidden hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg hover:border border-muted-foreground ${
        isSelected && "border-primary border-2"
      }`}
    >
      {/* Select Button on hover and selected state */}
      <div className="absolute top-2 left-2">
        {isSelected ? (
          <div className="flex size-6 rounded-full bg-primary items-center justify-center">
            <CheckIcon className="text-white size-3" />
          </div>
        ) : (
          <div className="group-hover:flex hidden size-6 rounded-full border border-primary" />
        )}
      </div>

      <Image
        src={url}
        alt={filename}
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs text-white truncate">{filename}</p>
        <p className="text-xs text-white/70 capitalize">{type}</p>
      </div>
    </div>
  );
}
