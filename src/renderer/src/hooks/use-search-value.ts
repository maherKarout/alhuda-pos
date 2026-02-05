import React, { useState, useDeferredValue, useEffect } from "react";

function useSearchValue(search: (value: string) => void) {
  const [value, setValue] = useState("");
  const deferredValue = useDeferredValue(value);
  useEffect(() => {
    search(deferredValue);
  }, [deferredValue]);
  return { value, setValue, deferredValue };
}

export default useSearchValue;
