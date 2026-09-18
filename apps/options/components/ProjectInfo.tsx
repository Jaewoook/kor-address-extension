import { Image, Typography } from "antd";
import styled from "styled-components";

import { getVersion } from "@shared/utils";
import * as SharedUrls from "@shared/constants/urls";
import * as OptionsStrings from "../constants/strings";

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
        <Typography.Title level={3}>{OptionsStrings.PROJECT_NAME}</Typography.Title>
        <Typography.Paragraph>
          <span>{getVersion()}</span> ·{" "}
          <a href={SharedUrls.GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            {OptionsStrings.SOURCE_CODE_LINK_LABEL}
          </a>{" "}
          · <span>{OptionsStrings.MIT_LICENSE_LABEL}</span>
        </Typography.Paragraph>
      </div>
    </Section>
  );
};
