import React from "react";
import { render } from "react-dom";
import ReactGA from "react-ga";
import { App } from "./App";
import { getRuntime, getEnv } from "./utils";
import { AddressManager } from "./AddressManager";
import { SettingsManager, Settings, DEFAULT_SETTINGS } from "./SettingsManager";

window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

//  initialize google analytics
ReactGA.initialize("UA-108816190-2", {
    debug: getEnv() !== "production",
});
ReactGA.pageview(window.location.pathname);

let settings = null;

if (getRuntime() === "extension") {
    settings = new SettingsManager<Settings>(DEFAULT_SETTINGS);
}
const address = new AddressManager(settings);

render(<App settings={settings} address={address} />, document.getElementById("root"));
