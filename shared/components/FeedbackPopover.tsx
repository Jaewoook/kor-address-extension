import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Input, Popover, Typography } from "antd";
import axios from "axios";

import * as SharedStrings from "@shared/constants/strings";

const EMAIL_API = "https://api.jaewook.me/email/addr-extension-feedback";

const PopoverTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PopoverTitle = (props: { children: React.ReactNode }) => {
  return <PopoverTitleWrapper>{props.children}</PopoverTitleWrapper>;
};

const FeedbackSenderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > button.ant-btn {
    margin-top: 8px;
    width: 100%;
  }
`;

const PopoverContentStyle = {
  width: "270px",
};

const FeedbackForm = () => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendClick = useCallback(async () => {
    if (sent || !message) {
      return;
    }
    setSending(true);
    try {
      await axios.post(EMAIL_API, { feedbackContent: message });
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }, [message, sent]);

  return (
    <FeedbackSenderWrapper>
      <Input.TextArea
        disabled={sent || sending}
        value={message}
        rows={3}
        placeholder={SharedStrings.FEEDBACK_PLACEHOLDER}
        onChange={(ev) => setMessage(ev.target.value)}
      />
      <Button disabled={sent || sending || !message} type="primary" onClick={handleSendClick}>
        {!sent ? SharedStrings.FEEDBACK_SEND_LABEL : SharedStrings.FEEDBACK_SENT_LABEL}
      </Button>
    </FeedbackSenderWrapper>
  );
};

export const FeedbackPopover = () => {
  return (
    <Popover
      placement="top"
      overlayStyle={PopoverContentStyle}
      title={<PopoverTitle>{SharedStrings.FEEDBACK_TRIGGER_LABEL}</PopoverTitle>}
      content={<FeedbackForm />}
    >
      <Typography.Text keyboard>{SharedStrings.FEEDBACK_TRIGGER_LABEL}</Typography.Text>
    </Popover>
  );
};
