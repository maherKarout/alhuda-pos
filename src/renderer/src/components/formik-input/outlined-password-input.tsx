import { useField } from "formik";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  Box,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
type propsType = {
  name: string;
  label: React.ReactNode;
};
export type OutlinedPasswordInputProps = propsType & OutlinedInputProps;
const OutlinedPasswordInput = ({
  name,
  label,
  ...props
}: OutlinedPasswordInputProps) => {
  const [field, meta] = useField(name);
  const theme: any = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("translation");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl
      key={name}
      fullWidth
      error={Boolean(meta.touched && meta.error)}
      sx={{ ...theme.typography.customInput }}
    >
      <InputLabel htmlFor={field.name}>{t(label as string)}</InputLabel>
      <OutlinedInput
        label={t(label as string)}
        id={field.name}
        type={showPassword ? "text" : "password"}
        {...field}
        error={meta.touched && meta.error ? true : undefined}
        {...props}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      <Box sx={{ height: "5px" }}>
        {meta.touched && meta.error && (
          <FormHelperText error id={field.name}>
            {t(meta.error)}
          </FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};

export default OutlinedPasswordInput;
