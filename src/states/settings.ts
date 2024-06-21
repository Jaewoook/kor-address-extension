import { atom } from "recoil";

import { getSearchResultSettings, validateSettingsData, DEFAULT_SETTINGS } from "@/shared/storage";

export const addressDisplayOptionsState = atom({
  key: "display-options",
  default: {
    engAddrShown: true,
    roadAddrShown: true,
    streetNumAddrShown: true,
  },
  effects: [({ trigger, setSelf, onSet }) => {
    if (trigger === "get") {
      getSearchResultSettings()?.then((settings) => {
        if (!validateSettingsData(settings, DEFAULT_SETTINGS.searchResult)) {
          return;
        }

        setSelf({
          engAddrShown: settings.showEng,
          roadAddrShown: settings.showRoad,
          streetNumAddrShown: settings.showLegacy,
        });
      });
    }
  }],
});
