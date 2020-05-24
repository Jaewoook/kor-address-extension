import React from "react";
import {
    Collapse,
    Typography,
} from "antd";
import { AddressData } from "../../AddressManager";
import { ClickToCopyText } from "../ClickToCopyText";
import "./AddressList.css";

interface Props {
    data: AddressData[];
    showEngAddr: boolean;
    showRoadAddr: boolean;
    showLegacyAddr: boolean;
}

export const AddressList = (props: Props) => {
    const { data, showEngAddr, showRoadAddr, showLegacyAddr } = props;
    if (!data || !data.length) {
        return <Typography.Paragraph className="no-data-label" type="secondary">데이터가 없습니다.</Typography.Paragraph>;
    }
    return (
        <Collapse bordered={false} defaultActiveKey={[0]}>
            {data.map((row, i) => (
                <Collapse.Panel key={i} header={row.roadAddr}>
                    <Typography.Paragraph className="addr-label">우편번호:</Typography.Paragraph>
                    <ClickToCopyText>
                        {row.zipNo}
                    </ClickToCopyText>
                    {showRoadAddr ? <>
                        <br />
                        <Typography.Paragraph className="addr-label">도로명주소:</Typography.Paragraph>
                        <ClickToCopyText>
                            {row.roadAddr}
                        </ClickToCopyText>
                    </> : null}
                    {showLegacyAddr ? <>
                        <br />
                        <Typography.Paragraph className="addr-label">지번주소:</Typography.Paragraph>
                        <ClickToCopyText>
                            {row.jibunAddr}
                        </ClickToCopyText>
                    </> : null}
                    {showEngAddr ? <>
                        <br />
                        <Typography.Paragraph className="addr-label">영문주소:</Typography.Paragraph>
                        <ClickToCopyText>
                            {row.engAddr}
                        </ClickToCopyText>
                    </> : null}
                </Collapse.Panel>
            ))}
        </Collapse>
    );
};
