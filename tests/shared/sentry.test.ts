import * as Sentry from "@sentry/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import manifest from "../../manifest.json";
import { getAnonymousUserId, initSentry, SENTRY_RELEASE } from "@shared/sentry";
import { isExtension, isProduction } from "@shared/utils";

vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({ name: "BrowserTracing" })),
}));
vi.mock("@shared/utils", () => ({
  isProduction: vi.fn(),
  isExtension: vi.fn(),
}));

const initOptions = () => vi.mocked(Sentry.init).mock.calls[0][0]!;

describe("SENTRY_RELEASE", () => {
  it("is tagged with the version from manifest.json", () => {
    expect(SENTRY_RELEASE).toBe(`kor-address-extension@${manifest.version}`);
  });
});

describe("getAnonymousUserId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates an ID once and reuses it afterwards", () => {
    const first = getAnonymousUserId();
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(getAnonymousUserId()).toBe(first);
  });
});

describe("initSentry", () => {
  beforeEach(() => {
    vi.mocked(Sentry.init).mockClear();
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isExtension).mockReturnValue(true);
    localStorage.clear();
  });

  it("does nothing outside production builds", () => {
    vi.mocked(isProduction).mockReturnValue(false);
    initSentry();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("reports the release and the anonymous user", () => {
    initSentry();
    expect(initOptions().release).toBe(SENTRY_RELEASE);
    expect(initOptions().initialScope).toEqual({ user: { id: getAnonymousUserId() } });
  });

  it('uses the "production" environment inside the extension', () => {
    initSentry();
    expect(initOptions().environment).toBe("production");
  });

  it('uses the "local" environment when served outside the extension', () => {
    vi.mocked(isExtension).mockReturnValue(false);
    initSentry();
    expect(initOptions().environment).toBe("local");
  });
});
