import { Image, Typography } from "antd";
import styled from "styled-components";

import { getVersion } from "@shared/utils";

const Section = styled.section`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
  gap: 32px;
`;

export const ProjectInfo = () => {
  return (
    <Section>
      <div>
        <Image src="/logo.png" alt="logo image" preview={false} />
      </div>
      <div>
        <Typography.Title level={3}>주소검색 확장 프로그램</Typography.Title>
        <Typography.Paragraph>
          <span>{getVersion()}</span> ·{" "}
          <a href="https://github.com/Jaewoook/kor-address-extension" target="_blank" rel="noreferrer">
            View source code
          </a> ·{" "}
          <span>MIT License</span>
        </Typography.Paragraph>
      </div>
    </Section>
  );
};
