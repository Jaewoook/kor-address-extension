import { Typography } from "antd";
import styled from "styled-components";

import { PRIVACY_POLICY_HTML } from "@shared/privacyPolicyContent.js";

const Section = styled.section`
  margin-bottom: 32px;
`;

const Content = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.75);

  p,
  li {
    margin: 0 0 8px;
  }
`;

export const PrivacyPolicySection = () => {
  return (
    <Section>
      <Typography.Title level={3}>개인정보처리방침</Typography.Title>
      <Content dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY_HTML }} />
    </Section>
  );
};
