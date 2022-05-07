/**
 * External modules
 */
import React, { useCallback, useState } from "react";
import {
    Button,
    Tooltip,
} from "antd";
import copy from "copy-to-clipboard";

/**
 * Internal modules
 */
import "./ClickToCopyText.css";

interface ClickToCopyTextProps {
    children: string;
    analytics?: "우편번호" | "도로명주소" | "지번주소" | "영문주소";
}

export const ClickToCopyText = (props: ClickToCopyTextProps) => {
    const { children, analytics } = props;
    const [copied, setCopied] = useState(false);

    const handleCopyClick = useCallback(() => {
        setCopied(true);
        copy(children);
        window.ga("send", "event", "address", "copy", `${analytics} 복사`);
    }, [analytics, children]);

    const handleVisibleChange = useCallback((visible: boolean) => {
        if (!visible) {
            setTimeout(() => setCopied(false), 100);
        }
    }, []);
    return (
        <Tooltip title={!copied ? "클릭해서 복사하기" : "복사완료!"} onVisibleChange={handleVisibleChange}>
            <Button className="text-click-to-copy" type="link" onClick={handleCopyClick}>{children}</Button>
        </Tooltip>
    );
};
