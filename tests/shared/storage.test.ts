import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  getAllStorageData,
  getPrevSearchKey,
  getRecentAddressList,
  getSearchHistory,
  getSearchHistoryLimit,
  getSearchResultOptions,
  setPrevSearchKey,
  setRecentAddressList,
  setSearchHistory,
  setSearchHistoryLimit,
  setSearchResultOptions,
  validateSettingsData,
} from "@shared/storage";

// These tests run outside an extension context (no chrome/browser global),
// exercising the localStorage fallback path.
describe("storage (localStorage fallback)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null for settings that have not been stored yet", async () => {
    expect(await getSearchResultOptions()).toBeNull();
    expect(await getRecentAddressList()).toBeNull();
    expect(await getPrevSearchKey()).toBeNull();
  });

  it("round-trips search result options through localStorage", async () => {
    await setSearchResultOptions({ showEng: false, showRoad: true, showLegacy: false });
    expect(await getSearchResultOptions()).toEqual({ showEng: false, showRoad: true, showLegacy: false });
  });

  it("round-trips the recent address list through localStorage", async () => {
    const list = [
      { roadAddr: "road", roadAddrPart1: "road1", jibunAddr: "jibun", engAddr: "eng", zipNo: "12345" },
    ];
    await setRecentAddressList(list);
    expect(await getRecentAddressList()).toEqual(list);
  });

  it("round-trips the previous search key through localStorage", async () => {
    const searchKey = { currentPage: "1", countPerPage: "20", keyword: "강남대로", end: false };
    await setPrevSearchKey(searchKey);
    expect(await getPrevSearchKey()).toEqual(searchKey);
  });

  it("clearing prevSearchKey with null stores and returns null", async () => {
    await setPrevSearchKey({ currentPage: "1", countPerPage: "20", keyword: "x", end: false });
    await setPrevSearchKey(null);
    expect(await getPrevSearchKey()).toBeNull();
  });

  it("getAllStorageData reads back every stored key", async () => {
    await setSearchResultOptions({ showEng: true, showRoad: true, showLegacy: true });
    const all = await getAllStorageData();
    expect(all.searchResult).toEqual({ showEng: true, showRoad: true, showLegacy: true });
  });

  it("returns null for search history that has not been stored yet", async () => {
    expect(await getSearchHistory()).toBeNull();
    expect(await getSearchHistoryLimit()).toBeNull();
  });

  it("round-trips the search history list through localStorage", async () => {
    await setSearchHistory(["강남대로", "자양동"]);
    expect(await getSearchHistory()).toEqual(["강남대로", "자양동"]);
  });

  it("round-trips the search history limit through localStorage", async () => {
    await setSearchHistoryLimit({ enabled: false, value: 50 });
    expect(await getSearchHistoryLimit()).toEqual({ enabled: false, value: 50 });
  });
});

describe("validateSettingsData", () => {
  it("rejects non-object input", () => {
    expect(validateSettingsData(null)).toBe(false);
    expect(validateSettingsData("string")).toBe(false);
    expect(validateSettingsData(42)).toBe(false);
  });

  it("rejects an object with a key not present in the expected shape", () => {
    expect(validateSettingsData({ unknownKey: 1 }, DEFAULT_SETTINGS)).toBe(false);
  });

  it("rejects a value whose type does not match the expected type", () => {
    expect(
      validateSettingsData({ searchResult: { showEng: "not-a-boolean" } }, DEFAULT_SETTINGS),
    ).toBe(false);
  });

  it("accepts an object matching the expected shape and types", () => {
    expect(
      validateSettingsData(
        { searchResult: { showEng: true, showRoad: false, showLegacy: true } },
        DEFAULT_SETTINGS,
      ),
    ).toBe(true);
  });

  it("accepts an empty object as trivially valid", () => {
    expect(validateSettingsData({}, DEFAULT_SETTINGS)).toBe(true);
  });
});
