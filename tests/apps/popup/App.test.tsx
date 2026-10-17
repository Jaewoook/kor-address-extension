import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "@popup/App";
import { useAddressStore } from "@shared/states/address";
import { useSearchHistoryStore } from "@shared/states/history";
import { useSearchStore } from "@shared/states/search";
import { useSettingsStore } from "@shared/states/settings";
import { useThemeStore } from "@shared/states/theme";

describe("popup App", () => {
  const hydrate = {
    address: vi.fn(),
    search: vi.fn(),
    settings: vi.fn(),
    history: vi.fn(),
    theme: vi.fn(),
  };

  beforeEach(() => {
    Object.values(hydrate).forEach((fn) => fn.mockClear());
    useAddressStore.setState({ addressList: [], hydrate: hydrate.address });
    useSearchStore.setState({
      searchKeyword: "",
      searching: false,
      prevSearchKey: null,
      hydrate: hydrate.search,
    });
    useSettingsStore.setState({ hydrate: hydrate.settings });
    useSearchHistoryStore.setState({ hydrate: hydrate.history });
    useThemeStore.setState({ mode: "light", hydrate: hydrate.theme });
  });

  it("restores every persisted store once on startup", () => {
    render(<App />);

    for (const fn of Object.values(hydrate)) {
      expect(fn).toHaveBeenCalledTimes(1);
    }
  });

  it("renders the header, results area, and footer", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "주소검색" })).toBeInTheDocument();
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    expect(screen.getByLabelText("설정")).toBeInTheDocument();
  });
});
