import { Typography } from "antd";
import styled from "styled-components";

const Section = styled.section`
  margin-bottom: 32px;
`;

export const ProjectInfo = () => {
  return (
    <Section>
      <Typography.Title level={3}>주소검색 확장 프로그램</Typography.Title>
      <Typography.Paragraph>
        제작자: <span>Jaewook Ahn</span> ·{" "}
        <a href="https://github.com/Jaewoook/kor-address-extension" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        MIT License. Copyright (c) Jaewook Ahn. Permission is hereby granted, free
        of charge, to any person obtaining a copy of this software and associated
        documentation files, to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software.
      </Typography.Paragraph>
    </Section>
  );
};
