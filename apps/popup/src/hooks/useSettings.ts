import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { addressDisplayOptionsState } from "@/states/settings";

export const useSettings = () => {
  const [addressDisplayOptions, setAddressDisplayOptions] = useRecoilState(addressDisplayOptionsState);
  const toggleDisplayOption = useCallback((key: keyof typeof addressDisplayOptions) => {
    setAddressDisplayOptions((prevOptions) => ({
      ...prevOptions,
      [key]: !prevOptions[key],
    }));
  }, [setAddressDisplayOptions]);

  return { addressDisplayOptions, toggleDisplayOption };
};
