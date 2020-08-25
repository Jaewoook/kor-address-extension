import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { getRuntime } from "./utils";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

let settings = null;

if (getRuntime() === "extension") {
    settings = new SettingsManager<Settings>(DEFAULT_SETTINGS);
}
const address = new AddressManager(settings);

render(<App settings={settings} address={address} />, document.getElementById("root"));
