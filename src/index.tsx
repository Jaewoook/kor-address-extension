import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { getRuntime, getEnv } from "./utils";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

//  inject NODE_ENV variable into window object
window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

//  initialize google analytics only in production
if (getEnv() === "production") {
    window.ga("create", "UA-108816190-2", "auto");
    window.ga("set", "checkProtocolTask", null);
    window.ga("send", "pageview", "/");
} else {
    console.info("Google Analytics disabled because runtime does not running in production.");
    window.ga = function() {};
}

let settings = null;

if (getRuntime() === "extension") {
    settings = new SettingsManager<Settings>(DEFAULT_SETTINGS);
}
const address = new AddressManager(settings);

render(<App settings={settings} address={address} />, document.getElementById("root"));
