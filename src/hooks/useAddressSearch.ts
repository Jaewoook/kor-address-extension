import axios from "axios";
import type { AxiosResponse } from "axios";
import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import type { AddressSearchAPIResponse, SearchKey } from "@/shared/models/address";
import { addressListState } from "@/states/address";
import { prevSearchKeyState, searchKeywordState, searchLoadingState } from "@/states/search";

const JUSO_API = "http://www.juso.go.kr/addrlink/addrLinkApi.do";
const API_KEY = "U01TX0FVVEgyMDIwMDUyMTEzNTUwOTEwOTc4NDI=";

export const useAddressSearch = () => {
  const [prevSearchKey, setPrevSearchKey] = useRecoilState(prevSearchKeyState);
  const [addressList, setAddressList] = useRecoilState(addressListState);
  const [searching, setSearching] = useRecoilState(searchLoadingState);
  const setSearchKeyword = useSetRecoilState(searchKeywordState);

  const performSearch = useCallback(async (searchKey: SearchKey) => {
    if (prevSearchKey === searchKey) {
      throw new Error("Cancel search due to same searchKey requested");
    }

    const form = new FormData();
    form.append("confmKey", API_KEY);
    form.append("resultType", "json");
    form.append("currentPage", searchKey.currentPage);
    form.append("countPerPage", searchKey.countPerPage);
    form.append("keyword", searchKey.keyword);

    try {
      const res = await axios.post<
        FormData,
        AxiosResponse<AddressSearchAPIResponse>
      >(JUSO_API, form);

      setPrevSearchKey(searchKey);

      return res.data.results;
    } catch (err) {
      console.log(err);
    }
  }, [prevSearchKey, setPrevSearchKey]);

  const searchAddress = useCallback(async (searchKey: SearchKey) => {
    if (searching) {
      return;
    }

    setSearching(true);
    const searchResult = await performSearch(searchKey);
    setSearching(false);
    setAddressList(searchResult?.juso || []);
  }, [performSearch, searching, setSearching, setAddressList]);

  const searchNextPage = useCallback(async () => {
    if (searching || !prevSearchKey || prevSearchKey.end) {
      return;
    }
    const searchKey = {
      ...prevSearchKey,
      currentPage: (Number.parseInt(prevSearchKey.currentPage) + 1).toString(),
    };
    setSearching(true);
    const searchResult = await performSearch(searchKey);
    if (!searchResult?.juso?.length) {
      setPrevSearchKey({
        ...searchKey,
        end: true,
      });
    }

    setSearching(false);
    setAddressList((prevAddressList) => ([
      ...prevAddressList,
      ...(searchResult?.juso ?? []),
    ]));
  }, [performSearch, searching, setSearching, prevSearchKey, setPrevSearchKey, setAddressList]);

  const resetSearch = useCallback(() => {
    setPrevSearchKey(null);
    setAddressList([]);
    setSearchKeyword("");
  }, [setPrevSearchKey, setAddressList, setSearchKeyword]);

  return {
    addressList,
    searchAddress,
    searchNextPage,
    resetSearch,
  };
};
