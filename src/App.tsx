import React from "react";
import "antd/dist/antd.css";
import {
    Button,
    Input,
    Layout,
    PageHeader,
} from "antd";
import { AddressManager } from "./AddressManager";

const addrManager = new AddressManager();

export const App = () => {
    const [searchValue, setSearchValue] = React.useState("");
    const [showEngAddr, setShowEngAddr] = React.useState(false);
    const [showRoadAddr, setShowRoadAddr] = React.useState(true);
    const [showLegacyAddr, setShowLegacyAddr] = React.useState(true);

    const handleSearchValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, [setSearchValue]);

    const handleSearchClick = React.useCallback(() => {
        addrManager.search({
            countPerPage: "20",
            currentPage: "1",
            keyword: searchValue,
        })?.then((res) => {
            console.log("Response data", res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [searchValue]);

    const handleSearchOptionClick = React.useCallback((type: "eng" | "road" | "legacy") => () => {
        switch (type) {
            case "eng":
                setShowEngAddr(!showEngAddr);
                break;
            case "road":
                setShowRoadAddr(!showRoadAddr);
                break;
            case "legacy":
                setShowLegacyAddr(!showLegacyAddr);
                break;
        }
    }, [showEngAddr, showRoadAddr, showLegacyAddr, setShowEngAddr, setShowRoadAddr, setShowLegacyAddr]);

    return (
        <Layout>
            <PageHeader
                title="주소검색"
                extra={[
                    <Button
                        key={1} ghost={!showEngAddr} type="primary"
                        onClick={handleSearchOptionClick("eng")}>
                            영문주소
                    </Button>,
                    <Button key={2} ghost={!showRoadAddr} type="primary"
                        onClick={handleSearchOptionClick("road")}>
                            도로명주소
                    </Button>,
                    <Button key={3} ghost={!showLegacyAddr} type="primary"
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

            </Layout.Content>
        </Layout>
    );
};
