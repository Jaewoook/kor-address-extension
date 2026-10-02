import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "@popup/components/Header";
import { useAddressStore } from "@shared/states/address";
import { useSearchStore } from "@shared/states/search";
import { useSettingsStore } from "@shared/states/settings";

vi.mock("axios");
const mockedPost = vi.mocked(axios.post);

const emptyResponse = {
  data: {
    results: {
      common: {
        totalCount: "0",
        currentPage: 1,
        countPerPage: 20,
        errorCode: "0",
        errorMessage: "",
      },
      juso: [],
    },
  },
};

describe("Header", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    localStorage.clear();
    useAddressStore.setState({ addressList: [] });
    useSearchStore.setState({ searchKeyword: "", searching: false, prevSearchKey: null });
    useSettingsStore.setState({
      addressDisplayOptions: { engAddrShown: true, roadAddrShown: true, streetNumAddrShown: false },
    });
  });

  it("keeps the typed keyword in the search store", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.type(screen.getByPlaceholderText("검색할 주소 입력"), "강남대로");

    expect(useSearchStore.getState().searchKeyword).toBe("강남대로");
  });

  it("searches the first page of the keyword when Enter is pressed", async () => {
    mockedPost.mockResolvedValueOnce(emptyResponse);
    const user = userEvent.setup();
    render(<Header />);

    await user.type(screen.getByPlaceholderText("검색할 주소 입력"), "강남대로{Enter}");

    await waitFor(() => expect(mockedPost).toHaveBeenCalledTimes(1));
    const form = mockedPost.mock.calls[0][1] as FormData;
    expect(form.get("keyword")).toBe("강남대로");
    expect(form.get("currentPage")).toBe("1");
    expect(form.get("countPerPage")).toBe("20");
  });

  it("fills enabled display options with the primary color", () => {
    render(<Header />);

    // "filled" paints a background; "outlined" would leave enabled options looking unselected.
    for (const name of ["영문주소", "도로명주소"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveClass("ant-btn-color-primary");
      expect(button).toHaveClass("ant-btn-variant-filled");
    }
    expect(screen.getByRole("button", { name: "지번주소" })).toHaveClass("ant-btn-color-default");
  });

  it("toggles a display option when its button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "지번주소" }));
    await user.click(screen.getByRole("button", { name: "영문주소" }));

    expect(useSettingsStore.getState().addressDisplayOptions).toEqual({
      engAddrShown: false,
      roadAddrShown: true,
      streetNumAddrShown: true,
    });
    expect(screen.getByRole("button", { name: "지번주소" })).toHaveClass("ant-btn-color-primary");
  });

  it("shows the search button as loading while a search is running", () => {
    useSearchStore.setState({ searching: true });
    render(<Header />);

    expect(document.querySelector(".ant-input-search-btn")).toHaveClass("ant-btn-loading");
  });
});
