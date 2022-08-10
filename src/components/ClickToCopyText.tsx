/**
 * External modules
 */
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
    Button,
    Tooltip,
} from "antd";
import copy from "copy-to-clipboard";

const Text = styled(Button)`
    color: rgba(0, 0, 0, 0.65);
`;

interface ClickToCopyTextProps {
    children: string;
}

export const ClickToCopyText = (props: ClickToCopyTextProps) => {
    const { children } = props;
    const [copied, setCopied] = useState(false);

    const handleCopyClick = useCallback(() => {
        setCopied(true);
        copy(children);
    }, [children]);

    const handleVisibleChange = useCallback((visible: boolean) => {
        if (!visible) {
            setTimeout(() => setCopied(false), 100);
        }
    }, []);
    return (
        <Tooltip title={!copied ? "클릭해서 복사하기" : "복사완료!"} onVisibleChange={handleVisibleChange}>
            <Text type="link" onClick={handleCopyClick}>{children}</Text>
        </Tooltip>
    );
};
