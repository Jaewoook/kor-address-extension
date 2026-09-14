import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

// jsdom does not implement ResizeObserver; antd's Tooltip/Popup positioning
// (rc-resize-observer) requires it to be present, even as a no-op.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub;

// jsdom does not implement matchMedia; used to resolve "system" theme mode
// and by antd internals. Default: OS reports no dark-mode preference.
// Tests that need to control this call vi.stubGlobal("matchMedia", ...) themselves.
class MatchMediaStub implements MediaQueryList {
  matches = false;
  media: string;
  onchange = null;
  addEventListener() {}
  removeEventListener() {}
  addListener() {}
  removeListener() {}
  dispatchEvent(): boolean {
    return false;
  }
  constructor(media: string) {
    this.media = media;
  }
}
globalThis.matchMedia ??= ((media: string) => new MatchMediaStub(media)) as typeof window.matchMedia;

afterEach(() => {
  cleanup();
});
