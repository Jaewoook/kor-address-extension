import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Footer } from "@popup/components/Footer";

describe("Footer", () => {
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
});
