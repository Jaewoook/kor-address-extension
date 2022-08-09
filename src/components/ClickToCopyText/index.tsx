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
            <Button className="text-click-to-copy" type="link" onClick={handleCopyClick}>{children}</Button>
        </Tooltip>
    );
};
