import { Box, Typography } from "@mui/material";
import React from "react";
import PriceFormat from "src/components/price-format";
const ColorContainer = ({ color }: { color: string }) => (
  <div
    style={{
      height: "15px",
      width: "15px",
      borderRadius: "50px",
      backgroundColor: color,
      position: "relative",
      top: "-2px",
    }}
  ></div>
);
function ColorDataCard({
  color,
  title,
  value,
}: {
  color: string;
  title: string;
  value: number;
}) {
  return (
    <Box sx={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
      <ColorContainer color={color} />
      <Box sx={{ fontWeight: "600" }}>
        <Typography sx={{ fontWeight: "600" }}>{title}</Typography>
        <PriceFormat price={value} />
      </Box>
    </Box>
  );
}

export default ColorDataCard;
