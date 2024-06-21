import { Button, Input, Layout } from "antd";
import { useCallback, useMemo } from "react";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { useAddressSearch } from "@/hooks/useAddressSearch";
import { useSettings } from "@/hooks/useSettings";
import { searchKeywordState, searchLoadingState } from "@/states/search";
import { addressDisplayOptionsState } from "@/states/settings";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: #f0f2f5;
`;

const OptionsWrapper = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;

  > h1 {
    font-size: 20px;
    line-height: 32px;
    margin: 0;
  }
`;

const SearchWrapper = styled(Layout.Content)`
  padding: 10px;
  background: linear-gradient(
    to bottom,
    #f0f2f5 0%,
    #f0f2f5 40%,
    #fafafa 40%,
    #fafafa 100%
  );
`;

const Search = styled(Input.Search)`
  box-shadow: 0px 8px 8px -8px rgba(0, 0, 0, 0.1);
`;

const DISPLAY_OPTIONS = [
  {
    key: "engAddrShown",
    name: "영문주소",
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
  {
    key: "roadAddrShown",
    name: "도로명주소",
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
  {
    key: "streetNumAddrShown",
    name: "지번주소",
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
] as const;

export const Header = () => {
  const addressDisplayOptions = useRecoilValue(addressDisplayOptionsState);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  const [searching, setSearching] = useRecoilState(searchLoadingState);
  const { searchAddress } = useAddressSearch();
  const { toggleDisplayOption } = useSettings();

  const displayOptions = useMemo(
    () =>
      DISPLAY_OPTIONS.map((displayOption) => (
        <Button
          key={displayOption.key}
          type="link"
          onClick={() => toggleDisplayOption(displayOption.key)}
          icon={
            addressDisplayOptions[displayOption.key] ? (
              <AiFillCheckCircle />
            ) : (
              <AiOutlineCheckCircle />
            )
          }
        >
          {displayOption.name}
        </Button>
      )),
    [addressDisplayOptions, toggleDisplayOption],
  );

  const handleSearchKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value);
    },
    [setSearchKeyword],
  );

  const handleSearchClick = useCallback(async () => {
    // if (address.previousSearchKey?.keyword === searchKeyword) {
    //   return;
    // }

    setSearching(true);
    // setAddressData([]);

    // window.gtag("event", "search", {
    //   search_term: searchValue,
    // });

    try {
      const addressResult = await searchAddress({
        countPerPage: "20",
        currentPage: "1",
        keyword: searchKeyword,
        end: false,
      });

      console.log(addressResult);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, [searchAddress, searchKeyword, setSearching]);

  return (
    <Wrapper>
      <OptionsWrapper>
        <h1>주소검색</h1>
        <div>{displayOptions}</div>
      </OptionsWrapper>
      <SearchWrapper>
        <Search
          enterButton
          allowClear
          placeholder="검색할 주소 입력"
          value={searchKeyword}
          loading={searching}
          onChange={handleSearchKeywordChange}
          onSearch={handleSearchClick}
        />
      </SearchWrapper>
    </Wrapper>
  );
};
