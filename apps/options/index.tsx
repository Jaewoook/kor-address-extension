import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { isProduction } from "@shared/utils";
import * as OptionsStrings from "./constants/strings";

if (isProduction()) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}

const ErrorFallback = () => <p style={{ padding: 16 }}>{OptionsStrings.ERROR_FALLBACK_MESSAGE}</p>;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
