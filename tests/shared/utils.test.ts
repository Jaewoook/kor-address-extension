import { afterEach, describe, expect, it, vi } from "vitest";

import { getExtensionAPI, getRuntime, getVersion, isExtension, isProduction } from "@shared/utils";

describe("getRuntime / isExtension / getExtensionAPI", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns "other" when neither chrome nor browser globals exist', () => {
    expect(getRuntime()).toBe("other");
    expect(isExtension()).toBe(false);
    expect(getExtensionAPI()).toBeNull();
  });

  it('returns "extension" when chrome.runtime.id is present', () => {
    vi.stubGlobal("chrome", { runtime: { id: "test-extension-id" } });
    expect(getRuntime()).toBe("extension");
    expect(isExtension()).toBe(true);
    expect(getExtensionAPI()).toBe(globalThis.chrome);
  });

  it('returns "page" when chrome exists without browser (e.g. a plain Chrome tab)', () => {
    // Chrome defines a `window.chrome` global on ordinary (non-extension) pages
    // too, but never a `browser` global (that's Firefox-only).
    vi.stubGlobal("chrome", { runtime: {} });
    expect(getRuntime()).toBe("page");
    expect(isExtension()).toBe(false);
  });

  it('returns "page" when both chrome and browser exist without a runtime id (e.g. Firefox)', () => {
    vi.stubGlobal("chrome", { runtime: {} });
    vi.stubGlobal("browser", { runtime: {} });
    expect(getRuntime()).toBe("page");
    expect(isExtension()).toBe(false);
  });
});

describe("getVersion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the manifest version when running as an extension", () => {
    vi.stubGlobal("chrome", {
      runtime: { id: "test-extension-id", getManifest: () => ({ version: "1.2.3" }) },
    });
    expect(getVersion()).toBe("1.2.3");
  });

  it("returns a fallback when not running as an extension", () => {
    expect(getVersion()).toBe("Unknown version");
  });
});

describe("isProduction", () => {
  it("reflects import.meta.env.PROD", () => {
    expect(isProduction()).toBe(import.meta.env.PROD);
  });
});
