import { Layout, Space, Typography } from "antd";
import { AiFillGithub, AiFillMoon, AiFillSetting, AiFillSun } from "react-icons/ai";
import styled from "styled-components";

import { getExtensionAPI } from "@shared/utils";
import * as SharedColors from "@shared/constants/colors";
import * as SharedUrls from "@shared/constants/urls";
import { useResolvedTheme } from "@shared/hooks/useResolvedTheme";
import { useThemeStore } from "@shared/states/theme";
import type { ThemeMode } from "@shared/models/theme";
import * as PopupStrings from "../constants/strings";

const NEXT_THEME_MODE: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const NEXT_THEME_LABEL: Record<ThemeMode, string> = {
  light: PopupStrings.THEME_TOGGLE_LABEL_TO_DARK,
  dark: PopupStrings.THEME_TOGGLE_LABEL_TO_SYSTEM,
  system: PopupStrings.THEME_TOGGLE_LABEL_TO_LIGHT,
};

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
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const resolvedTheme = useResolvedTheme();

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

  const handleThemeClick = () => {
    setMode(NEXT_THEME_MODE[mode]);
  };

  return (
    <Wrapper>
      <Space size="middle">
        <Typography.Text onClick={handlePrivacyClick}>
          {PopupStrings.PRIVACY_POLICY_LABEL}
        </Typography.Text>
        <AiFillGithub onClick={handleGitHubClick} />
        {resolvedTheme === "dark" ? (
          <AiFillMoon
            aria-label={NEXT_THEME_LABEL[mode]}
            role="button"
            onClick={handleThemeClick}
          />
        ) : (
          <AiFillSun aria-label={NEXT_THEME_LABEL[mode]} role="button" onClick={handleThemeClick} />
        )}
        <AiFillSetting
          aria-label={PopupStrings.SETTINGS_ARIA_LABEL}
          role="button"
          onClick={handleSettingsClick}
        />
      </Space>
    </Wrapper>
  );
};
