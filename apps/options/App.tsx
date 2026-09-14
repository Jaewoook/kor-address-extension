import { ConfigProvider, Layout, theme as antdTheme, ThemeConfig } from "antd";
import { useEffect, useMemo } from "react";
import styled from "styled-components";

import "@shared/theme.css";
import { ProjectInfo } from "./components/ProjectInfo";
import { PrivacyPolicySection } from "./components/PrivacyPolicySection";
import { SearchHistorySection } from "./components/SearchHistorySection";
import { useSearchHistoryStore } from "@shared/states/history";
import { useThemeStore } from "@shared/states/theme";
import { useResolvedTheme } from "@shared/hooks/useResolvedTheme";

const Page = styled(Layout.Content)`
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;

export const App = () => {
  const resolvedTheme = useResolvedTheme();
  const theme: ThemeConfig = useMemo(
    () => ({
      algorithm: resolvedTheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    }),
    [resolvedTheme],
  );

  useEffect(() => {
    useSearchHistoryStore.getState().hydrate();
    useThemeStore.getState().hydrate();
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Page>
        <ProjectInfo />
        <SearchHistorySection />
        <PrivacyPolicySection />
      </Page>
    </ConfigProvider>
  );
};
