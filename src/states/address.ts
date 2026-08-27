import { create } from "zustand";

import { getRecentAddressList, setRecentAddressList } from "@/shared/storage";
import type { AddressData } from "@/shared/models/address";

interface AddressStore {
  addressList: AddressData[];
  setAddressList: (update: AddressData[] | ((prev: AddressData[]) => AddressData[])) => void;
  hydrate: () => Promise<void>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addressList: [],
  setAddressList: (update) => {
    const addressList = typeof update === "function" ? update(get().addressList) : update;
    set({ addressList });
    setRecentAddressList(addressList);
  },
  hydrate: async () => {
    const recentAddressList = await getRecentAddressList();
    if (recentAddressList) {
      set({ addressList: recentAddressList });
    }
  },
}));
