/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import styled from "styled-components";
import { Button, Collapse, Input, Popover, Typography } from "antd";
import { AddressData } from "../../AddressManager";
import { ClickToCopyText } from "../ClickToCopyText";
import "./AddressList.css";

interface Props {
    data: AddressData[];
    showEngAddr: boolean;
    showRoadAddr: boolean;
    showLegacyAddr: boolean;
}

const EmptyText = styled(Typography.Paragraph)`
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em !important;
    color: rgba(0, 0, 0, 0.6) !important;
    > span {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.3) !important;
    }
`;

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

const FeedbackSender = () => {
    return <FeedbackSenderWrapper>
        <Input.TextArea rows={3} />
        <Button type="primary">보내기 🎉</Button>
    </FeedbackSenderWrapper>;
};

export const AddressList = (props: Props) => {
    const { data, showEngAddr, showRoadAddr, showLegacyAddr } = props;
    if (!data || !data.length) {
        return <EmptyText type="secondary">
            검색 결과가 없습니다.<br />
            <span>(검색어 예시: 강남대로, 자양동, 초성 검색 가능)</span><br />
            <Popover overlayStyle={PopoverContentStyle} placement="top" title={<PopoverTitle>피드백 보내기</PopoverTitle>} content={<FeedbackSender />}>
                <Typography.Text keyboard>피드백 보내기</Typography.Text>
            </Popover>
        </EmptyText>;
    }
    return (
        <Collapse className="address-list" bordered={false} defaultActiveKey={[0]}>
            {data.map((row, i) => (
                <Collapse.Panel key={i} header={row.roadAddr}>
                    <div>
                        <Typography.Paragraph className="addr-label">우편번호:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText analytics="우편번호">
                                {row.zipNo}
                            </ClickToCopyText>
                        </div>
                    </div>
                    {showRoadAddr ? <div>
                        <Typography.Paragraph className="addr-label">도로명주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText analytics="도로명주소">
                                {row.roadAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                    {showLegacyAddr ? <div>
                        <Typography.Paragraph className="addr-label">지번주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText analytics="지번주소">
                                {row.jibunAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                    {showEngAddr ? <div>
                        <Typography.Paragraph className="addr-label">영문주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText analytics="영문주소">
                                {row.engAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                </Collapse.Panel>
            ))}
        </Collapse>
    );
};
