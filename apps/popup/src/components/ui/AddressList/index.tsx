/**
 * External modules
 */
import type { AddressData } from "@repo/shared/models/address";
import type { DisplayOptions } from "@repo/shared/models/settings";
import { Collapse, Typography } from "antd";
import type { CollapseProps } from "antd";
import { useMemo } from "react";
import styled from "styled-components";

/**
 * Internal modules
 */
// import "./AddressList.css";
import { ClickToCopyText } from "../ClickToCopyText";
import { FeedbackPopover } from "../FeedbackPopover";

interface Props extends DisplayOptions {
  data: AddressData[];
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

interface RowProps {
  keyLabel: string;
  value: string;
}

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div.addr-value {
    flex: 1;
  }
  & > .addr-label {
    flex: 0 0 72px;
    margin: 0 !important;
}
`;

const Row = ({ keyLabel, value }: RowProps) => {
  return (
    <RowWrapper>
      <Typography.Paragraph className="addr-label">
        {keyLabel}
      </Typography.Paragraph>
      <div className="addr-value">
        <ClickToCopyText>{value}</ClickToCopyText>
      </div>
    </RowWrapper>
  );
};

const AddressItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface AddressItemProps extends DisplayOptions {
  address: AddressData;
}

const AddressItem = ({
  address,
  engAddrShown,
  roadAddrShown,
  streetNumAddrShown,
}: AddressItemProps) => {
  return (
    <AddressItemWrapper>
      <Row keyLabel="우편번호: " value={address.zipNo} />
      {roadAddrShown ? <Row keyLabel="도로명주소: " value={address.roadAddr} /> : null}
      {streetNumAddrShown ? <Row keyLabel="지번주소: " value={address.jibunAddr} /> : null}
      {engAddrShown ? <Row keyLabel="영문주소: " value={address.engAddr} /> : null}
    </AddressItemWrapper>
  );
};

export const AddressList = (props: Props) => {
  const { data, engAddrShown, roadAddrShown, streetNumAddrShown } = props;
  const listItems: CollapseProps["items"] = useMemo(
    () =>
      data.map((addressData, i) => ({
        key: i,
        label: addressData.roadAddr,
        children: (
          <AddressItem
            address={addressData}
            engAddrShown={engAddrShown}
            roadAddrShown={roadAddrShown}
            streetNumAddrShown={streetNumAddrShown}
          />
        ),
      })),
    [data, engAddrShown, roadAddrShown, streetNumAddrShown],
  );

  if (!data || !data.length) {
    return (
      <EmptyText type="secondary">
        검색 결과가 없습니다.
        <br />
        <span>(검색어 예시: 강남대로, 자양동, 초성 검색 가능)</span>
        <br />
        <FeedbackPopover />
      </EmptyText>
    );
  }

  return (
    <Collapse
      className="address-list"
      ghost
      items={listItems}
      bordered={false}
      defaultActiveKey={[0]}
    />
  );
};
