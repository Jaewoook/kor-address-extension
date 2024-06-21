import type { Browser } from "webextension-polyfill";
import type { AddressData, SearchKey } from "./models/address";
import { isExtension } from "./utils";

let browser: Browser | null = null;
if (isExtension()) {
  browser = await import("webextension-polyfill");
}

type SearchResultOptions = {
  showEng: boolean;
  showRoad: boolean;
  showLegacy: boolean;
};

export type Settings = Partial<{
  searchResult: Partial<SearchResultOptions>;
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

export const getAllStorageData = () => {
  if (!isExtension() || !browser) {
    console.info("This runtime does not running on extension");
    return null;
  }
  return browser.storage.local.get();
};

export const getSearchResultSettings = () => {
  if (!isExtension() || !browser) {
    console.info("This runtime does not running on extension");
    return null;
  }
  return browser.storage.local.get("searchResult");
};

export const validateSettingsData = (settingsData: unknown, expected: Record<string, any> = DEFAULT_SETTINGS): boolean => {
  if (typeof settingsData !== "object" || settingsData === null) {
    return false;
  }

  const expectedKeys = Object.keys(expected);
  return Object.entries(settingsData).every(([k, v]) => {
    if (!expectedKeys.includes(k)) {
      return false;
    }

    if (typeof v === "object" && v !== null) {
      return validateSettingsData(v, expected[k]);
    }

    return typeof v === typeof expected[k];
  });
};
