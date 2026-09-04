import { useCallback } from "react";

import { useSettingsStore } from "@shared/states/settings";

export const useSettings = () => {
  const addressDisplayOptions = useSettingsStore((state) => state.addressDisplayOptions);
  const setAddressDisplayOptions = useSettingsStore((state) => state.setAddressDisplayOptions);

  const toggleDisplayOption = useCallback(
    (key: keyof typeof addressDisplayOptions) => {
      setAddressDisplayOptions((prevOptions) => ({
        ...prevOptions,
        [key]: !prevOptions[key],
      }));
    },
    [setAddressDisplayOptions],
  );

  return { addressDisplayOptions, toggleDisplayOption };
};
