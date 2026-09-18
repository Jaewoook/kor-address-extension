type Runtime = "other" | "page" | "extension" | "unknown";

export const isProduction = () => import.meta.env.PROD;

export const getRuntime = (): Runtime => {
  try {
    const hasChrome = typeof chrome !== "undefined";
    const hasBrowser = typeof browser !== "undefined";

    if (!hasChrome && !hasBrowser) {
      return "other";
    } else if ((hasChrome && chrome.runtime?.id) || (hasBrowser && browser.runtime?.id)) {
      return "extension";
    } else {
      return "page";
    }
  } catch (err) {
    if (!(err instanceof ReferenceError)) {
      throw err;
    }
  }
  return "unknown";
};

export const isExtension = () => getRuntime() === "extension";

export const getExtensionAPI = () => {
  if (!isExtension()) {
    return null;
  }
  if (typeof chrome === "object") {
    return chrome;
  }
  if (typeof browser === "object") {
    return browser;
  }
  return null;
};

export const getVersion = (): string => {
  const extAPI = getExtensionAPI();
  return extAPI?.runtime.getManifest().version ?? "Unknown version";
};
