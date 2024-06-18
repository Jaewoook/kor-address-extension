/**
 * External modules
 */
import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";

/**
 * Internal modules
 */
import { App } from "./App";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";
import { isExtension, isProduction } from "./utils";

window.dataLayer = window.dataLayer || [];
if (isProduction()) {
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag("config", "G-NJFP4YL0X3", {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  window.gtag("js", new Date());
  Sentry.init({
    dsn: "https://6b96accd47ff467da8394a51da93d909@o415139.ingest.sentry.io/5305794",
  });
} else {
  console.info(
    "Google Analytics disabled because runtime does not running in production."
  );
  window.gtag = function () {};
}

let settings = null;

if (isExtension()) {
  settings = new SettingsManager<Settings>(DEFAULT_SETTINGS);
}
const address = new AddressManager(settings);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App settings={settings} address={address} />
  </React.StrictMode>
);
