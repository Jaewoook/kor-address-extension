import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Footer } from "@popup/components/Footer";
import { useThemeStore } from "@shared/states/theme";

describe("Footer", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "light" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("calls openOptionsPage when the settings icon is clicked", async () => {
    const openOptionsPage = vi.fn();
    vi.stubGlobal("chrome", { runtime: { id: "test-id", openOptionsPage } });
    const user = userEvent.setup();

    render(<Footer />);
    await user.click(screen.getByLabelText("설정"));

    expect(openOptionsPage).toHaveBeenCalledTimes(1);
  });

  it("opens the options page directly when not running as an extension", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();

    render(<Footer />);
    await user.click(screen.getByLabelText("설정"));

    expect(openSpy).toHaveBeenCalledWith("/options");
  });

  it("cycles light -> dark -> system -> light when the theme icon is clicked", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole("button", { name: "다크 모드로 전환" }));
    expect(useThemeStore.getState().mode).toBe("dark");

    await user.click(screen.getByRole("button", { name: "시스템 설정 모드로 전환" }));
    expect(useThemeStore.getState().mode).toBe("system");

    await user.click(screen.getByRole("button", { name: "라이트 모드로 전환" }));
    expect(useThemeStore.getState().mode).toBe("light");
  });

  it("shows a desktop icon when the mode is system", () => {
    useThemeStore.setState({ mode: "system" });
    render(<Footer />);

    expect(screen.getByTestId("theme-icon-system")).toBeInTheDocument();
    expect(screen.queryByTestId("theme-icon-light")).not.toBeInTheDocument();
    expect(screen.queryByTestId("theme-icon-dark")).not.toBeInTheDocument();
  });

  it("shows a sun icon when the mode is light", () => {
    useThemeStore.setState({ mode: "light" });
    render(<Footer />);

    expect(screen.getByTestId("theme-icon-light")).toBeInTheDocument();
  });

  it("shows a moon icon when the mode is dark", () => {
    useThemeStore.setState({ mode: "dark" });
    render(<Footer />);

    expect(screen.getByTestId("theme-icon-dark")).toBeInTheDocument();
  });
});
