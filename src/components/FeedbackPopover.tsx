/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import styled from "styled-components";
import { Button, Input, Popover, Typography } from "antd";
import axios from "axios";

const EMAIL_API = "https://api.jaewook.me/email/addr-extension-feedback";

const PopoverTitleWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const PopoverTitle = (props: { children: React.ReactNode; }) => {
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
    const [message, setMessage] = React.useState("");
    const [sending, setSending] = React.useState(false);
    const [sent, setSent] = React.useState(false);

    const handleSendClick = React.useCallback(async () => {
        if (sent) {
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
    }, [message, sent, setSent, setSending]);
    return <FeedbackSenderWrapper>
        <Input.TextArea disabled={sent || sending}
            value={message}
            rows={3}
            placeholder="이곳에 피드백 내용을 입력해주세요.&#10;작성해주신 소중한 피드백이 더 좋은 주소검색을 만들어요!"
            onChange={(ev) => setMessage(ev.target.value)} />
        <Button disabled={sent || sending} type="primary" onClick={handleSendClick}>
            {!sent ? "보내기 🎉" : "피드백 전달 완료! 💛"}
        </Button>
    </FeedbackSenderWrapper>;
};

export const FeedbackPopover = () => {
    return (
        <Popover
            placement="top"
            overlayStyle={PopoverContentStyle}
            title={<PopoverTitle>피드백 보내기</PopoverTitle>}
            content={<FeedbackForm />}
        >
            <Typography.Text keyboard>피드백 보내기</Typography.Text>
        </Popover>
    );
};
