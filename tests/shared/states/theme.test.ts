import { beforeEach, describe, expect, it } from "vitest";

import { useThemeStore } from "@shared/states/theme";

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ mode: "system" });
  });

  it("defaults to \"system\"", () => {
    expect(useThemeStore.getState().mode).toBe("system");
  });

  it("setMode updates the mode", () => {
    useThemeStore.getState().setMode("dark");
    expect(useThemeStore.getState().mode).toBe("dark");
  });

  it("setMode persists the mode", async () => {
    useThemeStore.getState().setMode("light");
    useThemeStore.setState({ mode: "system" });

    await useThemeStore.getState().hydrate();

    expect(useThemeStore.getState().mode).toBe("light");
  });

  it("hydrate loads the persisted mode", async () => {
    useThemeStore.getState().setMode("dark");
    useThemeStore.setState({ mode: "system" });

    await useThemeStore.getState().hydrate();

    expect(useThemeStore.getState().mode).toBe("dark");
  });

  it("hydrate leaves the default mode when nothing is persisted", async () => {
    await useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().mode).toBe("system");
  });
});
