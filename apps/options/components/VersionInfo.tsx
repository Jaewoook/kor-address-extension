import { Typography } from "antd";
import styled from "styled-components";

import { getExtensionAPI } from "@shared/utils";

const Section = styled.section`
  margin-bottom: 32px;
`;

const getVersion = (): string => {
  const extAPI = getExtensionAPI();
  return extAPI?.runtime.getManifest().version ?? "알 수 없음";
};

export const VersionInfo = () => {
  return (
    <Section>
      <Typography.Title level={3}>버전</Typography.Title>
      <Typography.Text>{getVersion()}</Typography.Text>
    </Section>
  );
};
