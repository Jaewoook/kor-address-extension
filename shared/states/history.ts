import { create } from "zustand";

import {
  getSearchHistory,
  getSearchHistoryLimit,
  setSearchHistory as persistSearchHistory,
  setSearchHistoryLimit as persistSearchHistoryLimit,
} from "@shared/storage";
import type { SearchHistoryLimit } from "@shared/models/history";

interface SearchHistoryStore {
  history: string[];
  searchHistoryLimit: SearchHistoryLimit;
  addKeyword: (keyword: string) => void;
  setSearchHistoryLimit: (
    update: SearchHistoryLimit | ((prev: SearchHistoryLimit) => SearchHistoryLimit),
  ) => void;
  clearHistory: () => void;
  hydrate: () => Promise<void>;
}

export const useSearchHistoryStore = create<SearchHistoryStore>((set, get) => ({
  history: [],
  searchHistoryLimit: { enabled: true, value: 50 },
  addKeyword: (keyword) => {
    const { history, searchHistoryLimit } = get();
    const deduped = history.filter((entry) => entry !== keyword);
    let next = [keyword, ...deduped];
    if (searchHistoryLimit.enabled) {
      next = next.slice(0, searchHistoryLimit.value);
    }
    set({ history: next });
    persistSearchHistory(next);
  },
  setSearchHistoryLimit: (update) => {
    const searchHistoryLimit =
      typeof update === "function" ? update(get().searchHistoryLimit) : update;
    set({ searchHistoryLimit });
    persistSearchHistoryLimit(searchHistoryLimit);
  },
  clearHistory: () => {
    set({ history: [] });
    persistSearchHistory([]);
  },
  hydrate: async () => {
    const [history, searchHistoryLimit] = await Promise.all([
      getSearchHistory(),
      getSearchHistoryLimit(),
    ]);
    if (history) {
      set({ history });
    }
    if (searchHistoryLimit) {
      set({ searchHistoryLimit });
    }
  },
}));
