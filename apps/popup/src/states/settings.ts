import {
  DEFAULT_SETTINGS,
  getSearchResultOptions,
  setSearchResultOptions,
  validateSettingsData,
} from "@repo/shared/storage";
import type { DisplayOptions } from "@repo/shared/models/settings";
import { atom } from "recoil";


export const addressDisplayOptionsState = atom<DisplayOptions>({
  key: "display-options",
  default: {
    engAddrShown: true,
    roadAddrShown: true,
    streetNumAddrShown: true,
  },
  effects: [({ trigger, setSelf, onSet }) => {
    if (trigger === "get") {
      getSearchResultOptions()?.then((options) => {
        if (!options || !validateSettingsData(options, DEFAULT_SETTINGS.searchResult)) {
          return;
        }

        setSelf({
          engAddrShown: options.showEng,
          roadAddrShown: options.showRoad,
          streetNumAddrShown: options.showLegacy,
        });
      });
    }

    onSet((newOptions) => {
      setSearchResultOptions({
        showEng: newOptions.engAddrShown,
        showRoad: newOptions.roadAddrShown,
        showLegacy: newOptions.streetNumAddrShown,
      });
    });
  }],
});
