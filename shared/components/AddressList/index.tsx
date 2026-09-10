import { Collapse, Typography } from "antd";
import type { CollapseProps } from "antd";
import { useMemo } from "react";
import styled from "styled-components";

import { ClickToCopyText } from "../ClickToCopyText";
import { FeedbackPopover } from "../FeedbackPopover";
import type { AddressData } from "@shared/models/address";
import type { DisplayOptions } from "@shared/models/settings";
import * as SharedColors from "@shared/constants/colors";
import * as SharedStrings from "@shared/constants/strings";

interface Props extends DisplayOptions {
  data: AddressData[];
}

const EmptyText = styled(Typography.Paragraph)`
  text-align: center;
  margin-top: 2em;
  margin-bottom: 2em !important;
  color: ${SharedColors.COLOR_TEXT_SECONDARY} !important;
  > span {
    font-size: 12px;
    color: ${SharedColors.COLOR_TEXT_FAINT} !important;
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
      <Row keyLabel={SharedStrings.ADDRESS_LABEL_ZIP_NO} value={address.zipNo} />
      {roadAddrShown ? (
        <Row keyLabel={SharedStrings.ADDRESS_LABEL_ROAD_ADDR} value={address.roadAddr} />
      ) : null}
      {streetNumAddrShown ? (
        <Row keyLabel={SharedStrings.ADDRESS_LABEL_JIBUN_ADDR} value={address.jibunAddr} />
      ) : null}
      {engAddrShown ? (
        <Row keyLabel={SharedStrings.ADDRESS_LABEL_ENG_ADDR} value={address.engAddr} />
      ) : null}
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
        {SharedStrings.ADDRESS_EMPTY_TEXT}
        <br />
        <span>{SharedStrings.ADDRESS_EMPTY_EXAMPLE}</span>
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
