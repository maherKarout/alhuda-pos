import React, { useRef, useState } from "react";
import { useField, useFormikContext } from "formik";
import { IconButton, Stack } from "@mui/material";
import { Box, FormHelperText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
export type InputFieldProps = {
  label: React.ReactNode;
  name: string;
  placeholder?: String;
  accept?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
};

const CustomStyleInput = styled("input")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  right: 0,
  opacity: 0,
});
const FileInput = (props: InputFieldProps) => {
  const theme: any = useTheme();
  const [field, meta] = useField(props.name);
  const { t } = useTranslation("translation");
  const { setFieldValue } = useFormikContext();
  const [file, setFile] = useState<File | null>(null);
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);
  const [isOnIt, setIsOnIt] = useState<boolean>(false);
  const inputRef = useRef<HTMLElement | null>(null);
  const onDragStart = () => {
    inputRef.current?.classList.add("activeDrag");
    setIsOnIt(true);
  };
  const onDragLeave = () => {
    inputRef.current?.classList.remove("activeDrag");
    setIsOnIt(false);
  };
  return (
    <Box
      key={props.name}
      sx={{ position: "relative", top: field.value ? "-20px" : "-8px" }}
    >
      {field.value && (
        <Typography variant="h5" fontSize="1.2em" sx={{ margin: "0 10px" }}>
          {t(`${props.label}`)}
          <FormHelperText component="span">
            {t(`${props.placeholder}`)}
          </FormHelperText>
        </Typography>
      )}
      <Box
        ref={inputRef}
        sx={{
          borderRadius: "8px",
          backgroundColor: "white",
          opacity: "0.9",
          border: `2px dashed ${
            isError ? theme.palette.error?.main : theme.palette.primary.main
          }`,
          position: "relative",
          height: "60%",
          minHeight: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          transition: " all 1s",
          "&.activeDrag": { opacity: "0.5", borderStyle: "dotted" },
          cursor: "pointer",
          p: 2,
          mt: 1,
        }}
        onDragEnter={onDragStart}
        onDragLeave={onDragLeave}
        onDrop={onDragLeave}
      >
        {field.value && field.value !== "" ? (
          <Box sx={{ height: "100%", textAlign: "center" }}>
            <img
              style={{
                width: "60%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px ",
                maxHeight: "500px",
              }}
              src={
                typeof field.value === "object"
                  ? URL.createObjectURL(field.value)
                  : field.value
              }
              alt=""
            />
            <IconButton
              onClick={() => {
                setFieldValue(field.name, "");
              }}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(200,200,200,0.4)",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <Stack direction="row" gap="10px" alignItems="center">
              <Typography variant="h5" fontSize="1.2em">
                {t(`${props.label}`)}{" "}
                <FormHelperText component="span">
                  {t(`${props.placeholder}`)}
                </FormHelperText>
              </Typography>
              <CloudUploadIcon sx={{ color: isError ? "error.main" : "" }} />
            </Stack>

            <CustomStyleInput
              type="file"
              accept="image/*"
              multiple={false}
              onChange={(e) => {
                setFieldValue(
                  field.name,
                  e.target.files ? e.target.files[0] : null
                );
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default FileInput;
