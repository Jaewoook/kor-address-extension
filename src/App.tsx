/*  eslint-disable jsx-a11y/accessible-emoji */
/**
 * External modules
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
    Button,
    Input,
    PageHeader,
    Space,
    Spin,
    Typography,
} from "antd";
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    GithubFilled,
    LoadingOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

/**
 * Internal modules
 */
import "./App.css";
import { AddressList, Content, Footer, Header, Layout } from "./components";
import { AddressData, AddressManager } from "./AddressManager";
import { SettingsManager, Settings } from "./SettingsManager";
import { isExtension } from "./utils";

const ListTopWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin-top: 4px;

    > .ant-typography {
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
    }
    > #clear-result {
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
    return <ListTopWrapper>
        {props.addressData.length ? (
            <div id="clear-result" onClick={props.onResetClick}>
                <ReloadOutlined />
                <Typography.Text>초기화</Typography.Text>
            </div>
        ) : null}
    </ListTopWrapper>;
};

const SearchWrapper = styled(Layout.Content)`
    padding: 10px;
    background: linear-gradient(to bottom, #f0f2f5 0%, #f0f2f5 40%, #fafafa 40%, #fafafa 100%);
`;

const Search = styled(Input.Search)`
    box-shadow: 0px 8px 8px -8px rgba(0,0,0,0.1);
`;

const ListEnd = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    > .ant-typography {
        color: rgba(0, 0, 0, 0.4);
    }
`;

const Spinner = () => (
    <Spin style={{ width: "100%", marginTop: "15px", marginBottom: "30px" }} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
);

interface Props {
    settings: SettingsManager<Settings> | null;
    address: AddressManager;
}

export const App = (props: Props) => {
    const { settings, address } = props;
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [showEngAddr, setShowEngAddr] = useState(true);
    const [showRoadAddr, setShowRoadAddr] = useState(true);
    const [showLegacyAddr, setShowLegacyAddr] = useState(true);
    const [addressData, setAddressData] = useState<AddressData[]>([]);
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    const handleSearchValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, [setSearchValue]);

    const handleSearchClick = useCallback(() => {
        if (address.previousSearchKey?.keyword === searchValue) {
            return;
        }

        setLoading(true);
        setAddressData([]);

        window.gtag("event", "search", {
            search_term: searchValue,
        });
        address.search({
            countPerPage: "20",
            currentPage: "1",
            keyword: searchValue,
            end: false,
        })?.then((data) => {
            setAddressData(data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [address, searchValue]);

    const handleResetClick = useCallback(() => {
        setSearchValue("");
        setIsEnd(false);
        handleSearchClick();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrivacyClick = () => {
        window.open("https://raw.githack.com/Jaewoook/kor-address-extension/master/privacy.html");
    };

    const handleGitHubClick = () => {
        window.open("https://github.com/Jaewoook/kor-address-extension");
    };

    const handleSearchOptionClick = useCallback((type: "eng" | "road" | "legacy") => async () => {
        if (updatingSettings) {
            return;
        }

        setUpdatingSettings(true);
        try {
            switch (type) {
                case "eng":
                    setShowEngAddr(!showEngAddr);
                    await settings?.updateSettings({
                        searchResult: { showEng: !showEngAddr },
                    });
                    break;
                case "road":
                    setShowRoadAddr(!showRoadAddr);
                    await settings?.updateSettings({
                        searchResult: { showRoad: !showRoadAddr },
                    });
                    break;
                case "legacy":
                    setShowLegacyAddr(!showLegacyAddr);
                    await settings?.updateSettings({
                        searchResult: { showLegacy: !showLegacyAddr },
                    });
                    break;
            }
        } finally {
            setUpdatingSettings(false);
        }
    }, [settings, showEngAddr, showRoadAddr, showLegacyAddr, updatingSettings]);

    const loadNextAddress = useCallback(() => {
        if (loading) {
            return;
        }
        if (address.previousSearchKey?.end) {
            //  show end wording
            setIsEnd(true);
            return;
        }

        setLoading(true);
        const nextPage = (Number.parseInt(address.previousSearchKey?.currentPage!) + 1).toString();

        address.search({
            ...address.previousSearchKey!,
            currentPage: nextPage,
        }, true).then((data) => {
            setAddressData(data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [address, loading]);

    const Options = useMemo(() => [
        <Button key={1} type="link" disabled={updatingSettings} onClick={handleSearchOptionClick("eng")}
            icon={showEngAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}>
                영문주소
        </Button>,
        <Button key={2} type="link" disabled={updatingSettings} onClick={handleSearchOptionClick("road")}
            icon={showRoadAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}>
                도로명주소
        </Button>,
        <Button key={3} type="link" disabled={updatingSettings} onClick={handleSearchOptionClick("legacy")}
            icon={showLegacyAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}>
                지번주소
        </Button>,
    ], [showEngAddr, showRoadAddr, showLegacyAddr, updatingSettings, handleSearchOptionClick]);

    const handleScrollEvent = useCallback(() => {
        const scrollContainer = document.getElementById("content");
        if (!scrollContainer) {
            return;
        }

        if (scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight) {
            console.log("scroll occurred");
            loadNextAddress();
        }
    }, [loadNextAddress]);

    useEffect(() => {
        if (!isExtension()) {
            return;
        }

        console.log("Settings loaded", settings);
        const searchResult = settings?.settings?.searchResult;
        setShowEngAddr(searchResult?.showEng ?? false);
        setShowRoadAddr(searchResult?.showRoad ?? true);
        setShowLegacyAddr(searchResult?.showLegacy ?? true);

        if (settings?.settings?.addressData?.length) {
            setAddressData(settings.settings.addressData);
            setSearchValue(settings.settings.prevSearchKey?.keyword ?? "");
        }
    }, [settings]);

    useEffect(() => {
        const scrollContainer = contentRef.current;
        scrollContainer?.addEventListener("scroll", handleScrollEvent);
        return () => {
            scrollContainer?.removeEventListener("scroll", handleScrollEvent);
        };
    }, [contentRef, handleScrollEvent]);

    return (
        <Layout>
            <Header>
                <PageHeader title="주소검색" extra={Options} />
                <SearchWrapper>
                    <Search
                        enterButton allowClear
                        placeholder="검색할 주소 입력"
                        value={searchValue}
                        loading={loading}
                        onChange={handleSearchValueChange}
                        onSearch={handleSearchClick} />
                </SearchWrapper>
            </Header>
            <Content id="content" ref={contentRef}>
                <ListTop addressData={addressData} onResetClick={handleResetClick} />
                <AddressList
                    data={addressData}
                    showEngAddr={showEngAddr}
                    showRoadAddr={showRoadAddr}
                    showLegacyAddr={showLegacyAddr} />
                {loading ? (
                    <Spinner />
                ) : isEnd ? (
                    <ListEnd>
                        <Typography.Text>✅ 모든 검색 결과를 확인했습니다!</Typography.Text>
                    </ListEnd>
                ) : null}
            </Content>
            <Footer>
                <Space size="middle">
                    <Typography.Text onClick={handlePrivacyClick}>개인정보 처리방침</Typography.Text>
                    <GithubFilled onClick={handleGitHubClick} />
                </Space>
            </Footer>
        </Layout>
    );
};
