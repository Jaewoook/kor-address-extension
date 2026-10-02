import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Content } from "@popup/components/Content";
import type { AddressData, SearchKey } from "@shared/models/address";
import { useAddressStore } from "@shared/states/address";
import { useSearchStore } from "@shared/states/search";
import { useSettingsStore } from "@shared/states/settings";

vi.mock("axios");
const mockedPost = vi.mocked(axios.post);

const makeAddress = (zipNo: string): AddressData => ({
  roadAddr: `서울특별시 테스트로 ${zipNo}`,
  roadAddrPart1: `서울특별시 테스트로 ${zipNo}`,
  jibunAddr: `서울특별시 테스트동 ${zipNo}`,
  engAddr: `${zipNo} Test-ro, Seoul`,
  zipNo,
});

const firstPageKey: SearchKey = {
  currentPage: "1",
  countPerPage: "20",
  keyword: "테스트로",
  end: false,
};

const apiResponse = (juso: AddressData[]) => ({
  data: {
    results: {
      common: {
        totalCount: "40",
        currentPage: 2,
        countPerPage: 20,
        errorCode: "0",
        errorMessage: "",
      },
      juso,
    },
  },
});

// jsdom has no layout, so set the geometry the scroll handler reads and fire the event.
const scrollContent = (scrollTop: number) => {
  const content = document.getElementById("content")!;
  Object.defineProperty(content, "scrollHeight", { configurable: true, value: 1000 });
  Object.defineProperty(content, "clientHeight", { configurable: true, value: 400 });
  Object.defineProperty(content, "scrollTop", { configurable: true, value: scrollTop });
  fireEvent.scroll(content);
};

describe("Content", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    localStorage.clear();
    useAddressStore.setState({ addressList: [] });
    useSearchStore.setState({ searchKeyword: "", searching: false, prevSearchKey: null });
    useSettingsStore.setState({
      addressDisplayOptions: { engAddrShown: true, roadAddrShown: true, streetNumAddrShown: true },
    });
  });

  it("renders the empty-result state on first render", () => {
    render(<Content />);

    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("clears the results and keyword when reset is clicked", async () => {
    useAddressStore.setState({ addressList: [makeAddress("00001")] });
    useSearchStore.setState({ searchKeyword: "테스트로", prevSearchKey: firstPageKey });
    const user = userEvent.setup();
    render(<Content />);

    await user.click(screen.getByText("초기화"));

    expect(useAddressStore.getState().addressList).toEqual([]);
    expect(useSearchStore.getState().searchKeyword).toBe("");
    expect(useSearchStore.getState().prevSearchKey).toBeNull();
  });

  it("tells the user once every page has been loaded", () => {
    useAddressStore.setState({ addressList: [makeAddress("00001")] });
    useSearchStore.setState({ prevSearchKey: { ...firstPageKey, end: true } });
    render(<Content />);

    expect(screen.getByText("모든 검색 결과를 확인했습니다!")).toBeInTheDocument();
  });

  describe("infinite scroll", () => {
    beforeEach(() => {
      useAddressStore.setState({ addressList: [makeAddress("00001")] });
      useSearchStore.setState({ searchKeyword: "테스트로", prevSearchKey: firstPageKey });
    });

    it("loads the next page when scrolled to the bottom, even a sub-pixel short", async () => {
      mockedPost.mockResolvedValueOnce(apiResponse([makeAddress("00002")]));
      render(<Content />);

      scrollContent(598.5);

      await waitFor(() => expect(useAddressStore.getState().addressList).toHaveLength(2));
      expect((mockedPost.mock.calls[0][1] as FormData).get("currentPage")).toBe("2");
    });

    it("does not load more while the bottom is still out of view", () => {
      render(<Content />);

      scrollContent(300);

      expect(mockedPost).not.toHaveBeenCalled();
    });
  });
});
