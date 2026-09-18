import axios from "axios";
import type { AxiosResponse } from "axios";
import { useCallback } from "react";

import type { AddressSearchAPIResponse, SearchKey } from "@shared/models/address";
import { useAddressStore } from "@shared/states/address";
import { useSearchHistoryStore } from "@shared/states/history";
import { useSearchStore } from "@shared/states/search";

const JUSO_API = "http://www.juso.go.kr/addrlink/addrLinkApi.do";
const API_KEY = import.meta.env.VITE_JUSO_API_KEY;

// Compares request identity only - keyword, currentPage, countPerPage - not
// `end`, which is a result flag rather than part of what gets sent to the API.
const isSameSearchKey = (a: SearchKey | null, b: SearchKey): boolean =>
  a !== null &&
  a.keyword === b.keyword &&
  a.currentPage === b.currentPage &&
  a.countPerPage === b.countPerPage;

export const useAddressSearch = () => {
  const prevSearchKey = useSearchStore((state) => state.prevSearchKey);
  const setPrevSearchKey = useSearchStore((state) => state.setPrevSearchKey);
  const searching = useSearchStore((state) => state.searching);
  const setSearching = useSearchStore((state) => state.setSearching);
  const searchKeyword = useSearchStore((state) => state.searchKeyword);
  const setSearchKeyword = useSearchStore((state) => state.setSearchKeyword);
  const addressList = useAddressStore((state) => state.addressList);
  const setAddressList = useAddressStore((state) => state.setAddressList);

  const performSearch = useCallback(
    async (searchKey: SearchKey) => {
      const form = new FormData();
      form.append("confmKey", API_KEY);
      form.append("resultType", "json");
      form.append("currentPage", searchKey.currentPage);
      form.append("countPerPage", searchKey.countPerPage);
      form.append("keyword", searchKey.keyword);

      const res = await axios.post<FormData, AxiosResponse<AddressSearchAPIResponse>>(
        JUSO_API,
        form,
      );

      setPrevSearchKey(searchKey);

      return res.data.results;
    },
    [setPrevSearchKey],
  );

  const searchAddress = useCallback(
    async (searchKey: SearchKey) => {
      if (searching || isSameSearchKey(prevSearchKey, searchKey)) {
        return;
      }

      setSearching(true);
      try {
        const searchResult = await performSearch(searchKey);
        setAddressList(searchResult?.juso || []);
        if (searchKey.keyword.trim() && searchResult?.common.errorCode === "0") {
          useSearchHistoryStore.getState().addKeyword(searchKey.keyword);
        }
      } catch (err) {
        console.error(err);
        setAddressList([]);
      } finally {
        setSearching(false);
      }
    },
    [performSearch, searching, prevSearchKey, setSearching, setAddressList],
  );

  const searchNextPage = useCallback(async () => {
    if (searching || !prevSearchKey || prevSearchKey.end) {
      return;
    }
    const searchKey = {
      ...prevSearchKey,
      currentPage: (Number.parseInt(prevSearchKey.currentPage) + 1).toString(),
    };
    setSearching(true);
    try {
      const searchResult = await performSearch(searchKey);
      if (!searchResult?.juso?.length) {
        setPrevSearchKey({
          ...searchKey,
          end: true,
        });
      }
      setAddressList((prevAddressList) => [...prevAddressList, ...(searchResult?.juso ?? [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, [performSearch, searching, setSearching, prevSearchKey, setPrevSearchKey, setAddressList]);

  const resetSearch = useCallback(() => {
    setPrevSearchKey(null);
    setAddressList([]);
    setSearchKeyword("");
  }, [setPrevSearchKey, setAddressList, setSearchKeyword]);

  return {
    addressList,
    prevSearchKey,
    searching,
    searchKeyword,
    setSearchKeyword,
    searchAddress,
    searchNextPage,
    resetSearch,
  };
};
