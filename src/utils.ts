import { AddressData, SearchKey } from "./AddressManager";

const SETTINGS_KEY_SEARCH_RESULT = "searchResult";
const SETTINGS_KEY_CACHED_DATA = "addressData";
const SETTINGS_KEY_PREVIOUS_SEARCH_KEY = "prevSearchKey";

type Settings = {
    searchResult?: {
        showEng: boolean;
        showRoad: boolean;
        showLegacy: boolean;
    };
    addressData?: AddressData[];
    prevSearchKey?: SearchKey;
};

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
    },
};

export const initializeSettings = () => {
    chrome.storage.local.set(DEFAULT_SETTINGS);
};

export const loadSettings = () => {
    return new Promise<Settings>((resolve) => {
        chrome.storage.local.get([SETTINGS_KEY_SEARCH_RESULT], (settings) => {
            if (settings) {
                resolve(settings as Settings);
            } else {
                initializeSettings();
                resolve(DEFAULT_SETTINGS);
            }
        });
    });
};

export const loadCachedData = () => {
    return new Promise<Settings>((resolve) => {
        chrome.storage.local.get([SETTINGS_KEY_CACHED_DATA, SETTINGS_KEY_PREVIOUS_SEARCH_KEY], (data) => {
            resolve(data as Settings || DEFAULT_SETTINGS);
        });
    });
};

export const updateSettings = (settings: Settings) => {
    return new Promise((resolve, reject) => {
        if (getRuntime() === "extension") {
            chrome.storage.local.set(settings, () => {
                console.log("Settings updated!", settings);
                resolve();
            });
        } else {
            reject("It works on extension only.");
        }
    });
};

type Runtime = "other" | "page" | "extension";
type Environment = "development" | "production" | "text";

export const getEnv = () => {
    return window.__ENV__.NODE_ENV;
};

export const getRuntime = (): Runtime => {
    if (typeof chrome == "undefined" || typeof browser == "undefined") {
        return "other";
    } else if (browser.runtime.id || chrome.runtime.id) {
        return "extension";
    } else {
        return "page";
    }
};
