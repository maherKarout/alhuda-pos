import React, { useState } from "react";
import SimpleDialog from ".";
import { Box, Button, Stack, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { downloadFile } from "src/helpers/download-file-from-url";

function ImagePreviewDialog({
  url,
  activeDownload,
  formIdForPrint,
  printImage,
}: {
  url: string;
  activeDownload?: boolean;
  formIdForPrint?: string;
  printImage?: () => void;
}) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>{t("show")}</Button> */}
      <Button onClick={() => setOpen(true)}>
        <Avatar src={url} />
      </Button>
      <SimpleDialog
        title={t("imagePreview") ?? ""}
        open={open}
        setOpen={setOpen}
      >
        <Stack p={2} direction="column" justifyContent="center" gap={2}>
          <Box
            sx={{ minWidth: "300px", maxWidth: { xs: "320px", md: "500px" } }}
          >
            <img src={url} style={{ width: "100%" }} />
          </Box>
          {activeDownload ? (
            <Stack direction="row" justifyContent="center" gap={3}>
              <Button
                onClick={() => {
                  if (printImage) printImage();
                  setOpen(false);
                }}
                fullWidth
                variant="contained"
              >
                {t(printImage ? "print" : "close")}
              </Button>
              {url && (
                <Button
                  onClick={() => downloadFile({ imageUrl: url })}
                  fullWidth
                  variant="outlined"
                >
                  {t("download")}
                </Button>
              )}
            </Stack>
          ) : (
            <Button
              onClick={() => setOpen(false)}
              fullWidth
              variant="contained"
            >
              {t("close")}
            </Button>
          )}
        </Stack>
      </SimpleDialog>
      <div className={formIdForPrint === url ? "printableForm" : "d-none"}>
        <img src={url} style={{ width: "100%" }} />
      </div>
    </>
  );
}

export default ImagePreviewDialog;
