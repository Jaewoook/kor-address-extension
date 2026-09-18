import { useEffect, useState } from "react";

import { useThemeStore } from "@shared/states/theme";
import type { ResolvedTheme } from "@shared/models/theme";

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";

export const useResolvedTheme = (): ResolvedTheme => {
  const mode = useThemeStore((state) => state.mode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    mode === "system" ? getSystemTheme() : "light",
  );
  // Track the mode we last resolved systemTheme for, so a mode transition into
  // "system" (e.g. via the theme toggle) re-queries matchMedia immediately during
  // render instead of showing a stale value until the next OS-level change event.
  const [trackedMode, setTrackedMode] = useState(mode);
  if (mode !== trackedMode) {
    setTrackedMode(mode);
    if (mode === "system") {
      setSystemTheme(getSystemTheme());
    }
  }

  useEffect(() => {
    if (mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  const resolved = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  return resolved;
};
