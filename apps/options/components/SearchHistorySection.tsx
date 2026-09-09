import { Button, Checkbox, InputNumber, Typography } from "antd";
import styled from "styled-components";

import { useSearchHistoryStore } from "@shared/states/history";

const Section = styled.section`
  margin-bottom: 32px;
`;

const LimitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
`;

const HistoryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #d9d9d9;
  border-radius: 6px;

  li {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const SearchHistorySection = () => {
  const history = useSearchHistoryStore((state) => state.history);
  const searchHistoryLimit = useSearchHistoryStore((state) => state.searchHistoryLimit);
  const clearHistory = useSearchHistoryStore((state) => state.clearHistory);
  const setSearchHistoryLimit = useSearchHistoryStore((state) => state.setSearchHistoryLimit);

  return (
    <Section>
      <Typography.Title level={3}>검색 기록</Typography.Title>
      <LimitRow>
        <InputNumber
          min={1}
          value={searchHistoryLimit.value}
          disabled={!searchHistoryLimit.enabled}
          onChange={(value) =>
            setSearchHistoryLimit((prev) => ({ ...prev, value: value ?? prev.value }))
          }
        />
        <Checkbox
          checked={!searchHistoryLimit.enabled}
          onChange={(e) =>
            setSearchHistoryLimit((prev) => ({ ...prev, enabled: !e.target.checked }))
          }
        >
          무제한
        </Checkbox>
        <Button onClick={clearHistory}>전체 삭제</Button>
      </LimitRow>
      {history.length === 0 ? (
        <Typography.Text type="secondary">검색 기록이 없습니다.</Typography.Text>
      ) : (
        <HistoryList>
          {history.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </HistoryList>
      )}
    </Section>
  );
};
