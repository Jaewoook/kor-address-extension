import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "@options/App";
import { useSearchHistoryStore } from "@shared/states/history";
import { useThemeStore } from "@shared/states/theme";

describe("options App", () => {
  const hydrateHistory = vi.fn();
  const hydrateTheme = vi.fn();

  beforeEach(() => {
    hydrateHistory.mockClear();
    hydrateTheme.mockClear();
    useSearchHistoryStore.setState({ history: [], hydrate: hydrateHistory });
    useThemeStore.setState({ mode: "light", hydrate: hydrateTheme });
  });

  it("restores search history and theme once on startup", () => {
    render(<App />);

    expect(hydrateHistory).toHaveBeenCalledTimes(1);
    expect(hydrateTheme).toHaveBeenCalledTimes(1);
  });

  it("renders every settings section", () => {
    render(<App />);

    for (const title of ["테마", "검색 기록", "개인정보처리방침"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});
