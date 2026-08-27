import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { useEffect } from "react";
import styled from "styled-components";

import { ProjectInfo } from "./components/ProjectInfo";
import { PrivacyPolicySection } from "./components/PrivacyPolicySection";
import { SearchHistorySection } from "./components/SearchHistorySection";
import { VersionInfo } from "./components/VersionInfo";
import { useSearchHistoryStore } from "@shared/states/history";

const Page = styled(Layout.Content)`
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;

const theme: ThemeConfig = {};

export const App = () => {
  useEffect(() => {
    useSearchHistoryStore.getState().hydrate();
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Page>
        <ProjectInfo />
        <SearchHistorySection />
        <PrivacyPolicySection />
        <VersionInfo />
      </Page>
    </ConfigProvider>
  );
};
