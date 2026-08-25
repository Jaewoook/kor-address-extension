import { render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { beforeEach, describe, expect, it } from "vitest";

import { Content } from "@/components/popup/Content";

// Smoke test: verifies the hooks/Recoil-state wiring (useAddressSearch,
// useSettings, and their backing atoms) renders without crashing.
describe("Content", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the empty-result state on first render", () => {
    render(
      <RecoilRoot>
        <Content />
      </RecoilRoot>,
    );

    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });
});
