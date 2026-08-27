import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PrivacyPolicySection } from "@options/components/PrivacyPolicySection";

describe("PrivacyPolicySection", () => {
  it("renders the extracted privacy policy content", () => {
    render(<PrivacyPolicySection />);
    // PRIVACY_POLICY_HTML repeats both phrases several times throughout the
    // document (e.g. "개인정보 보호법" appears 6x, "제1조(...)" appears 2x as a
    // heading and again inline), so getByText's single-match assertion isn't
    // satisfiable here. getAllByText(...)[0] still asserts the content
    // rendered, without depending on an exact-one-match property the source
    // data doesn't have.
    expect(screen.getAllByText(/개인정보 보호법/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/제1조\(개인정보의 처리 목적\)/)[0]).toBeInTheDocument();
  });
});
