import { beforeEach, describe, expect, it } from "vitest";

import type { AddressData } from "@shared/models/address";
import { useAddressStore } from "@shared/states/address";
import { getRecentAddressList, setRecentAddressList } from "@shared/storage";

const makeAddress = (zipNo: string): AddressData => ({
  roadAddr: `서울특별시 테스트로 ${zipNo}`,
  roadAddrPart1: `서울특별시 테스트로 ${zipNo}`,
  jibunAddr: `서울특별시 테스트동 ${zipNo}`,
  engAddr: `${zipNo} Test-ro, Seoul`,
  zipNo,
});

describe("useAddressStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAddressStore.setState({ addressList: [] });
  });

  it("sets the list and persists it", async () => {
    useAddressStore.getState().setAddressList([makeAddress("00001")]);

    expect(useAddressStore.getState().addressList).toEqual([makeAddress("00001")]);
    expect(await getRecentAddressList()).toEqual([makeAddress("00001")]);
  });

  it("accepts an updater based on the previous list", () => {
    useAddressStore.getState().setAddressList([makeAddress("00001")]);
    useAddressStore.getState().setAddressList((prev) => [...prev, makeAddress("00002")]);

    expect(useAddressStore.getState().addressList.map((a) => a.zipNo)).toEqual(["00001", "00002"]);
  });

  it("restores the persisted list on hydrate", async () => {
    await setRecentAddressList([makeAddress("00003")]);

    await useAddressStore.getState().hydrate();

    expect(useAddressStore.getState().addressList).toEqual([makeAddress("00003")]);
  });

  it("keeps an empty list when nothing was persisted", async () => {
    await useAddressStore.getState().hydrate();

    expect(useAddressStore.getState().addressList).toEqual([]);
  });
});
