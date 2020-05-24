import React from "react";
import "antd/dist/antd.less";
import "./App.css";
import {
    Button,
    Input,
    Layout,
    PageHeader,
} from "antd";
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { AddressData, AddressManager } from "./AddressManager";
import { AddressList } from "./components/AddressList";
import { loadSettings, updateSettings, getRuntime } from "./utils";

const addrManager = new AddressManager();

export const App = () => {
    const [searchValue, setSearchValue] = React.useState("");
    const [showEngAddr, setShowEngAddr] = React.useState(true);
    const [showRoadAddr, setShowRoadAddr] = React.useState(true);
    const [showLegacyAddr, setShowLegacyAddr] = React.useState(true);
    const [addressData, setAddressData] = React.useState<AddressData[]>([]);
    const [updatingSettings, setUpdatingSettings] = React.useState(false);

    const handleSearchValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, [setSearchValue]);

    const handleSearchClick = React.useCallback(() => {
        addrManager.search({
            countPerPage: "20",
            currentPage: "1",
            keyword: searchValue,
        })?.then((res) => {
            console.log("Response data", res);
            setAddressData(res.data.juso);
        }).catch((err) => {
            console.error(err);
        });
    }, [searchValue, setAddressData]);

    const handleSearchOptionClick = React.useCallback((type: "eng" | "road" | "legacy") => async () => {
        if (updatingSettings) {
            return;
        }

        setUpdatingSettings(true);
        try {
            switch (type) {
                case "eng":
                    setShowEngAddr(!showEngAddr);
                    await updateSettings({
                        searchResult: {
                            showEng: !showEngAddr,
                            showRoad: showRoadAddr,
                            showLegacy: showLegacyAddr,
                        },
                    });
                    break;
                case "road":
                    setShowRoadAddr(!showRoadAddr);
                    await updateSettings({
                        searchResult: {
                            showEng: showEngAddr,
                            showRoad: !showRoadAddr,
                            showLegacy: showLegacyAddr,
                        },
                    });
                    break;
                case "legacy":
                    setShowLegacyAddr(!showLegacyAddr);
                    await updateSettings({
                        searchResult: {
                            showEng: showEngAddr,
                            showRoad: !showRoadAddr,
                            showLegacy: showLegacyAddr,
                        },
                    });
                    break;
            }
        } finally {
            setUpdatingSettings(false);
        }
    }, [showEngAddr, showRoadAddr, showLegacyAddr, updatingSettings, setShowEngAddr, setShowRoadAddr, setShowLegacyAddr, setUpdatingSettings]);

    React.useEffect(() => {
        if (getRuntime() === "extension") {
            loadSettings().then((settings) => {
                setShowEngAddr(settings.searchResult.showEng);
                setShowRoadAddr(settings.searchResult.showRoad);
                setShowLegacyAddr(settings.searchResult.showLegacy);
            });
        }
    }, []);

    return (
        <Layout>
            <PageHeader
                title="주소검색"
                extra={[
                    <Button
                        key={1} type="link" disabled={updatingSettings}
                        icon={showEngAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("eng")}>
                            영문주소
                    </Button>,
                    <Button key={2} type="link" disabled={updatingSettings}
                        icon={showRoadAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("road")}>
                            도로명주소
                    </Button>,
                    <Button key={3} type="link" disabled={updatingSettings}
                        icon={showLegacyAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("legacy")}>
                            지번주소
                    </Button>,
                ]} />
            <Layout.Content style={{ padding: "10px" }}>
                {/* <h1>주소 검색</h1> */}
                <Input.Search
                    enterButton allowClear
                    value={searchValue}
                    onChange={handleSearchValueChange}
                    onPressEnter={handleSearchClick} />
            </Layout.Content>
            <Layout.Content>
                <AddressList data={addressData} />
            </Layout.Content>
        </Layout>
    );
};
