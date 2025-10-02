"use client";
import { IconSlideshow } from "@tabler/icons-react";
import {
  CheckCircle2,
  Loader2,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  XIcon
} from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useMediaStore, type MediaFile } from "../../store";
import { ActiveTab } from "../gallery-view";

type Props = {
  currentTab: ActiveTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadTab({ setCurrentTab }: Props) {
  const {
    isUploading,
    selectedFiles,
    clearSelectedFiles,
    removeFile,
    uploadAllFiles
  } = useMediaStore();

  const onDrop = useCallback(
    async (selectedFiles: File[]) =>
      useMediaStore.getState().addFiles(selectedFiles),
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    multiple: true,
    disabled: isUploading,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined
  });

  const handleDelete = (e: React.MouseEvent, file: MediaFile) => {
    e.preventDefault();
    e.stopPropagation();
    removeFile(file.id);
  };

  // When ready to upload
  const handleUpload = async () => {
    await uploadAllFiles();
    setCurrentTab("library");
  };

  return (
    <div className="h-full flex-1 relative">
      {/* Upload Dropzone */}
      {selectedFiles.length < 1 && (
        <div
          className={`w-full h-[340px] rounded-sm bg-secondary/50 hover:bg-primary/10 transition-all duration-200 hover:border-1 border-dashed hover:border-primary/50 flex items-center justify-center flex-col hover:cursor-pointer ${
            isDragActive ? "border-primary border-[1.5px]" : ""
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <IconSlideshow
            className="size-16 text-primary mb-2"
            strokeWidth={1}
          />

          <div className="mt-3 text-center space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              Upload your media files
            </h3>

            <div className="flex items-center flex-col justify-center space-y-1">
              <p className="text-sm text-primary/70">
                Drag and drop files here or click to select files from your
                device.
              </p>

              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{`Images, Videos & Docs`}</Badge>
                <Badge variant={"outline"}>
                  Max Size: {Number(MAX_SIZE / 1024 / 1024)} MB
                </Badge>
              </div>
            </div>

            <Button
              className="mt-2 cursor-pointer hover:shadow-lg"
              icon={<UploadIcon />}
              disabled={isUploading}
            >
              Choose Files
            </Button>
          </div>
        </div>
      )}

      {/* Uploaded File list */}
      {selectedFiles.length > 0 && (
        <Card className="w-full h-full min-h-[300px] rounded-sm px-4 py-3 shadow-none relative overflow-hidden transition-all duration-200 flex flex-col border-secondary/90">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected Files <span>{`(${selectedFiles.length})`}</span>
            </h4>

            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer"
                icon={<XIcon />}
                variant={"link"}
                size="sm"
                onClick={clearSelectedFiles}
                disabled={isUploading}
              >
                Clear Selection
              </Button>
              <Button
                className="cursor-pointer rounded-sm min-w-28 text-xs"
                icon={
                  isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadIcon />
                  )
                }
                variant={"default"}
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? "Uploading..." : "Upload All"}
              </Button>
            </div>
          </div>

          {/* Files List */}
          <div
            className={`flex-1 w-full relative ${
              isUploading ? "pointer-events-none" : ""
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} disabled={isUploading} />

            {/* Floating Add More Button */}
            <Button
              className="rounded-full size-11 absolute bottom-2 right-4 z-20 hover:shadow-lg cursor-pointer hover:-translate-y-1 transition-all duration-200"
              size="icon"
              disabled={isUploading}
            >
              <PlusIcon className="size-7" />
            </Button>

            {/* Drop State Overlay */}
            {isDragActive && !isUploading && (
              <div className="absolute inset-0 bg-primary/25 border-2 border-dashed border-primary/50 rounded-sm flex items-center justify-center flex-col gap-3 z-20 backdrop-blur-xs text-primary-foreground">
                <UploadIcon className="size-8 animate-bounce" />
                <p className="font-semibold text-lg">Drop files here</p>
              </div>
            )}

            <div className="grid grid-cols-5 gap-4 mt-4 pb-16">
              {selectedFiles.map((file, index) => (
                <UploadedImageCard
                  key={index}
                  file={file}
                  handleDelete={(e) => handleDelete(e, file)}
                  disabled={isUploading}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function UploadedImageCard({
  file,
  handleDelete,
  disabled = false
}: {
  file: MediaFile;
  handleDelete: (e: React.MouseEvent, file: MediaFile) => void;
  disabled?: boolean;
}) {
  const rowFile = file.file;

  return (
    <div
      className={`group w-full aspect-square rounded-md relative overflow-hidden hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg hover:border border-muted-foreground ${
        disabled ? "opacity-70" : ""
      }`}
    >
      <Image
        src={URL.createObjectURL(rowFile)}
        alt={file.name}
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />

      {/* Circular progress bar when uploading */}
      {file.uploadStatus !== "pending" && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 text-white flex items-center justify-center z-30">
          {file.uploadStatus === "uploading" && (
            <Loader2 className="size-14 animate-spin" strokeWidth={1} />
          )}
          {file.uploadStatus === "success" && (
            <CheckCircle2 className="size-14" strokeWidth={1} />
          )}
        </div>
      )}

      {!disabled && (
        <Button
          size="icon"
          className={`hidden group-hover:flex absolute top-2 right-2 rounded-full shadow-md z-20 cursor-pointer`}
          variant={"destructive"}
          onClick={(e) => handleDelete(e, file)}
          disabled={disabled}
        >
          <TrashIcon className="size-4" />
        </Button>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs text-white truncate">{file.name}</p>
        <p className="text-xs text-white/70">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
