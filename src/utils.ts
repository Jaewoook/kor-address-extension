const SETTINGS_KEY_SEARCH_RESULT = "searchResult";

type Settings = {
    searchResult: {
        showEng: boolean;
        showRoad: boolean;
        showLegacy: boolean;
    };
};

export const DEFAULT_SETTINGS: Settings = {
    searchResult: {
        showEng: false,
        showRoad: true,
        showLegacy: true,
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

export const updateSettings = (settings: Settings) => {
    return new Promise((resolve, reject) => {
        if (getRuntime() === "extension") {
            chrome.storage.local.set(settings, () => {
                console.log("Settings updated!");
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
    if (!chrome) {
        return "other";
    } else if (chrome.runtime.id) {
        return "extension";
    } else {
        return "page";
    }
};
