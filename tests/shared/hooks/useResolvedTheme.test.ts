import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useResolvedTheme } from "@shared/hooks/useResolvedTheme";
import { useThemeStore } from "@shared/states/theme";

const stubMatchMedia = (matches: boolean) => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];
  const mediaQueryList = {
    matches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    },
  };
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));
  return {
    fireChange: (nextMatches: boolean) => {
      listeners.forEach((listener) => listener({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
};

describe("useResolvedTheme", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "system" });
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves \"light\" directly without calling matchMedia", () => {
    const matchMediaSpy = vi.fn();
    vi.stubGlobal("matchMedia", matchMediaSpy);
    useThemeStore.setState({ mode: "light" });

    const { result } = renderHook(() => useResolvedTheme());

    expect(result.current).toBe("light");
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });

  it("resolves \"dark\" directly without calling matchMedia", () => {
    const matchMediaSpy = vi.fn();
    vi.stubGlobal("matchMedia", matchMediaSpy);
    useThemeStore.setState({ mode: "dark" });

    const { result } = renderHook(() => useResolvedTheme());

    expect(result.current).toBe("dark");
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });

  it("resolves via matchMedia when mode is \"system\"", () => {
    stubMatchMedia(true);
    useThemeStore.setState({ mode: "system" });

    const { result } = renderHook(() => useResolvedTheme());

    expect(result.current).toBe("dark");
  });

  it("updates live when the OS theme changes while mode is \"system\"", () => {
    const { fireChange } = stubMatchMedia(false);
    useThemeStore.setState({ mode: "system" });

    const { result } = renderHook(() => useResolvedTheme());
    expect(result.current).toBe("light");

    act(() => {
      fireChange(true);
    });

    expect(result.current).toBe("dark");
  });

  it("sets document.documentElement.dataset.theme to the resolved value", () => {
    useThemeStore.setState({ mode: "dark" });

    renderHook(() => useResolvedTheme());

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("re-resolves via matchMedia when mode transitions into \"system\"", () => {
    stubMatchMedia(true);
    useThemeStore.setState({ mode: "light" });

    const { result } = renderHook(() => useResolvedTheme());
    expect(result.current).toBe("light");

    act(() => {
      useThemeStore.setState({ mode: "system" });
    });

    expect(result.current).toBe("dark");
  });
});
