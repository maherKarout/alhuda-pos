import { Box, Typography } from "@mui/material";
import React from "react";
import PriceFormat from "src/components/price-format";

function DonateNowCard() {
  return (
    <>
      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.palette.secondary.main}`,
          borderRadius: "8px",
          p: 2,
          bgcolor: "white",
        })}
      >
        <Typography sx={{ fontWeight: "600" }}>كفالة</Typography>
        <Typography sx={{ fontWeight: "600" }}>
          <PriceFormat price={130000} />
        </Typography>
      </Box>
    </>
  );
}

export default DonateNowCard;
