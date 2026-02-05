import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { forwardRef } from "react";
import { Button } from "@mui/material";
import { exportComponentAsPNG } from "react-component-export-image";
import { useTranslation } from "react-i18next";

const QrCodeImage = forwardRef(
  ({
    value,
    style,
  }: {
    value: any;
    style?: React.CSSProperties | undefined;
  }) => {
    const { t } = useTranslation("translation");
    const qrRef = useRef(null);
    return (
      <div style={style}>
        <div
          ref={qrRef}
          style={{ width: " 178px", margin: "auto", padding: "8px" }}
        >
          <QRCode style={{ width: "100%", height: "100%" }} value={value} />
        </div>
        <Button
          fullWidth
          onClick={() => {
            exportComponentAsPNG(qrRef as any);
          }}
        >
          {t("download")}
        </Button>
      </div>
    );
  }
);

export default QrCodeImage;
