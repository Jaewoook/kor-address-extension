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

afterEach(() => {
  cleanup();
});
