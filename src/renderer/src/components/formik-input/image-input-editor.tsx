import React, { useEffect, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";
import { IconButton, Slider, Stack } from "@mui/material";
import { Box, FormHelperText, DialogContent, DialogActions, SxProps, Theme } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import SimpleDialog from "../dialog";
import GenericButton from "../generic-button";

type InputFieldProps = {
  label: React.ReactNode;
  name: string;
  placeholder?: String;
  accept?: string;
  disabled?: boolean;
  height?: number;
  width?: number;
  borderRadius?: number;
  sx?: SxProps<Theme>;
};

const CustomStyleInput = styled("input")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  right: 0,
  opacity: 0,
});
const FileEditorInput = (props: InputFieldProps) => {
  const theme: any = useTheme();
  const [field, meta] = useField(props.name);

  const { t } = useTranslation("translation");
  const { setFieldValue, values } = useFormikContext();
  const [zoom, setZom] = useState(0);

  const [file, setFile] = useState<File | null>(null);

  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);
  const inputRef = useRef<HTMLElement | null>(null);
  const avatarRef = useRef<any>(null);
  const onDragStart = () => {
    inputRef.current?.classList.add("activeDrag");
  };
  const onDragLeave = () => {
    inputRef.current?.classList.remove("activeDrag");
  };

  return (
    <Box
      key={props.name + `${file}`}
      sx={{
        position: "relative",
        top: field.value ? "-20px" : "-8px",
        ...props.sx,
      }}
    >
      {field.value && (
        <Typography variant="h5" fontSize="1.2em" sx={{ margin: "0 10px" }}>
          {t(`${props.label}`)}
          <FormHelperText component="span">{t(`${props.placeholder}`)}</FormHelperText>
        </Typography>
      )}
      <Box
        ref={inputRef}
        sx={{
          borderRadius: "8px",
          backgroundColor: (theme) => theme.palette.background.default,
          opacity: "0.9",
          border: `2px dashed ${isError ? theme.palette.error?.main : theme.palette.grey[500]}`,
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
              src={typeof file === "object" && file ? URL.createObjectURL(file as File) : field.value}
              alt=""
            />
            <CustomStyleInput
              type="file"
              accept="image/*"
              multiple={false}
              onChange={(e) => {
                setFile(e.target.files ? e.target.files[0] : null);
              }}
            />
            <IconButton
              onClick={() => {
                setFieldValue(field.name, "");
                setFile(null);
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
                {t(`${props.label}`)} <FormHelperText component="span">{t(`${props.placeholder}`)}</FormHelperText>
              </Typography>
              <CloudUploadIcon sx={{ color: isError ? "error.main" : "" }} />
            </Stack>
            <CustomStyleInput
              type="file"
              accept="image/*"
              multiple={false}
              onChange={(e) => {
                setFile(e.target.files ? e.target.files[0] : null);
              }}
            />
          </>
        )}
      </Box>
      <SimpleDialog
        title={`${t("edit image")}`}
        open={Boolean(file)}
        setOpen={() => {
          setFile(null);
          setFieldValue(field.name, "");
        }}
        PaperProps={{ sx: { width: "100%", maxWidth: "fit-content" } }}
      >
        <DialogContent sx={{ width: "100%" }}>
          {file && (
            <>
              {/* <AvatarEditor
                borderRadius={props.borderRadius}
                height={props.height}
                width={props.width}
                image={URL.createObjectURL(file as File)}
                ref={avatarRef}
                scale={zoom + 1}
              /> */}
              <Slider
                track={false}
                valueLabelDisplay="auto"
                value={zoom}
                min={0}
                max={10}
                step={0.1}
                onChange={(e, value) => {
                  setZom(value as number);
                }}
              ></Slider>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <GenericButton
            title="save"
            onClick={() => {
              setFile(null);
              setFieldValue(field.name, avatarRef.current.getImageScaledToCanvas().toDataURL());
            }}
          />
        </DialogActions>
      </SimpleDialog>
    </Box>
  );
};

export default FileEditorInput;
