import { beforeEach, describe, expect, it } from "vitest";

import { useSearchHistoryStore } from "@shared/states/history";

describe("useSearchHistoryStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSearchHistoryStore.setState({
      history: [],
      searchHistoryLimit: { enabled: true, value: 50 },
    });
  });

  it("addKeyword adds a new keyword to the front", () => {
    useSearchHistoryStore.getState().addKeyword("강남대로");
    expect(useSearchHistoryStore.getState().history).toEqual(["강남대로"]);
  });

  it("addKeyword dedupes by moving a repeat to the front", () => {
    const { addKeyword } = useSearchHistoryStore.getState();
    addKeyword("강남대로");
    addKeyword("자양동");
    addKeyword("강남대로");
    expect(useSearchHistoryStore.getState().history).toEqual(["강남대로", "자양동"]);
  });

  it("addKeyword truncates past the limit when enabled", () => {
    useSearchHistoryStore.setState({ searchHistoryLimit: { enabled: true, value: 2 } });
    const { addKeyword } = useSearchHistoryStore.getState();
    addKeyword("a");
    addKeyword("b");
    addKeyword("c");
    expect(useSearchHistoryStore.getState().history).toEqual(["c", "b"]);
  });

  it("addKeyword does not truncate when the limit is disabled", () => {
    useSearchHistoryStore.setState({ searchHistoryLimit: { enabled: false, value: 2 } });
    const { addKeyword } = useSearchHistoryStore.getState();
    addKeyword("a");
    addKeyword("b");
    addKeyword("c");
    expect(useSearchHistoryStore.getState().history).toEqual(["c", "b", "a"]);
  });

  it("setSearchHistoryLimit toggling enabled off then on retains the value", () => {
    const { setSearchHistoryLimit } = useSearchHistoryStore.getState();
    setSearchHistoryLimit({ enabled: true, value: 10 });
    setSearchHistoryLimit((prev) => ({ ...prev, enabled: false }));
    expect(useSearchHistoryStore.getState().searchHistoryLimit).toEqual({ enabled: false, value: 10 });
    setSearchHistoryLimit((prev) => ({ ...prev, enabled: true }));
    expect(useSearchHistoryStore.getState().searchHistoryLimit).toEqual({ enabled: true, value: 10 });
  });

  it("clearHistory empties the list", () => {
    const { addKeyword, clearHistory } = useSearchHistoryStore.getState();
    addKeyword("강남대로");
    clearHistory();
    expect(useSearchHistoryStore.getState().history).toEqual([]);
  });

  it("hydrate loads persisted history and limit", async () => {
    useSearchHistoryStore.getState().addKeyword("강남대로");
    useSearchHistoryStore.setState({
      history: [],
      searchHistoryLimit: { enabled: true, value: 50 },
    });
    await useSearchHistoryStore.getState().hydrate();
    expect(useSearchHistoryStore.getState().history).toEqual(["강남대로"]);
  });
});
