import { create } from "zustand";

import { getThemeMode, setThemeMode as persistThemeMode } from "@shared/storage";
import type { ThemeMode } from "@shared/models/theme";

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "system",
  setMode: (mode) => {
    set({ mode });
    persistThemeMode(mode);
  },
  hydrate: async () => {
    const mode = await getThemeMode();
    if (mode) {
      set({ mode });
    }
  },
}));
