import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AddressData } from "@shared/models/address";
import { AddressList } from "@shared/components/AddressList";

const address: AddressData = {
  roadAddr: "서울특별시 서초구 강남대로 323",
  roadAddrPart1: "서울특별시 서초구 강남대로 323",
  jibunAddr: "서울특별시 서초동 1337-27",
  engAddr: "323 Gangnam-daero, Seocho-gu, Seoul",
  zipNo: "06627",
};

describe("AddressList", () => {
  it("shows the empty-state message when there is no data", () => {
    render(<AddressList data={[]} engAddrShown roadAddrShown streetNumAddrShown />);
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("renders an entry for each address, expanded by default", () => {
    render(<AddressList data={[address]} engAddrShown roadAddrShown streetNumAddrShown />);
    expect(screen.getByText("06627")).toBeInTheDocument();
    // roadAddr appears twice: once as the collapse panel header, once in the expanded row
    expect(screen.getAllByText(address.roadAddr).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(address.jibunAddr)).toBeInTheDocument();
    expect(screen.getByText(address.engAddr)).toBeInTheDocument();
  });

  it("hides the road/jibun/English rows when their display options are off", () => {
    render(
      <AddressList
        data={[address]}
        engAddrShown={false}
        roadAddrShown={false}
        streetNumAddrShown={false}
      />,
    );
    // zip code always renders
    expect(screen.getByText("06627")).toBeInTheDocument();
    expect(screen.queryByText(address.jibunAddr)).not.toBeInTheDocument();
    expect(screen.queryByText(address.engAddr)).not.toBeInTheDocument();
  });
});
