import { ConfigProvider, Layout as _Layout, theme as antdTheme, ThemeConfig } from "antd";
import { useEffect, useMemo } from "react";
import styled from "styled-components";

import "./App.css";
import "@shared/theme.css";
import { Content, Footer, Header } from "./components";
import { useAddressStore } from "@shared/states/address";
import { useSearchHistoryStore } from "@shared/states/history";
import { useSearchStore } from "@shared/states/search";
import { useSettingsStore } from "@shared/states/settings";
import { useThemeStore } from "@shared/states/theme";
import { useResolvedTheme } from "@shared/hooks/useResolvedTheme";

export const Layout = styled(_Layout)`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const App = () => {
  const resolvedTheme = useResolvedTheme();
  const theme: ThemeConfig = useMemo(
    () => ({
      algorithm: resolvedTheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      components: {
        Collapse: {
          contentPadding: "0 16px",
        },
      },
    }),
    [resolvedTheme],
  );

  useEffect(() => {
    useAddressStore.getState().hydrate();
    useSearchStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
    useSearchHistoryStore.getState().hydrate();
    useThemeStore.getState().hydrate();
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header />
        <Content />
        <Footer />
      </Layout>
    </ConfigProvider>
  );
};
