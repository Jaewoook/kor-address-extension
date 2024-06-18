/**
 * Internal modules
 */
import { AddressData, SearchKey } from "./AddressManager";
import { isExtension, merge } from "./utils";

export const SETTINGS_KEY_SEARCH_RESULT = "searchResult";
export const SETTINGS_KEY_CACHED_DATA = "addressData";
export const SETTINGS_KEY_PREVIOUS_SEARCH_KEY = "prevSearchKey";

export type Settings = Partial<{
  searchResult: Partial<{
    showEng: boolean;
    showRoad: boolean;
    showLegacy: boolean;
  }>;
  addressData: AddressData[];
  prevSearchKey: SearchKey;
}>;

export const DEFAULT_SETTINGS: Settings = {
  searchResult: {
    showEng: false,
    showRoad: true,
    showLegacy: true,
  },
  addressData: [],
  prevSearchKey: {
    countPerPage: "20",
    currentPage: "1",
    keyword: "",
    end: false,
  },
};

export class SettingsManager<T> {
  settings: T | null = null;

  constructor(defaultSettings: T) {
    this.loadSettings()
      .then((settings) => {
        this.settings = settings;
      })
      .catch((err) => {
        console.error(err);
        this.settings = defaultSettings;
        chrome.storage.local.set(defaultSettings);
      });
  }

  get(key: keyof T) {
    return this.settings?.[key];
  }

  async loadSettings() {
    if (!isExtension()) {
      return null;
    }

    const settings = await chrome.storage.local.get(null);
    if (settings) {
      return settings as T;
    } else {
      throw new Error("Settings not exists.");
    }
  }

  async updateSettings(settings: T) {
    if (isExtension()) {
      await chrome.storage.local.set(merge(this.settings, settings));
    } else {
      throw new Error("It works on extension only.");
    }
  }
}
