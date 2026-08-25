import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";
import { beforeEach, describe, expect, it } from "vitest";

import { useSettings } from "@/hooks/useSettings";

const wrapper = ({ children }: PropsWithChildren) => <RecoilRoot>{children}</RecoilRoot>;

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to all display options enabled", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.addressDisplayOptions).toEqual({
      engAddrShown: true,
      roadAddrShown: true,
      streetNumAddrShown: true,
    });
  });

  it("toggleDisplayOption flips only the given option", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

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
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.toggleDisplayOption("roadAddrShown");
    });
    act(() => {
      result.current.toggleDisplayOption("roadAddrShown");
    });

    expect(result.current.addressDisplayOptions.roadAddrShown).toBe(true);
  });
});
