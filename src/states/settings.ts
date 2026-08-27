import { create } from "zustand";

import {
  DEFAULT_SETTINGS,
  getSearchResultOptions,
  setSearchResultOptions,
  validateSettingsData,
} from "@/shared/storage";
import type { DisplayOptions } from "@/shared/models/settings";

interface SettingsStore {
  addressDisplayOptions: DisplayOptions;
  setAddressDisplayOptions: (
    update: DisplayOptions | ((prev: DisplayOptions) => DisplayOptions),
  ) => void;
  hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  addressDisplayOptions: {
    engAddrShown: true,
    roadAddrShown: true,
    streetNumAddrShown: true,
  },
  setAddressDisplayOptions: (update) => {
    const addressDisplayOptions =
      typeof update === "function" ? update(get().addressDisplayOptions) : update;
    set({ addressDisplayOptions });
    setSearchResultOptions({
      showEng: addressDisplayOptions.engAddrShown,
      showRoad: addressDisplayOptions.roadAddrShown,
      showLegacy: addressDisplayOptions.streetNumAddrShown,
    });
  },
  hydrate: async () => {
    const options = await getSearchResultOptions();
    if (!options || !validateSettingsData(options, DEFAULT_SETTINGS.searchResult)) {
      return;
    }
    set({
      addressDisplayOptions: {
        engAddrShown: options.showEng,
        roadAddrShown: options.showRoad,
        streetNumAddrShown: options.showLegacy,
      },
    });
  },
}));
