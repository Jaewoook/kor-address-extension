import { Layout, Space, Typography } from "antd";
import { AiFillGithub, AiFillSetting } from "react-icons/ai";
import styled from "styled-components";

import { getExtensionAPI } from "@shared/utils";

export const Wrapper = styled(Layout.Footer)`
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

export const Footer = () => {
  const handlePrivacyClick = () => {
    window.open(
      "https://raw.githack.com/Jaewoook/kor-address-extension/main/privacy.html",
    );
  };

  const handleGitHubClick = () => {
    window.open("https://github.com/Jaewoook/kor-address-extension");
  };

  const handleSettingsClick = () => {
    getExtensionAPI()?.runtime.openOptionsPage();
  };

  return (
    <Wrapper>
      <Space size="middle">
        <Typography.Text onClick={handlePrivacyClick}>
          개인정보 처리방침
        </Typography.Text>
        <AiFillGithub onClick={handleGitHubClick} />
        <AiFillSetting aria-label="설정" role="button" onClick={handleSettingsClick} />
      </Space>
    </Wrapper>
  );
};
