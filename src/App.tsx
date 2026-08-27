import { ConfigProvider, Layout as _Layout, ThemeConfig } from "antd";
import { useEffect } from "react";
import styled from "styled-components";

import "./App.css";
import { Content, Footer, Header } from "./components/popup";
import { useAddressStore } from "./states/address";
import { useSearchStore } from "./states/search";
import { useSettingsStore } from "./states/settings";

export const Layout = styled(_Layout)`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const theme: ThemeConfig = {
  components: {
    Collapse: {
      contentPadding: "0 16px",
    },
  },
};

export const App = () => {
  useEffect(() => {
    useAddressStore.getState().hydrate();
    useSearchStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
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
