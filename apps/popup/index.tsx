import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { initSentry } from "@shared/sentry";
import * as PopupStrings from "./constants/strings";

initSentry();

const ErrorFallback = () => <p style={{ padding: 16 }}>{PopupStrings.ERROR_FALLBACK_MESSAGE}</p>;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
