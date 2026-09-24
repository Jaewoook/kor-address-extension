import { Button, ConfigProvider, Input, Layout } from "antd";
import { useCallback, useMemo } from "react";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import styled from "styled-components";

import { useAddressSearch } from "@shared/hooks/useAddressSearch";
import { useSettings } from "@shared/hooks/useSettings";
import * as SharedColors from "@shared/constants/colors";
import * as SharedValues from "@shared/constants/values";
import * as PopupStrings from "../constants/strings";

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;

  & > h1 {
    font-size: 20px;
    line-height: 40px;
    margin: 0;
  }
`;

const DisplayOptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SearchWrapper = styled(Layout.Content)`
  padding: 10px;
  background: linear-gradient(
    to bottom,
    ${SharedColors.COLOR_BACKGROUND_GRADIENT} 0%,
    ${SharedColors.COLOR_BACKGROUND_GRADIENT} 40%,
    ${SharedColors.COLOR_BACKGROUND_LIGHT} 40%,
    ${SharedColors.COLOR_BACKGROUND_LIGHT} 100%
  );
`;

const Search = styled(Input.Search)`
  &.ant-input-search {
    position: relative;
    box-shadow: 0px 8px 8px -8px ${SharedColors.COLOR_SHADOW};

    .ant-input-affix-wrapper {
      border-radius: 999px !important;
      padding-right: 44px;
    }

    .ant-input-search-btn {
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      width: 30px;
      height: auto;
      min-width: 0;
      padding: 0;
      border-radius: 50% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
  }
`;

const DISPLAY_OPTIONS = [
  {
    key: "engAddrShown",
    name: PopupStrings.DISPLAY_OPTION_ENG_ADDR_LABEL,
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
  {
    key: "roadAddrShown",
    name: PopupStrings.DISPLAY_OPTION_ROAD_ADDR_LABEL,
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
  {
    key: "streetNumAddrShown",
    name: PopupStrings.DISPLAY_OPTION_STREET_NUM_ADDR_LABEL,
    enabled: <AiFillCheckCircle />,
    disabled: <AiOutlineCheckCircle />,
  },
] as const;

export const Header = () => {
  const { searchKeyword, setSearchKeyword, searching, searchAddress } = useAddressSearch();
  const { addressDisplayOptions, toggleDisplayOption } = useSettings();

  const displayOptions = useMemo(
    () => (
      <ConfigProvider
        theme={{ components: { Button: { colorPrimaryBg: "rgba(64, 150, 255, 0.15)" } } }}
      >
        {DISPLAY_OPTIONS.map((displayOption) => (
          <Button
            key={displayOption.key}
            color={addressDisplayOptions[displayOption.key] ? "primary" : "default"}
            variant="filled"
            shape="round"
            size="small"
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
        ))}
      </ConfigProvider>
    ),
    [addressDisplayOptions, toggleDisplayOption],
  );

  const handleSearchKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value);
    },
    [setSearchKeyword],
  );

  const handleSearchClick = useCallback(async () => {
    // window.gtag("event", "search", {
    //   search_term: searchValue,
    // });

    const addressResult = await searchAddress({
      countPerPage: SharedValues.SEARCH_RESULTS_PER_PAGE,
      currentPage: "1",
      keyword: searchKeyword,
      end: false,
    });

    console.log(addressResult);
  }, [searchAddress, searchKeyword]);

  return (
    <header>
      <OptionsWrapper>
        <h1>{PopupStrings.HEADER_TITLE}</h1>
        <DisplayOptionsWrapper>{displayOptions}</DisplayOptionsWrapper>
      </OptionsWrapper>
      <SearchWrapper>
        <Search
          enterButton
          allowClear
          placeholder={PopupStrings.SEARCH_INPUT_PLACEHOLDER}
          value={searchKeyword}
          loading={searching}
          onChange={handleSearchKeywordChange}
          onSearch={handleSearchClick}
        />
      </SearchWrapper>
    </header>
  );
};
