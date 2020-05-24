import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { initializeSettings, getRuntime } from "./utils";

window.__ENV__ = {
    NODE_ENV: process.env.REACT_APP_ENV as string,
};

if (getRuntime() === "extension") {
    chrome.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install") {
            console.log("Set default settings");
            initializeSettings();
        }
    });
}

render(<App />, document.getElementById("root"));
