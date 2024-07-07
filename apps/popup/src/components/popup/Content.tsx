import type { AddressData } from "@repo/shared/models/address";
import { Layout, Spin, Typography } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineLoading, AiOutlineReload } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { AddressList } from "../ui/AddressList";
import { useAddressSearch } from "@/hooks/useAddressSearch";
import { useSettings } from "@/hooks/useSettings";
import { addressListState } from "@/states/address";
import { prevSearchKeyState, searchLoadingState } from "@/states/search";

const CHECK_COLOR = "#3CB043";

const Wrapper = styled(Layout.Content)`
  flex: 1;
  background-color: #fafafa;
  overflow: scroll;
`;

const ListTopWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-top: 4px;

  & > .ant-typography {
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
  }
  & > #clear-result {
    margin-left: auto;
    display: inherit;
    align-items: inherit;
    cursor: pointer;
    > span {
      color: rgba(0, 0, 0, 0.4);
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
          <Typography.Text>초기화</Typography.Text>
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
    color: rgba(0, 0, 0, 0.4);
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
  const addressList = useRecoilValue(addressListState);
  const searching = useRecoilValue(searchLoadingState);
  const prevSearchKey = useRecoilValue(prevSearchKeyState);
  const { searchNextPage, resetSearch } = useAddressSearch();
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
          <AiOutlineCheckCircle color={CHECK_COLOR} />
          <Typography.Paragraph>모든 검색 결과를 확인했습니다!</Typography.Paragraph>
        </ListEnd>
      ) : null}
    </Wrapper>
  );
};
