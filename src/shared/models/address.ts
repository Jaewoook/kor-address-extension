export type AddressData = {
  roadAddr: string;
  roadAddrPart1: string;
  roadAddrPart2?: string;
  jibunAddr: string;
  engAddr: string;
  zipNo: string;
};

export type SearchKey = {
  currentPage: string;
  countPerPage: string;
  keyword: string;
  end: boolean;
};

type AddressResponseBody = {
  common: {
    totalCount: string;
    currentPage: number;
    countPerPage: number;
    errorCode: string;
    errorMessage: string;
  };
  juso: AddressData[];
};

export type AddressSearchAPIResponse = {
  results: AddressResponseBody;
};
