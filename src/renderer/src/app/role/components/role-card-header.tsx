import React from "react";
import { privilegesData } from "../services/api";
import { Stack, Typography, Button } from "@mui/material";
function RoleCardHeader({
  privileges,
  setFieldValue,
  values,
}: {
  privileges: privilegesData;
  setFieldValue: Function;
  values: any;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography>{privileges.name}</Typography>
    </Stack>
  );
}

export default RoleCardHeader;
