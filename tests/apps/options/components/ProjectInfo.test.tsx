import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectInfo } from "@options/components/ProjectInfo";

describe("ProjectInfo", () => {
  it("shows the project name, author, and a GitHub link", () => {
    render(<ProjectInfo />);
    expect(screen.getByText("주소검색 확장 프로그램")).toBeInTheDocument();
    expect(screen.getByText("Jaewook Ahn")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/Jaewoook/kor-address-extension",
    );
  });

  it("shows the MIT license", () => {
    render(<ProjectInfo />);
    expect(screen.getByText(/MIT License/i)).toBeInTheDocument();
  });
});
