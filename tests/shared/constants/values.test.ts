import { describe, expect, it } from "vitest";

import manifest from "../../../manifest.json";
import { SENTRY_RELEASE } from "@shared/constants/values";

describe("SENTRY_RELEASE", () => {
  it("tags Sentry events with the version from manifest.json", () => {
    expect(SENTRY_RELEASE).toBe(`kor-address-extension@${manifest.version}`);
  });
});
