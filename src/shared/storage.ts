import type { AddressData, SearchKey } from "./models/address";
import { isExtension, getExtensionAPI } from "./utils";

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

const get = (key?: string) => {
  const extAPI = getExtensionAPI();
  if (isExtension() && extAPI) {
    return extAPI.storage.local.get(key);
  }

  if (key) {
    const raw = localStorage.getItem(key);
    return { [key]: raw ? JSON.parse(raw) : null };
  }

  return Array.from({ length: localStorage.length })
    .map((_, i) => localStorage.key(i))
    .filter((key): key is string => key !== "null")
    .reduce<Record<string, any>>((acc, storageKey) => {
      const raw = localStorage.getItem(storageKey);
      acc[storageKey] = raw ? JSON.parse(raw) : raw;
      return acc;
    }, {});
};

const set = (items: Record<string, any>) => {
  const extAPI = getExtensionAPI();
  if (isExtension() && extAPI) {
    return extAPI.storage.local.set(items);
  }

  return Object.entries(items).forEach(([key, value]) => {
    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  });
};

export const getAllStorageData = () => get();

export const getSearchResultOptions = async (): Promise<SearchResultOptions | null> => {
  const searchResultSettings = await get("searchResult");
  return searchResultSettings?.searchResult ?? null;
};

export const getRecentAddressList = async (): Promise<AddressData[] | null> => {
  const recentAddressList = await get("addressData");
  return recentAddressList?.addressData ?? null;
};

export const getPrevSearchKey = async (): Promise<SearchKey | null> => {
  const prevSearchKey = await get("prevSearchKey");
  return prevSearchKey?.prevSearchKey ?? null;
};

export const setSearchResultOptions = async (searchResultOptions: SearchResultOptions) => {
  set({ searchResult: searchResultOptions });
};

export const setRecentAddressList = async (addressList: AddressData[]) => {
  set({ addressData: addressList });
};

export const setPrevSearchKey = async (prevSearchKey: SearchKey | null) => {
  set({ prevSearchKey });
};

export const validateSettingsData = (
  settingsData: unknown,
  expected: Record<string, any> = DEFAULT_SETTINGS,
): boolean => {
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
