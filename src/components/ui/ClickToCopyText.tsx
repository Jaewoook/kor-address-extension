/**
 * External modules
 */
import { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import copy from "copy-to-clipboard";

const Text = styled(Button)`
  color: rgba(0, 0, 0, 0.65);
`;

interface Props {
  children: string;
}

export const ClickToCopyText = (props: Props) => {
  const { children } = props;
  const [copied, setCopied] = useState(false);

  const handleCopyClick = useCallback(() => {
    setCopied(true);
    copy(children);
  }, [children]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => setCopied(false), 100);
    }
  }, []);

  return (
    <Tooltip
      title={!copied ? "클릭해서 복사하기" : "복사완료!"}
      color={copied ? "green" : "#000"}
      onOpenChange={handleOpenChange}
    >
      <Text type="link" onClick={handleCopyClick}>
        {children}
      </Text>
    </Tooltip>
  );
};
