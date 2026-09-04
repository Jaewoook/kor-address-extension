import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { isProduction } from "@shared/utils";

if (isProduction()) {
  Sentry.init({
    dsn: "https://6b96accd47ff467da8394a51da93d909@o415139.ingest.sentry.io/5305794",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}

const ErrorFallback = () => <p style={{ padding: 16 }}>오류가 발생했습니다. 옵션 페이지를 다시 열어주세요.</p>;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
