import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProjectInfo } from "@options/components/ProjectInfo";

describe("ProjectInfo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the project name, logo, and a source code link", () => {
    render(<ProjectInfo />);
    expect(screen.getByText("주소검색 확장 프로그램")).toBeInTheDocument();
    expect(screen.getByAltText("logo image")).toHaveAttribute("src", "/logo.png");
    expect(screen.getByRole("link", { name: /View source code/i })).toHaveAttribute(
      "href",
      "https://github.com/Jaewoook/kor-address-extension",
    );
  });

  it("shows the MIT license", () => {
    render(<ProjectInfo />);
    expect(screen.getByText(/MIT License/i)).toBeInTheDocument();
  });

  it("shows the version from getManifest() when running as an extension", () => {
    vi.stubGlobal("chrome", {
      runtime: { id: "test-id", getManifest: () => ({ version: "2.0.0" }) },
    });
    render(<ProjectInfo />);
    expect(screen.getByText("2.0.0")).toBeInTheDocument();
  });

  it("shows a fallback when not running as an extension", () => {
    render(<ProjectInfo />);
    expect(screen.getByText("Unknown version")).toBeInTheDocument();
  });
});
