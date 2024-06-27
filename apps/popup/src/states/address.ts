import { atom } from "recoil";

import { getRecentAddressList, setRecentAddressList } from "@/shared/storage";
import type { AddressData } from "@/shared/models/address";

export const addressListState = atom<AddressData[]>({
  key: "address-list",
  default: [],
  effects: [({ trigger, setSelf, onSet }) => {
    if (trigger === "get") {
      getRecentAddressList()?.then((recentAddressList) => {
        if (recentAddressList) {
          setSelf(recentAddressList);
        }
      });
    }

    onSet((newAddressList) => {
      setRecentAddressList(newAddressList);
    });
  }],
});
