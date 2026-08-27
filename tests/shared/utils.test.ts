import { afterEach, describe, expect, it, vi } from "vitest";

import { getExtensionAPI, getRuntime, isExtension, isProduction, merge } from "@shared/utils";

describe("merge", () => {
  it("overwrites primitive values on target with source values", () => {
    const target = { a: 1, b: 2 };
    const result = merge(target, { b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("recursively merges nested objects instead of overwriting them", () => {
    const target = { nested: { a: 1, b: 2 } };
    const result = merge(target, { nested: { b: 3 } });
    expect(result).toEqual({ nested: { a: 1, b: 3 } });
  });

  it("replaces arrays wholesale rather than merging element-by-element", () => {
    const target = { list: [1, 2, 3] };
    const result = merge(target, { list: [9] });
    expect(result).toEqual({ list: [9] });
  });

  it("adds new keys from source that target does not have", () => {
    const target = { a: 1 };
    const result = merge(target, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });
});

describe("getRuntime / isExtension / getExtensionAPI", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns \"other\" when neither chrome nor browser globals exist", () => {
    expect(getRuntime()).toBe("other");
    expect(isExtension()).toBe(false);
    expect(getExtensionAPI()).toBeNull();
  });

  it("returns \"extension\" when chrome.runtime.id is present", () => {
    vi.stubGlobal("chrome", { runtime: { id: "test-extension-id" } });
    expect(getRuntime()).toBe("extension");
    expect(isExtension()).toBe(true);
    expect(getExtensionAPI()).toBe(globalThis.chrome);
  });

  it("returns \"page\" when chrome exists without browser (e.g. a plain Chrome tab)", () => {
    // Chrome defines a `window.chrome` global on ordinary (non-extension) pages
    // too, but never a `browser` global (that's Firefox-only).
    vi.stubGlobal("chrome", { runtime: {} });
    expect(getRuntime()).toBe("page");
    expect(isExtension()).toBe(false);
  });

  it("returns \"page\" when both chrome and browser exist without a runtime id (e.g. Firefox)", () => {
    vi.stubGlobal("chrome", { runtime: {} });
    vi.stubGlobal("browser", { runtime: {} });
    expect(getRuntime()).toBe("page");
    expect(isExtension()).toBe(false);
  });
});

describe("isProduction", () => {
  it("reflects import.meta.env.PROD", () => {
    expect(isProduction()).toBe(import.meta.env.PROD);
  });
});
