import { Layout as _Layout } from "antd";
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

export const App = () => {
  return (
    <RecoilRoot>
      <Layout>
        <Header />
        <Content />
        <Footer />
      </Layout>
    </RecoilRoot>
  );
};
