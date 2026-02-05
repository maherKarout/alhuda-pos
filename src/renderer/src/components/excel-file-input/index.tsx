import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
} from "@mui/material";
import excelIcon from "src/assets/images/excelIcon.png";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
type propsType = { file: File | null; setFile: Function; progress: number };
function ExcelFileInput({ file, setFile, progress }: propsType) {
  const { t } = useTranslation("translation");
  return (
    <Box
      sx={{
        border: "1px dashed grey",
        px: { xs: 1, md: 4 },
        py: { xs: 1, md: 7 },
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#F3F4F4",
      }}
    >
      {!file && (
        <input
          onChange={(e) => {
            if (e?.target?.files) {
              const file = e.target.files[0];
              const fileName = file.name;
              const fileExtension =
                fileName?.split(".")?.pop()?.toLowerCase() ?? "";
              const extensions = ["xlsx", "xls"];
              if (!extensions.includes(fileExtension)) {
                setFile(null);
              } else setFile(e?.target?.files[0]);
            }
          }}
          type="file"
          accept=".xls, .xlsx"
          style={{
            opacity: "0",
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 2,
            cursor: "pointer",
          }}
        />
      )}
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <img src={excelIcon} alt="" />
        <Box>
          <Typography variant="body1" fontWeight="600">
            {t("choose file")}
          </Typography>
          <Typography
            variant="body2"
            color="grey"
            fontWeight="500"
          ></Typography>
          {!file ? (
            <Button
              variant="outlined"
              sx={{ mt: 1, position: "relative", zIndex: 1 }}
            >
              select file
            </Button>
          ) : (
            <Box
              sx={{
                width: "100%",
                maxWidth: "370px",
                px: 2,
                py: 1,
                borderRadius: "8px",
                backgroundColor: "white",
                minWidth: "300px",
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {progress !== 0 ? (
                <Box sx={{ margin: "10px 10px 10px 0 " }}>{`${progress}%`}</Box>
              ) : (
                <IconButton onClick={() => setFile(null)}>
                  <CloseIcon />
                </IconButton>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexGrow: 1,
                  }}
                >
                  {(file?.size / (1024 * 1024)).toFixed(2)}
                  {"MB "}
                  <Typography>{file?.name}</Typography>
                </Box>
                <LinearProgress
                  color="success"
                  sx={{ mt: 1 }}
                  variant="determinate"
                  value={progress}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ExcelFileInput;
