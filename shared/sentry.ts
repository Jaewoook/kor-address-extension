import * as Sentry from "@sentry/react";

import { isExtension, isProduction } from "@shared/utils";

export const SENTRY_RELEASE = __SENTRY_RELEASE__;

const ANONYMOUS_USER_ID_KEY = "sentryAnonymousUserId";

// A random per-install ID so Sentry can count users; it carries no personal data.
// Kept in localStorage rather than chrome.storage because it must be read synchronously
// before Sentry.init, otherwise the first session of each popup open has no user.
export const getAnonymousUserId = (): string => {
  const existing = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
  if (existing) {
    return existing;
  }
  const id = crypto.randomUUID();
  localStorage.setItem(ANONYMOUS_USER_ID_KEY, id);
  return id;
};

export const initSentry = () => {
  if (!isProduction()) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: SENTRY_RELEASE,
    // Production builds served outside the extension (e.g. `yarn preview`) are local testing.
    environment: isExtension() ? "production" : "local",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    initialScope: { user: { id: getAnonymousUserId() } },
  });
};
