import { CacheProvider } from "@emotion/react";
import React from "react";
import useGetIsRtlDirection from "src/hooks/use-get-is-rtl-direction";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { StyleSheetManager } from "styled-components";
import useGetDirection from "src/hooks/use-get-direction";

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isRtl = useGetIsRtlDirection();
  const dir = useGetDirection();

  const cacheRtl = createCache({
    key: "mui-rtl",
    stylisPlugins: [rtlPlugin],
  });

  return isRtl ? (
    <CacheProvider value={cacheRtl}>
      <StyleSheetManager stylisPlugins={[rtlPlugin]}>
        <div dir={dir}>{children}</div>
      </StyleSheetManager>
    </CacheProvider>
  ) : (
    <>{children}</>
  );
};

export default CustomThemeProvider;
