import axios from "axios";
import { updateSettings, loadCachedData, getRuntime, DEFAULT_SETTINGS } from "./utils";

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
    [key: string]: string;
    currentPage: string;
    countPerPage: string;
    keyword: string;
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

    async loadSavedResult() {
        if (getRuntime() === "extension") {
            const data = await loadCachedData();
            this.addressData = data.addressData || [];
            this.previousSearchKey = data.prevSearchKey || DEFAULT_SETTINGS.prevSearchKey as SearchKey;
            console.log("AddrManager address loaded", this.addressData);
        }
    }

    search(searchKey: SearchKey) {
        return new Promise<AddressData[]>((resolve, reject) => {
            if (this.previousSearchKey === searchKey) {
                reject("Cancel search because same search key requested");
            }

            this.previousSearchKey = searchKey;

            const form = new FormData();
            form.append("confmKey", API_KEY);
            form.append("resultType", "json");
            for (let key in searchKey) {
                form.append(key, searchKey[key]);
            }

            axios.request<AddressResponse>({
                method: "POST",
                url: JUSO_API,
                data: form,
                responseType: "json",
                transformResponse: (r: APIResponse) => r.results,
            }).then(async (res) => {
                console.log("Response data", res);
                this.addressData = res.data.juso;
                try {
                    await updateSettings({
                        addressData: res.data.juso,
                        prevSearchKey: searchKey,
                    });
                } finally {
                    resolve(res.data.juso);
                }
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
}
