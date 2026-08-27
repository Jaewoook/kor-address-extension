export type SearchHistoryLimit = {
  enabled: boolean; // false = unlimited
  value: number;    // retained even while enabled is false
};
