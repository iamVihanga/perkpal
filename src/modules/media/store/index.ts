import { create } from "zustand";

import type { Progress } from "../types";
import { MediaService } from "../service";
import { toast } from "sonner";

export interface MediaFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string; // Object URL for preview
  uploadStatus: "pending" | "uploading" | "success" | "error";
  uploadProgress: number;
  uploadedUrl?: string;
  error?: string;
  createdAt: Date;
}

interface MediaStore {
  selectedFiles: MediaFile[];

  isUploading: boolean;
  uploadQueue: string[]; // IDs of files being uploaded

  // Actions for file selection
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearSelectedFiles: () => void;

  // Actions for upload management
  startUpload: (fileId: string) => void;
  updateUploadProgress: (fileId: string, progress: Progress) => void;
  completeUpload: (fileId: string, uploadedUrl: string) => void;
  failUpload: (fileId: string, error: string) => void;
  uploadAllFiles: () => Promise<void>;
}

// Helper Function
const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Media store using Zustand for state management
export const useMediaStore = create<MediaStore>((set, get) => ({
  selectedFiles: [],

  isUploading: false,
  uploadQueue: [],

  // Add Files Action
  addFiles: (files: File[]) => {
    const newFiles: MediaFile[] = files.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: createPreviewUrl(file),
      uploadStatus: "pending",
      uploadProgress: 0,
      createdAt: new Date()
    }));

    set((state) => ({
      selectedFiles: [...state.selectedFiles, ...newFiles]
    }));
  },

  // Remove File Action
  removeFile: (id: string) => {
    set((state) => {
      const fileToRemove = state.selectedFiles.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return {
        selectedFiles: state.selectedFiles.filter((f) => f.id !== id),
        uploadQueue: state.uploadQueue.filter((qId) => qId !== id)
      };
    });
  },

  // Clear Files Action
  clearSelectedFiles: () => {
    const { selectedFiles } = get();

    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    set({ selectedFiles: [], uploadQueue: [] });
  },

  // Start Upload Action
  startUpload: (fileId: string) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.map((file) =>
        file.id === fileId
          ? { ...file, uploadStatus: "uploading" as const, uploadProgress: 0 }
          : file
      ),
      uploadQueue: [...state.uploadQueue, fileId]
    }));
  },

  // Update Upload Progress Action
  updateUploadProgress: (fileId: string, progress: Progress) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.map((file) =>
        file.id === fileId
          ? { ...file, uploadProgress: Math.round(progress.percentage) }
          : file
      )
    }));
  },

  // Complete Upload Action
  completeUpload: (fileId: string, uploadedUrl: string) => {
    set((state) => {
      const file = state.selectedFiles.find((f) => f.id === fileId);
      if (!file) return state;

      return {
        selectedFiles: state.selectedFiles.map((f) =>
          f.id === fileId
            ? {
                ...f,
                uploadStatus: "success" as const,
                uploadedUrl,
                uploadProgress: 100
              }
            : f
        ),
        uploadQueue: state.uploadQueue.filter((id) => id !== fileId)
      };
    });
  },

  // Fail Upload Action
  failUpload: (fileId: string, error: string) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              uploadStatus: "error" as const,
              error,
              uploadProgress: 0
            }
          : file
      ),
      uploadQueue: state.uploadQueue.filter((id) => id !== fileId)
    }));
  },

  // Upload All Files Action
  uploadAllFiles: async () => {
    const mediaService = MediaService.getInstance();

    const {
      selectedFiles,
      startUpload,
      updateUploadProgress,
      completeUpload,
      failUpload,
      clearSelectedFiles
    } = get();

    const pendingFiles = selectedFiles.filter(
      (f) => f.uploadStatus === "pending"
    );

    if (pendingFiles.length === 0) return;

    set({ isUploading: true });

    // Upload files concurrently (you can limit concurrency if needed)
    const uploadPromises = pendingFiles.map(async (file) => {
      try {
        startUpload(file.id);

        const uploadResult = await mediaService.uploadFile({
          file: file.file,
          path: "/gallery",
          onProgress(progress) {
            updateUploadProgress(file.id, progress);
          }
        });

        completeUpload(file.id, uploadResult.url);
      } catch (error) {
        failUpload(
          file.id,
          error instanceof Error ? error.message : "Upload failed"
        );
      }
    });

    await Promise.allSettled(uploadPromises);

    // Get the updated state after all uploads are complete
    const updatedState = get();
    console.log(updatedState.selectedFiles);

    // Check if all uploads are done using the updated state
    const allDone = updatedState.selectedFiles.every(
      (f) => f.uploadStatus === "success" || f.uploadStatus === "error"
    );

    if (allDone) {
      // Optionally clear files after upload
      toast.success("All files uploaded successfully!");
      clearSelectedFiles();
    }

    set({ isUploading: false });
  }
}));
