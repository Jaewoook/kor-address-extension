import { create } from "zustand";

import {
  DEFAULT_SETTINGS,
  getPrevSearchKey,
  setPrevSearchKey as persistPrevSearchKey,
  validateSettingsData,
} from "@shared/storage";
import type { SearchKey } from "@shared/models/address";

interface SearchStore {
  searchKeyword: string;
  searching: boolean;
  prevSearchKey: SearchKey | null;
  setSearchKeyword: (keyword: string) => void;
  setSearching: (searching: boolean) => void;
  setPrevSearchKey: (searchKey: SearchKey | null) => void;
  hydrate: () => Promise<void>;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchKeyword: "",
  searching: false,
  prevSearchKey: null,
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  setSearching: (searching) => set({ searching }),
  setPrevSearchKey: (prevSearchKey) => {
    set({ prevSearchKey });
    persistPrevSearchKey(prevSearchKey);
  },
  hydrate: async () => {
    const prevSearchKey = await getPrevSearchKey();
    set({ searchKeyword: prevSearchKey?.keyword ?? "" });

    if (!prevSearchKey || !validateSettingsData(prevSearchKey, DEFAULT_SETTINGS.prevSearchKey)) {
      return;
    }

    set({ prevSearchKey });
  },
}));
