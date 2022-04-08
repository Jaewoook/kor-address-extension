/*  eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import styled from "styled-components";
import "antd/dist/antd.min.css";
import "./App.css";
import {
    Button,
    Input,
    Layout,
    PageHeader,
    Spin,
    Typography,
} from "antd";
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    LoadingOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { AddressData, AddressManager } from "./AddressManager";
import { AddressList } from "./components/AddressList";
import { getRuntime } from "./utils";
import { SettingsManager, Settings } from "./SettingsManager";

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #f0f2f5;
`;

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

const Spinner: React.FC = () => (
    <Spin style={{ width: "100%", marginTop: "15px", marginBottom: "30px" }} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
);

interface Props {
    settings: SettingsManager<Settings> | null;
    address: AddressManager;
}

export const App = (props: Props) => {
    const { settings, address } = props;
    const [searchValue, setSearchValue] = React.useState("");
    const [showLoading, setShowLoading] = React.useState(false);
    const [isEnd, setIsEnd] = React.useState(false);
    const [showEngAddr, setShowEngAddr] = React.useState(true);
    const [showRoadAddr, setShowRoadAddr] = React.useState(true);
    const [showLegacyAddr, setShowLegacyAddr] = React.useState(true);
    const [addressData, setAddressData] = React.useState<AddressData[]>([]);
    const [updatingSettings, setUpdatingSettings] = React.useState(false);

    const handleSearchValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, [setSearchValue]);

    const handleSearchClick = React.useCallback(() => {
        if (address.previousSearchKey?.keyword === searchValue) {
            return;
        }

        setShowLoading(true);
        setAddressData([]);

        window.ga("send", "event", "address", "search", searchValue);
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
            setShowLoading(false);
        });
    }, [address, searchValue, setAddressData, setShowLoading]);

    const handleResetClick = React.useCallback(() => {
        setSearchValue("");
        handleSearchClick();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSearchValue]);

    const handleSearchOptionClick = React.useCallback((type: "eng" | "road" | "legacy") => async () => {
        if (updatingSettings) {
            return;
        }

        setUpdatingSettings(true);
        try {
            switch (type) {
                case "eng":
                    setShowEngAddr(!showEngAddr);
                    window.ga("send", "event", "option", !showEngAddr ? "on" : "off", "영문주소 표시");
                    await settings?.updateSettings({
                        searchResult: { showEng: !showEngAddr },
                    });
                    break;
                case "road":
                    setShowRoadAddr(!showRoadAddr);
                    window.ga("send", "event", "option", !showRoadAddr ? "on" : "off", "도로명주소 표시");
                    await settings?.updateSettings({
                        searchResult: { showRoad: !showRoadAddr },
                    });
                    break;
                case "legacy":
                    setShowLegacyAddr(!showLegacyAddr);
                    window.ga("send", "event", "option", !showLegacyAddr ? "on" : "off", "지번주소 표시");
                    await settings?.updateSettings({
                        searchResult: { showLegacy: !showLegacyAddr },
                    });
                    break;
            }
        } finally {
            setUpdatingSettings(false);
        }
    }, [settings, showEngAddr, showRoadAddr, showLegacyAddr, updatingSettings, setShowEngAddr, setShowRoadAddr, setShowLegacyAddr, setUpdatingSettings]);

    const loadNextAddress = React.useCallback(() => {
        if (showLoading) {
            return;
        }
        if (address.previousSearchKey?.end) {
            //  show end wording
            setIsEnd(true);
            return;
        }

        setShowLoading(true);
        const nextPage = (Number.parseInt(address.previousSearchKey?.currentPage!) + 1).toString();

        window.ga("send", "event", "address", "search", "추가 데이터 로드", Number.parseInt(nextPage));
        address.search({
            ...address.previousSearchKey!,
            currentPage: nextPage,
        }, true).then((data) => {
            setAddressData(data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setShowLoading(false);
        });
    }, [address, showLoading, setShowLoading]);

    const Options = React.useMemo(() => [
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

    const handleScrollEvent = React.useCallback(() => {
        const list = document.getElementsByClassName("address-list");
        const bottom = list[0]?.getBoundingClientRect().bottom ?? 0;
        if (bottom > 0 && bottom <= window.innerHeight) {
            console.log("scroll occurred");
            loadNextAddress();
        }
    }, [loadNextAddress]);

    React.useEffect(() => {
        if (getRuntime() === "extension") {
            settings?.once("ready", () => {
                console.log("Settings loaded", settings);
                const searchResult = settings?.settings?.searchResult;
                setShowEngAddr(searchResult?.showEng ?? false);
                setShowRoadAddr(searchResult?.showRoad ?? true);
                setShowLegacyAddr(searchResult?.showLegacy ?? true);

                if (settings.settings?.addressData?.length) {
                    setAddressData(settings.settings.addressData);
                    setSearchValue(settings.settings.prevSearchKey?.keyword ?? "");
                }
            });
        }
    }, [settings]);

    React.useEffect(() => {
        document.addEventListener("scroll", handleScrollEvent);
        return () => {
            document.removeEventListener("scroll", handleScrollEvent);
        };
    }, [handleScrollEvent]);

    return (
        <Layout>
            <Header>
                <PageHeader title="주소검색" extra={Options} />
                <SearchWrapper>
                    <Search
                        enterButton allowClear
                        placeholder="검색할 주소 입력"
                        value={searchValue}
                        loading={showLoading}
                        onChange={handleSearchValueChange}
                        onSearch={handleSearchClick} />
                </SearchWrapper>
            </Header>
            <Layout.Content style={{ marginTop: 124, backgroundColor: "#fafafa" }}>
                <ListTop addressData={addressData} onResetClick={handleResetClick} />
                <AddressList
                    data={addressData}
                    showEngAddr={showEngAddr}
                    showRoadAddr={showRoadAddr}
                    showLegacyAddr={showLegacyAddr} />
                {showLoading ? (
                    <Spinner />
                ) : isEnd ? (
                    <ListEnd>
                        <Typography.Text>✅ 모든 검색 결과를 확인했습니다!</Typography.Text>
                    </ListEnd>
                ) : null}
            </Layout.Content>
        </Layout>
    );
};
