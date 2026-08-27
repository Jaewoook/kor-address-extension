import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { Content } from "@/components/popup/Content";
import { useAddressStore } from "@/states/address";
import { useSearchStore } from "@/states/search";
import { useSettingsStore } from "@/states/settings";

// Smoke test: verifies the hooks/store wiring (useAddressSearch, useSettings,
// and their backing Zustand stores) renders without crashing.
describe("Content", () => {
  beforeEach(() => {
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
});
