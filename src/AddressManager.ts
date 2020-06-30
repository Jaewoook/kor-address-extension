import axios from "axios";
import { getRuntime } from "./utils";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

const JUSO_API = "http://www.juso.go.kr/addrlink/addrLinkApi.do";
const API_KEY = "U01TX0FVVEgyMDIwMDUyMTEzNTUwOTEwOTc4NDI=";

export type AddressData = {
    roadAddr: string;
    roadAddrPart1: string;
    roadAddrPart2?: string;
    jibunAddr: string;
    engAddr: string;
    zipNo: string;
};

export type SearchKey = {
    currentPage: string;
    countPerPage: string;
    keyword: string;
    end: boolean;
};

type AddressResponse = {
    common: {
        totalCount: string;
        currentPage: number;
        countPerPage: number;
        errorCode: string;
        errorMessage: string;
    };
    juso: AddressData[];
};

type APIResponse = {
    results: AddressResponse;
}

export class AddressManager {

    previousSearchKey: SearchKey | null = null;
    addressData: AddressData[] = [];
    settingsManager: SettingsManager<Settings> | null = null;

    constructor(settingsManager: SettingsManager<Settings> | null) {
        this.settingsManager = settingsManager;

        if (this.settingsManager && getRuntime() === "extension") {
            this.settingsManager.once("ready", () => {
                const settings = this.settingsManager?.settings;
                if (!settings) {
                    console.warn("AddressManager", "No settings found!");
                    return;
                }
                this.addressData = settings.addressData || [];
                this.previousSearchKey = settings.prevSearchKey || DEFAULT_SETTINGS.prevSearchKey as SearchKey;
            });
        }
    }

    search(searchKey: SearchKey, append?: boolean) {
        return new Promise<AddressData[]>((resolve, reject) => {
            if (this.previousSearchKey === searchKey) {
                reject("Cancel search because same search key requested");
            }

            this.previousSearchKey = searchKey;

            const form = new FormData();
            form.append("confmKey", API_KEY);
            form.append("resultType", "json");
            form.append("currentPage", searchKey.currentPage);
            form.append("countPerPage", searchKey.countPerPage);
            form.append("keyword", searchKey.keyword);

            axios.request<AddressResponse>({
                method: "POST",
                url: JUSO_API,
                data: form,
                responseType: "json",
                transformResponse: (r: APIResponse) => r.results,
            }).then(async (res) => {
                console.log(res.data.juso);
                if (append) {
                    //  prevent search next page
                    if (!res.data.juso.length) {
                        searchKey.end = true;
                    } else {
                        this.addressData = [...this.addressData, ...res.data.juso];
                    }
                } else {
                    this.addressData = res.data.juso || [];
                }
                try {
                    await this.settingsManager?.updateSettings({
                        addressData: this.addressData,
                        prevSearchKey: searchKey,
                    })
                    .then((result) => console.log(result))
                    .catch((err) => console.log("error! ", err));
                } finally {
                    resolve(this.addressData);
                }
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
}
