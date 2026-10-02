import { beforeEach, describe, expect, it } from "vitest";

import type { SearchKey } from "@shared/models/address";
import { useSearchStore } from "@shared/states/search";
import { getPrevSearchKey, setPrevSearchKey } from "@shared/storage";

const searchKey: SearchKey = {
  currentPage: "2",
  countPerPage: "20",
  keyword: "강남대로",
  end: false,
};

describe("useSearchStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSearchStore.setState({ searchKeyword: "", searching: false, prevSearchKey: null });
  });

  it("updates the keyword and searching flag", () => {
    useSearchStore.getState().setSearchKeyword("세종대로");
    useSearchStore.getState().setSearching(true);

    expect(useSearchStore.getState().searchKeyword).toBe("세종대로");
    expect(useSearchStore.getState().searching).toBe(true);
  });

  it("persists the previous search key", async () => {
    useSearchStore.getState().setPrevSearchKey(searchKey);

    expect(useSearchStore.getState().prevSearchKey).toEqual(searchKey);
    expect(await getPrevSearchKey()).toEqual(searchKey);
  });

  it("restores the last searched keyword on hydrate", async () => {
    await setPrevSearchKey(searchKey);

    await useSearchStore.getState().hydrate();

    expect(useSearchStore.getState().searchKeyword).toBe("강남대로");
  });

  it("starts with an empty keyword when nothing was persisted", async () => {
    await useSearchStore.getState().hydrate();

    expect(useSearchStore.getState().searchKeyword).toBe("");
    expect(useSearchStore.getState().prevSearchKey).toBeNull();
  });
});
