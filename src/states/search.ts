import { create } from "zustand";

import {
  DEFAULT_SETTINGS,
  getPrevSearchKey,
  setPrevSearchKey as persistPrevSearchKey,
  validateSettingsData,
} from "@/shared/storage";
import type { SearchKey } from "@/shared/models/address";

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

    // NOTE: preserved as-is from the original Recoil atom effect. This looks
    // inverted (skips restoring prevSearchKey when it IS valid) but this
    // migration is behavior-preserving; see PR description for the
    // discovered-bug follow-up.
    if (!prevSearchKey || validateSettingsData(prevSearchKey, DEFAULT_SETTINGS.prevSearchKey)) {
      return;
    }

    set({ prevSearchKey });
  },
}));
