import { ConfigProvider, Layout as _Layout, ThemeConfig } from "antd";
import { RecoilRoot } from "recoil";
import styled from "styled-components";

import "./App.css";
import { Content, Footer, Header } from "./components/popup";

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
  return (
    <RecoilRoot>
      <ConfigProvider theme={theme}>
        <Layout>
          <Header />
          <Content />
          <Footer />
        </Layout>
      </ConfigProvider>
    </RecoilRoot>
  );
};
