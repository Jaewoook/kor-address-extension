import React from "react";
import * as Sentry from "@sentry/react";
import { render } from "react-dom";
import { App } from "./App";
import { getRuntime, isProduction } from "./utils";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

if (isProduction()) {
    Sentry.init({ dsn: "https://6b96accd47ff467da8394a51da93d909@o415139.ingest.sentry.io/5305794" });
}

let settings = null;

if (getRuntime() === "extension") {
    settings = new SettingsManager<Settings>(DEFAULT_SETTINGS);
}
const address = new AddressManager(settings);

render(<App settings={settings} address={address} />, document.getElementById("root"));
