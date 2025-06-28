import { Media } from "@/lib/zod/media.zod";
import { create } from "zustand";

interface MediaLibraryStore {
  sort: "asc" | "desc";
  search: string | undefined;
  page: string;
  limit: string;

  setSort: (sort: "asc" | "desc") => void;
  setSearch: (search: string) => void;
  setPage: (page: string) => void;
  setLimit: (limit: string) => void;

  selectedFiles: Media[];
  setSelectedFiles: (files: Media[]) => void;
}

export const useMediaLibraryStore = create<MediaLibraryStore>((set) => ({
  sort: "desc",
  search: undefined,
  page: "1",
  limit: "10",

  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),

  selectedFiles: [],
  setSelectedFiles: (files) => set({ selectedFiles: files })
}));
