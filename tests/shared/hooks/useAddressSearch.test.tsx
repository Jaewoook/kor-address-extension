import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AddressData, SearchKey } from "@shared/models/address";
import { useAddressSearch } from "@shared/hooks/useAddressSearch";
import { useAddressStore } from "@shared/states/address";
import { useSearchHistoryStore } from "@shared/states/history";
import { useSearchStore } from "@shared/states/search";

vi.mock("axios");
const mockedPost = vi.mocked(axios.post);

const makeSearchKey = (overrides: Partial<SearchKey> = {}): SearchKey => ({
  currentPage: "1",
  countPerPage: "20",
  keyword: "강남대로",
  end: false,
  ...overrides,
});

const makeAddress = (overrides: Partial<AddressData> = {}): AddressData => ({
  roadAddr: "서울특별시 서초구 강남대로 323",
  roadAddrPart1: "서울특별시 서초구 강남대로 323",
  jibunAddr: "서울특별시 서초동 1337-27",
  engAddr: "323 Gangnam-daero, Seocho-gu, Seoul",
  zipNo: "06627",
  ...overrides,
});

const makeApiResponse = (juso: AddressData[] | null, errorCode = "0") => ({
  data: {
    results: {
      common: {
        totalCount: String(juso?.length ?? 0),
        currentPage: 1,
        countPerPage: 20,
        errorCode,
        errorMessage: "",
      },
      juso,
    },
  },
});

describe("useAddressSearch", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    localStorage.clear();
    useAddressStore.setState({ addressList: [] });
    useSearchStore.setState({ searchKeyword: "", searching: false, prevSearchKey: null });
    useSearchHistoryStore.setState({ history: [], searchHistoryLimit: { enabled: true, value: 50 } });
  });

  it("searchAddress populates addressList from the API response", async () => {
    mockedPost.mockResolvedValueOnce(makeApiResponse([makeAddress()]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });

    expect(result.current.addressList).toHaveLength(1);
    expect(result.current.addressList[0].zipNo).toBe("06627");
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });

  it("searchAddress clears addressList when the API call fails", async () => {
    mockedPost.mockRejectedValueOnce(new Error("network error"));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });

    expect(result.current.addressList).toEqual([]);
  });

  it("ignores a repeat search with the same keyword", async () => {
    mockedPost.mockResolvedValue(makeApiResponse([]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });
    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });

    expect(mockedPost).toHaveBeenCalledTimes(1);
  });

  it("searchNextPage appends results and stops once the API returns none", async () => {
    mockedPost
      .mockResolvedValueOnce(makeApiResponse([makeAddress({ zipNo: "111" })]))
      .mockResolvedValueOnce(makeApiResponse([]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });
    await act(async () => {
      await result.current.searchNextPage();
    });

    expect(result.current.addressList).toHaveLength(1);
    expect(mockedPost).toHaveBeenCalledTimes(2);

    // a further call should be a no-op: the hook marked the search as ended
    await act(async () => {
      await result.current.searchNextPage();
    });
    expect(mockedPost).toHaveBeenCalledTimes(2);
  });

  it("resetSearch clears the address list", async () => {
    mockedPost.mockResolvedValueOnce(makeApiResponse([makeAddress()]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey());
    });
    expect(result.current.addressList).toHaveLength(1);

    act(() => {
      result.current.resetSearch();
    });

    expect(result.current.addressList).toEqual([]);
  });

  it("adds the keyword to search history on a successful new search", async () => {
    mockedPost.mockResolvedValueOnce(makeApiResponse([makeAddress()]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey({ keyword: "강남대로" }));
    });

    expect(useSearchHistoryStore.getState().history).toEqual(["강남대로"]);
  });

  it("does not add a keyword to history on searchNextPage", async () => {
    mockedPost
      .mockResolvedValueOnce(makeApiResponse([makeAddress({ zipNo: "111" })]))
      .mockResolvedValueOnce(makeApiResponse([]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey({ keyword: "강남대로" }));
    });
    await act(async () => {
      await result.current.searchNextPage();
    });

    expect(useSearchHistoryStore.getState().history).toEqual(["강남대로"]);
  });

  it("does not add a keyword to history when the API reports a non-zero errorCode", async () => {
    mockedPost.mockResolvedValueOnce(makeApiResponse(null, "E0001"));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey({ keyword: "강남대로" }));
    });

    expect(useSearchHistoryStore.getState().history).toEqual([]);
  });

  it("does not add an empty or whitespace-only keyword to history", async () => {
    mockedPost.mockResolvedValueOnce(makeApiResponse([]));
    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddress(makeSearchKey({ keyword: "   " }));
    });

    expect(useSearchHistoryStore.getState().history).toEqual([]);
  });
});
