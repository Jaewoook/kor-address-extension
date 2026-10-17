import { beforeEach, describe, expect, it } from "vitest";

import { useSettingsStore } from "@shared/states/settings";
import { getSearchResultOptions, setSearchResultOptions } from "@shared/storage";

const ALL_SHOWN = { engAddrShown: true, roadAddrShown: true, streetNumAddrShown: true };

describe("useSettingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({ addressDisplayOptions: ALL_SHOWN });
  });

  it("persists display options in the storage format", async () => {
    useSettingsStore.getState().setAddressDisplayOptions({
      engAddrShown: false,
      roadAddrShown: true,
      streetNumAddrShown: false,
    });

    expect(await getSearchResultOptions()).toEqual({
      showEng: false,
      showRoad: true,
      showLegacy: false,
    });
  });

  it("accepts an updater based on the previous options", () => {
    useSettingsStore
      .getState()
      .setAddressDisplayOptions((prev) => ({ ...prev, roadAddrShown: false }));

    expect(useSettingsStore.getState().addressDisplayOptions).toEqual({
      ...ALL_SHOWN,
      roadAddrShown: false,
    });
  });

  it("restores persisted options on hydrate", async () => {
    await setSearchResultOptions({ showEng: false, showRoad: false, showLegacy: true });

    await useSettingsStore.getState().hydrate();

    expect(useSettingsStore.getState().addressDisplayOptions).toEqual({
      engAddrShown: false,
      roadAddrShown: false,
      streetNumAddrShown: true,
    });
  });

  it("ignores persisted options that don't match the expected shape", async () => {
    localStorage.setItem("searchResult", JSON.stringify({ showEng: "yes", unknown: 1 }));

    await useSettingsStore.getState().hydrate();

    expect(useSettingsStore.getState().addressDisplayOptions).toEqual(ALL_SHOWN);
  });

  it("keeps the defaults when nothing was persisted", async () => {
    await useSettingsStore.getState().hydrate();

    expect(useSettingsStore.getState().addressDisplayOptions).toEqual(ALL_SHOWN);
  });
});
