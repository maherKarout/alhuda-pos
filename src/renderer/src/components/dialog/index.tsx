import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Stack,
  IconButton,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import useGetDirection from "src/hooks/use-get-direction";
import CloseIcon from "@mui/icons-material/Close";

type propsType = {
  open: boolean;
  setOpen: Function;
  title?: string | React.ReactNode;
  children: React.ReactNode;
};
const SimpleDialog = ({
  setOpen,
  title,
  children,
  ...props
}: propsType & DialogProps) => {
  const dir = useGetDirection();
  return (
    <Dialog
      dir={dir}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    >
      {title && (
        <DialogTitle fontSize={19}>
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              color="primary.main"
            >
              {title}
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </>
        </DialogTitle>
      )}
      {children}
    </Dialog>
  );
};

export default SimpleDialog;
