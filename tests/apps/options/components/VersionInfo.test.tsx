import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { VersionInfo } from "@options/components/VersionInfo";

describe("VersionInfo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the version from getManifest() when running as an extension", () => {
    vi.stubGlobal("chrome", {
      runtime: { id: "test-id", getManifest: () => ({ version: "2.0.0" }) },
    });
    render(<VersionInfo />);
    expect(screen.getByText("2.0.0")).toBeInTheDocument();
  });

  it("shows a fallback when not running as an extension", () => {
    render(<VersionInfo />);
    expect(screen.getByText("알 수 없음")).toBeInTheDocument();
  });
});
