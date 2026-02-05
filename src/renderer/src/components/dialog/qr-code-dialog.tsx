import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import SimpleDialog from ".";
import QrCodeImage from "../qr-code-image";
function QrcodeDialog({ value }: { value: string }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("show")}</Button>
      <SimpleDialog open={open} setOpen={setOpen}>
        <QrCodeImage value={value} style={{ padding: "8px" }} />
      </SimpleDialog>
    </>
  );
}

export default QrcodeDialog;
