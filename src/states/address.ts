import { atom } from "recoil";

import type { AddressData } from "@/shared/models/address";

export const addressListState = atom<AddressData[]>({
  key: "address-list",
  default: [],
});
