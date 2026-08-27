import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useSettings } from "@shared/hooks/useSettings";
import { useSettingsStore } from "@shared/states/settings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      addressDisplayOptions: { engAddrShown: true, roadAddrShown: true, streetNumAddrShown: true },
    });
  });

  it("defaults to all display options enabled", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.addressDisplayOptions).toEqual({
      engAddrShown: true,
      roadAddrShown: true,
      streetNumAddrShown: true,
    });
  });

  it("toggleDisplayOption flips only the given option", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.toggleDisplayOption("engAddrShown");
    });

    expect(result.current.addressDisplayOptions).toEqual({
      engAddrShown: false,
      roadAddrShown: true,
      streetNumAddrShown: true,
    });
  });

  it("toggling twice returns to the original value", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.toggleDisplayOption("roadAddrShown");
    });
    act(() => {
      result.current.toggleDisplayOption("roadAddrShown");
    });

    expect(result.current.addressDisplayOptions.roadAddrShown).toBe(true);
  });
});
