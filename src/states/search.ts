import { atom } from "recoil";

import type { SearchKey } from "@/shared/models/address";

export const searchKeywordState = atom({
  key: "search-keyword",
  default: "",
});

export const searchLoadingState = atom({
  key: "search-loading",
  default: false,
});

export const prevSearchKeyState = atom<SearchKey | null>({
  key: "prev-search-key",
  default: null,
});
