import { Layout, Space, Typography } from "antd";
import { AiFillGithub, AiFillSetting } from "react-icons/ai";
import styled from "styled-components";

import { getExtensionAPI } from "@shared/utils";
import * as SharedColors from "@shared/constants/colors";
import * as SharedUrls from "@shared/constants/urls";
import * as PopupStrings from "../constants/strings";

export const Wrapper = styled(Layout.Footer)`
  display: flex;
  padding: 0 0 16px 0;
  justify-content: center;
  align-items: center;
  background-color: ${SharedColors.COLOR_BACKGROUND_LIGHT};

  & * {
    color: ${SharedColors.COLOR_TEXT_FAINT} !important;
  }
  & > div > * {
    cursor: pointer;
  }
`;

export const Footer = () => {
  const handlePrivacyClick = () => {
    window.open(SharedUrls.PRIVACY_POLICY_URL);
  };

  const handleGitHubClick = () => {
    window.open(SharedUrls.GITHUB_REPO_URL);
  };

  const handleSettingsClick = () => {
    // dev-only
    if (getExtensionAPI() === null) {
      window.open("/options");
      return;
    }

    getExtensionAPI()?.runtime.openOptionsPage();
  };

  return (
    <Wrapper>
      <Space size="middle">
        <Typography.Text onClick={handlePrivacyClick}>
          {PopupStrings.PRIVACY_POLICY_LABEL}
        </Typography.Text>
        <AiFillGithub onClick={handleGitHubClick} />
        <AiFillSetting
          aria-label={PopupStrings.SETTINGS_ARIA_LABEL}
          role="button"
          onClick={handleSettingsClick}
        />
      </Space>
    </Wrapper>
  );
};
