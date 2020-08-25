import React from "react";
import {
    Button,
    Tooltip,
} from "antd";
import copy from "copy-to-clipboard";
import "./ClickToCopyText.css";

interface ClickToCopyTextProps {
    children: string;
    analytics?: "우편번호" | "도로명주소" | "지번주소" | "영문주소";
}

export const ClickToCopyText: React.FC<ClickToCopyTextProps> = ({ children, analytics }: ClickToCopyTextProps) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyClick = React.useCallback(() => {
        setCopied(true);
        copy(children);
        window.ga("send", "event", "address", "copy", `${analytics} 복사`);
    }, [setCopied, analytics, children]);

    const handleVisibleChange = React.useCallback((visible: boolean) => {
        if (!visible) {
            setTimeout(() => setCopied(false), 100);
        }
    }, [setCopied]);
    return (
        <Tooltip title={!copied ? "클릭해서 복사하기" : "복사됨!"} onVisibleChange={handleVisibleChange}>
            <Button className="text-click-to-copy" type="link" onClick={handleCopyClick}>{children}</Button>
        </Tooltip>
    );
};
