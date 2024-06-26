/**
 * Merge a `source` object to a `target` recursively
 */
export const merge = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !(source[key] instanceof Array)) {
      Object.assign(source[key], merge(target[key] || {}, source[key]));
    } else if (source[key] instanceof Array) {
      //  If source property type is Array, then overwrite existing array
      target[key] = source[key];
    }
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

type Runtime = "other" | "page" | "extension" | "unknown";

export const isProduction = () => import.meta.env.PROD;

export const getRuntime = (): Runtime => {
  try {
    if (typeof chrome === "undefined" && typeof browser === "undefined") {
      return "other";
    } else if (chrome?.runtime?.id || browser?.runtime?.id) {
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
