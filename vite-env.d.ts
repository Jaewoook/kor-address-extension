/// <reference types="vite/client" />
/// <reference types="chrome" />
/// <reference types="firefox-webext-browser" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_JUSO_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
