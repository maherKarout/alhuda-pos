import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AreYouSureDialog from "../dialog/are-you-sure-dialog";
function ActivateButton({
  checked,
  loading,
  onClick,
  warningDialog,
}: {
  checked: boolean;
  loading: boolean;
  warningDialog?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        disabled={loading}
        onClick={(e) => {
          warningDialog ? setOpen(true) : onClick(e);
        }}
      >
        {checked ? (
          <CheckCircleOutlineIcon color="primary" />
        ) : (
          <CancelIcon color="error" />
        )}
      </IconButton>
      <AreYouSureDialog
        confirmHandler={onClick}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default ActivateButton;
