import { EventEmitter } from "events";
import { getRuntime, merge } from "./utils";
import { AddressData, SearchKey } from "./AddressManager";

export const SETTINGS_KEY_SEARCH_RESULT = "searchResult";
export const SETTINGS_KEY_CACHED_DATA = "addressData";
export const SETTINGS_KEY_PREVIOUS_SEARCH_KEY = "prevSearchKey";

export type Settings = {
    searchResult?: {
        showEng?: boolean;
        showRoad?: boolean;
        showLegacy?: boolean;
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

export class SettingsManager<T> extends EventEmitter {

    settings: T | null = null;
    isUpdating: boolean = false;
    updateQueue: Array<[T, (value?: T | PromiseLike<T>) => void]> = [];

    constructor(defaultSettings: T) {
        super();
        (async () => {
            try {
                this.settings = await this.loadSettings();
            } catch (err) {
                console.error(err);
                chrome.storage.local.set(defaultSettings);
                this.settings = defaultSettings;
            } finally {
                this.emit("ready");
            }
        })();
    }

    get(key: keyof T) {
        if (!this.settings) {
            return null;
        }
        return this.settings[key];
    }

    loadSettings() {
        return new Promise<T>((resolve, reject) => {
            chrome.storage.local.get(null, (settings) => {
                if (settings) {
                    resolve(settings as T);
                } else {
                    reject("Settings not exists.");
                }
            });
        });
    }

    updateSettings(settings: T) {
        return new Promise<T>((resolve, reject) => {
            if (getRuntime() === "extension") {
                this.updateQueue.push([settings, resolve]);
                this.run();
            } else {
                reject("It works on extension only.");
            }
        });
    }

    run() {
        console.log("Update settings requested");
        if (this.updateQueue.length === 0) {
            console.warn("SettingsManager", "There's no item in settings queue!");
            return;
        }

        if (this.isUpdating) {
            console.log("settings currently updating...");
            return;
        }

        this.isUpdating = true;
        const request = this.updateQueue.shift();
        console.log("Deep merge result", merge(this.settings, request![0]));
        chrome.storage.local.set(merge(this.settings, request![0]), async () => {
            this.settings = await this.loadSettings();
            this.isUpdating = false;
            request![1](this.settings);
            console.log("Update succeeded");
            if (this.updateQueue.length) {
                this.run();
            }
        });
    }
}
