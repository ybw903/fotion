import React from "react";
import { useState } from "react";

const useSearch = (
  defaultValue?: string,
  compositFn?: (string: string) => void
) => {
  const [search, setSearch] = useState(defaultValue ?? "");

  const handleChangeSearch = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(evt.target.value);
      if (compositFn) compositFn(evt.target.value);
    },
    [compositFn]
  );

  return {
    search,
    handleChangeSearch,
  };
};

export default useSearch;
