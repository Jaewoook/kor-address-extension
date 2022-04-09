import React from "react";
import { render } from "react-dom";
import * as Sentry from "@sentry/react";
import { App } from "./App";
import { getRuntime, isProduction } from "./utils";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

//  inject NODE_ENV variable into window object
window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

if (isProduction()) {
    Sentry.init({ dsn: "https://6b96accd47ff467da8394a51da93d909@o415139.ingest.sentry.io/5305794" });
}

const settings = getRuntime() === "extension" ? new SettingsManager<Settings>(DEFAULT_SETTINGS) : null;
const address = new AddressManager(settings);

render((
    <React.StrictMode>
        <App settings={settings} address={address} />
    </React.StrictMode>
), document.getElementById("root"));
