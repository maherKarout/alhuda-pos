import React, { useState } from "react";
import SimpleDialog from ".";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetDirection from "src/hooks/use-get-direction";
import useGetIsRtlDirection from "src/hooks/use-get-is-rtl-direction";
function BigTextPreview({ text }: { text: string }) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);
  const isRtl = useGetIsRtlDirection();
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("show")}</Button>
      <SimpleDialog
        title={t("textPreview") ?? ""}
        open={open}
        setOpen={setOpen}
      >
        <Stack
          dir="ltr"
          p={2}
          direction="column"
          justifyContent="center"
          gap={2}
        >
          <Box
            sx={{
              minWidth: "300px",
              maxWidth: "320px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
              width: "100%",
            }}
          >
            <Typography sx={{ width: "100%" }}>{t(text)}</Typography>
          </Box>

          <Button onClick={() => setOpen(false)} variant="contained">
            {t("close")}
          </Button>
        </Stack>
      </SimpleDialog>
    </>
  );
}

export default BigTextPreview;
