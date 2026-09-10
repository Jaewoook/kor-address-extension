import { Typography } from "antd";
import styled from "styled-components";

import { PRIVACY_POLICY_HTML } from "@shared/privacyPolicyContent.js";
import * as SharedColors from "@shared/constants/colors";
import * as OptionsStrings from "../constants/strings";

const Section = styled.section`
  margin-bottom: 32px;
`;

const Content = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: ${SharedColors.COLOR_TEXT_PRIMARY};

  p,
  li {
    margin: 0 0 8px;
  }
`;

export const PrivacyPolicySection = () => {
  return (
    <Section>
      <Typography.Title level={3}>{OptionsStrings.PRIVACY_POLICY_TITLE}</Typography.Title>
      <Content dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY_HTML }} />
    </Section>
  );
};
