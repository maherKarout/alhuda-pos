import React from "react";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
function UnauthorizedError() {
  const { t } = useTranslation("translation");
  return (
    <Stack
      sx={{ height: "100%" }}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h1">401</Typography>
      <Typography variant="h1">{t("Unauthorized")}</Typography>
    </Stack>
  );
}

export default UnauthorizedError;
