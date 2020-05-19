import React from "react";
import {
    Collapse,
    Typography,
} from "antd";
import { AddressData } from "../AddressManager";

interface Props {
    data: AddressData[];
}

export const AddressList = ({ data }: Props) => {
    if (!data || !data.length) {
        return <Typography.Text type="secondary">데이터가 없습니다.</Typography.Text>;
    }
    return (
        <Collapse bordered={false} defaultActiveKey={[0]}>
            {data.map((row, i) => (
                <Collapse.Panel key={i} header={row.roadAddr}>
                    <Typography.Text>지번주소: {row.jibunAddr}</Typography.Text>
                    <br />
                    <Typography.Text>영문주소: {row.engAddr}</Typography.Text>
                </Collapse.Panel>
            ))}
        </Collapse>
    );
};
