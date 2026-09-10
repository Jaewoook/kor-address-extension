import { Layout, Spin, Typography } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineLoading, AiOutlineReload } from "react-icons/ai";
import styled from "styled-components";

import { AddressList } from "@shared/components/AddressList";
import { useAddressSearch } from "@shared/hooks/useAddressSearch";
import { useSettings } from "@shared/hooks/useSettings";
import type { AddressData } from "@shared/models/address";
import * as SharedColors from "@shared/constants/colors";
import * as PopupStrings from "../constants/strings";

const Wrapper = styled(Layout.Content)`
  flex: 1;
  background-color: ${SharedColors.COLOR_BACKGROUND_LIGHT};
  overflow: scroll;
`;

const ListTopWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-top: 4px;

  & > .ant-typography {
    color: ${SharedColors.COLOR_TEXT_MUTED};
    font-size: 12px;
  }
  & > #clear-result {
    margin-left: auto;
    display: inherit;
    align-items: inherit;
    cursor: pointer;
    > span {
      color: ${SharedColors.COLOR_TEXT_MUTED};
      font-size: 12px;
    }
    > .ant-typography {
      margin-left: 4px;
    }
  }
`;

interface ListTopProps {
  addressData: AddressData[];
  onResetClick: () => void;
}

const ListTop = (props: ListTopProps) => {
  return (
    <ListTopWrapper>
      {props.addressData.length ? (
        <div id="clear-result" onClick={props.onResetClick}>
          <AiOutlineReload />
          <Typography.Text>{PopupStrings.RESET_LABEL}</Typography.Text>
        </div>
      ) : null}
    </ListTopWrapper>
  );
};

const ListEnd = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  & > .ant-typography {
    color: ${SharedColors.COLOR_TEXT_MUTED};
    margin: 0;
  }
  & svg {
    margin-right: 6px;
  }
`;

const Spinner = () => (
  <Spin
    style={{ width: "100%", marginTop: "15px", marginBottom: "30px" }}
    indicator={<AiOutlineLoading style={{ fontSize: 24 }} />}
  />
);

export const Content = () => {
  const contentRef = useRef<HTMLElement>(null);
  const { addressList, prevSearchKey, searching, searchNextPage, resetSearch } = useAddressSearch();
  const { addressDisplayOptions } = useSettings();
  const isEnd = useMemo(() => prevSearchKey?.end ?? false, [prevSearchKey]);

  const handleResetClick = useCallback(() => {
    resetSearch();
  }, [resetSearch]);

  const handleScrollEvent = useCallback(() => {
    const scrollContainer = document.getElementById("content");
    if (!scrollContainer) {
      return;
    }

    if (scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight) {
      console.log("scroll occurred");
      searchNextPage();
    }
  }, [searchNextPage]);

  useEffect(() => {
    const scrollContainer = contentRef.current;
    scrollContainer?.addEventListener("scroll", handleScrollEvent);
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScrollEvent);
    };
  }, [contentRef, handleScrollEvent]);

  return (
    <Wrapper id="content" ref={contentRef}>
      <ListTop addressData={addressList} onResetClick={handleResetClick} />
      <AddressList
        data={addressList}
        engAddrShown={addressDisplayOptions.engAddrShown}
        roadAddrShown={addressDisplayOptions.roadAddrShown}
        streetNumAddrShown={addressDisplayOptions.streetNumAddrShown}
      />
      {searching ? (
        <Spinner />
      ) : isEnd ? (
        <ListEnd>
          <AiOutlineCheckCircle color={SharedColors.COLOR_SUCCESS} />
          <Typography.Paragraph>{PopupStrings.ALL_RESULTS_CHECKED_LABEL}</Typography.Paragraph>
        </ListEnd>
      ) : null}
    </Wrapper>
  );
};
