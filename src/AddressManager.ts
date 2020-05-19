import axios from "axios";

const JUSO_API = "http://www.juso.go.kr/addrlink/addrLinkApi.do";

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

    search(searchKey: SearchKey) {
        if (this.previousSearchKey === searchKey) {
            return;
        }

        this.previousSearchKey = searchKey;

        const form = new FormData();
        form.append("confmKey", "devU01TX0FVVEgyMDIwMDUxOTE4NTUwNjEwOTc3NDA=");
        form.append("resultType", "json");
        for (let key in searchKey) {
            form.append(key, searchKey[key]);
        }

        return axios.request<AddressResponse>({
            method: "POST",
            url: JUSO_API,
            data: form,
            transformResponse: (r: APIResponse) => r.results,
        });
    }
}
