import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useTranslation } from "react-i18next";
// import ChangePasswordDialog from "src/app/representatives/components/change-password-dialog";
type propsType = {
  id: string;
  title: string;
  resetPasswordHandler: (id: string) => void;
  adminTitle: string;
};

function TeamCard({ title, id, adminTitle }: propsType) {
  const { t } = useTranslation("translation");
  return (
    <Box
      sx={{
        height: "100px",
        p: 2,
        borderRadius: "12px",
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex",
        boxShadow: "6px 9px 20px 0px #ebebeb",
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="body1">{adminTitle}</Typography>
      </Box>
      {/* <ChangePasswordDialog isOperator id={id} isLoading={false} /> */}
    </Box>
  );
}

export default TeamCard;
