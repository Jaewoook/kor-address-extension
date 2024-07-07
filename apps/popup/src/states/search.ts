import { DEFAULT_SETTINGS, getPrevSearchKey, setPrevSearchKey, validateSettingsData } from "@repo/shared/storage";
import type { SearchKey } from "@repo/shared/models/address";
import { atom } from "recoil";


export const searchKeywordState = atom({
  key: "search-keyword",
  default: "",
  effects: [({ trigger, setSelf }) => {
    if (trigger === "get") {
      getPrevSearchKey().then((prevSearchKey) => {
        setSelf(prevSearchKey?.keyword ?? "");
      });
    }
  }],
});

export const searchLoadingState = atom({
  key: "search-loading",
  default: false,
});

export const prevSearchKeyState = atom<SearchKey | null>({
  key: "prev-search-key",
  default: null,
  effects: [({ trigger, setSelf, onSet }) => {
    if (trigger === "get") {
      getPrevSearchKey().then((prevSearchKey) => {
        if (!prevSearchKey || validateSettingsData(prevSearchKey, DEFAULT_SETTINGS.prevSearchKey)) {
          return;
        }

        setSelf(prevSearchKey);
      });
    }

    onSet((newSearchKey) => {
      setPrevSearchKey(newSearchKey);
    });
  }],
});
