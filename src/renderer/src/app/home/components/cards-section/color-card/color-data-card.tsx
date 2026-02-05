import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "src/components/loader";
import PriceFormat from "src/components/price-format";

function ColorDataCard({
  title,
  value,
  image,
  isFetchingAllStatistics
}: {
  title: string;
  value: number | undefined;
  image: React.ReactNode;
  isFetchingAllStatistics: boolean;
}) {
  const { t } = useTranslation("translation")
  return (
    <Box
      sx={{
        display: "flex",
        gap: "6px",
        alignItems: "flex-end",
        justifyContent: "space-between",
        boxShadow: "1px 1px 3px #fffff0",
        borderRadius: "8px",
        bgcolor: "white",
        p: { xl: 3, md: 2, xs: 2 },
        py: 4,
      }}
    >



      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <>
          {
            isFetchingAllStatistics ? <Loader /> :
              <Typography variant="h2" fontWeight="bold">
                {value}
              </Typography>}
        </>
        <Typography variant="h5" fontSize={20}>
          {t(title)}
        </Typography>
      </Box>
      <Box sx={{ p: 0.2, bgcolor: "", borderRadius: "50px" }}>{image}</Box>
    </Box>
  );
}

export default ColorDataCard;
