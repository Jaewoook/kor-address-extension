import React from "react";
import {
    Button,
    Tooltip,
} from "antd";
import copy from "copy-to-clipboard";
import "./ClickToCopyText.css";

interface ClickToCopyTextProps {
    children: string;
}

export const ClickToCopyText: React.FC<ClickToCopyTextProps> = ({ children }: ClickToCopyTextProps) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyClick = React.useCallback(() => {
        setCopied(true);
        copy(children);
    }, [setCopied, children]);

    const handleVisibleChange = React.useCallback((visible: boolean) => {
        if (!visible) {
            setTimeout(() => setCopied(false), 100);
        }
    }, [setCopied]);
    return (
        <Tooltip title={!copied ? "클릭해서 복사하기" : "복사됨!"} onVisibleChange={handleVisibleChange}>
            <Button className="text-click-to-copy" type="link" onClick={handleCopyClick}>{children}</Button>
        </Tooltip>
    );
};
