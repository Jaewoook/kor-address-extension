import { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import copy from "copy-to-clipboard";

import * as SharedColors from "@shared/constants/colors";
import * as SharedValues from "@shared/constants/values";
import * as SharedStrings from "@shared/constants/strings";

const Text = styled(Button)`
  color: ${SharedColors.COLOR_TEXT_TERTIARY} !important;

  :hover {
    color: ${SharedColors.COLOR_LINK};
  }
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
      setTimeout(() => setCopied(false), SharedValues.COPY_FEEDBACK_RESET_DELAY_MS);
    }
  }, []);

  return (
    <Tooltip
      title={!copied ? SharedStrings.COPY_TOOLTIP_IDLE : SharedStrings.COPY_TOOLTIP_DONE}
      color={copied ? SharedColors.COLOR_SUCCESS_TOOLTIP : SharedColors.COLOR_BLACK}
      styles={{ container: { paddingInline: 14 } }}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      onOpenChange={handleOpenChange}
    >
      <Text type="link" onClick={handleCopyClick}>
        {children}
      </Text>
    </Tooltip>
  );
};
