import { getRecentAddressList, setRecentAddressList } from "@repo/shared/storage";
import type { AddressData } from "@repo/shared/models/address";
import { atom } from "recoil";

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
