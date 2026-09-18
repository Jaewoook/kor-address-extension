import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeSection } from "@options/components/ThemeSection";
import { useThemeStore } from "@shared/states/theme";

describe("ThemeSection", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "system" });
  });

  it("shows all three theme options", () => {
    render(<ThemeSection />);
    expect(screen.getByRole("radio", { name: "라이트" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "다크" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "시스템" })).toBeInTheDocument();
  });

  it("checks the option matching the current mode", () => {
    useThemeStore.setState({ mode: "dark" });
    render(<ThemeSection />);
    expect(screen.getByRole("radio", { name: "다크" })).toBeChecked();
  });

  it("clicking an option calls setMode with that value", async () => {
    const user = userEvent.setup();
    render(<ThemeSection />);

    await user.click(screen.getByRole("radio", { name: "라이트" }));

    expect(useThemeStore.getState().mode).toBe("light");
  });
});
