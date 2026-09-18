import { Radio, Typography } from "antd";
import styled from "styled-components";

import { useThemeStore } from "@shared/states/theme";
import type { ThemeMode } from "@shared/models/theme";
import * as OptionsStrings from "../constants/strings";

const Section = styled.section`
  margin-bottom: 32px;
`;

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: OptionsStrings.THEME_LIGHT_LABEL, value: "light" },
  { label: OptionsStrings.THEME_DARK_LABEL, value: "dark" },
  { label: OptionsStrings.THEME_SYSTEM_LABEL, value: "system" },
];

export const ThemeSection = () => {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <Section>
      <Typography.Title level={3}>{OptionsStrings.THEME_SECTION_TITLE}</Typography.Title>
      <Radio.Group options={THEME_OPTIONS} value={mode} onChange={(e) => setMode(e.target.value)} />
    </Section>
  );
};
