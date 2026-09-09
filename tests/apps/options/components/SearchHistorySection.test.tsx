import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { SearchHistorySection } from "@options/components/SearchHistorySection";
import { useSearchHistoryStore } from "@shared/states/history";

describe("SearchHistorySection", () => {
  beforeEach(() => {
    useSearchHistoryStore.setState({
      history: [],
      searchHistoryLimit: { enabled: true, value: 50 },
    });
  });

  it("shows an empty-state message when history is empty", () => {
    render(<SearchHistorySection />);
    expect(screen.getByText("검색 기록이 없습니다.")).toBeInTheDocument();
  });

  it("lists each history entry", () => {
    useSearchHistoryStore.setState({ history: ["강남대로", "자양동"] });
    render(<SearchHistorySection />);
    expect(screen.getByText("강남대로")).toBeInTheDocument();
    expect(screen.getByText("자양동")).toBeInTheDocument();
  });

  it("clear-all button empties the history", async () => {
    const user = userEvent.setup();
    useSearchHistoryStore.setState({ history: ["강남대로"] });
    render(<SearchHistorySection />);

    await user.click(screen.getByRole("button", { name: "전체 삭제" }));

    expect(useSearchHistoryStore.getState().history).toEqual([]);
  });

  it("unchecking the limit checkbox disables it but keeps the numeric value visible", async () => {
    const user = userEvent.setup();
    render(<SearchHistorySection />);

    await user.click(screen.getByRole("checkbox", { name: "무제한" }));

    expect(useSearchHistoryStore.getState().searchHistoryLimit.enabled).toBe(false);
    expect(useSearchHistoryStore.getState().searchHistoryLimit.value).toBe(50);
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
  });
});
