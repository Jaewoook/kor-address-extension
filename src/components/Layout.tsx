/**
 * External modules
 */
import styled from "styled-components";
import { Layout as _Layout } from "antd";

export const Layout = styled(_Layout)`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #f0f2f5;
`;

export const Content = styled(_Layout.Content)`
    flex: 1;
    margin-top: 124px;
    background-color: #fafafa;
    overflow: scroll;
`;

export const Footer = styled(_Layout.Footer)`
    display: flex;
    padding: 0 0 16px 0;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;

    & * {
        color: rgba(0, 0, 0, 0.3) !important;
    }
    & > div > * {
        cursor: pointer;
    }
`;
