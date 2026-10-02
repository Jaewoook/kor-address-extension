import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ClickToCopyText } from "@shared/components/ClickToCopyText";

const { mockCopy } = vi.hoisted(() => ({ mockCopy: vi.fn() }));
vi.mock("copy-to-clipboard", () => ({ default: mockCopy }));

describe("ClickToCopyText", () => {
  it("renders its children as text", () => {
    render(<ClickToCopyText>서울특별시 서초구 강남대로 323</ClickToCopyText>);
    expect(screen.getByText("서울특별시 서초구 강남대로 323")).toBeInTheDocument();
  });

  it("copies the text to the clipboard when clicked", async () => {
    const user = userEvent.setup();
    render(<ClickToCopyText>06627</ClickToCopyText>);

    await user.click(screen.getByText("06627"));

    expect(mockCopy).toHaveBeenCalledWith("06627");
  });

  it("confirms the copy, then resets the tooltip after it closes", async () => {
    const user = userEvent.setup();
    render(<ClickToCopyText>06627</ClickToCopyText>);
    const text = screen.getByText("06627");

    await user.hover(text);
    expect(await screen.findByText("클릭해서 복사하기")).toBeInTheDocument();

    await user.click(text);
    expect(await screen.findByText("복사완료!")).toBeInTheDocument();

    await user.unhover(text);
    await user.hover(text);
    expect(await screen.findByText("클릭해서 복사하기")).toBeInTheDocument();
  });
});
