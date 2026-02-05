import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectProps } from "@mui/material/Select";
import { useField } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "react-i18next";

type propsType = {
  name: string;
  label: React.ReactNode;
  options?: { key: string; value: any }[];
};
export type SelectInputProps<T> = propsType & SelectProps<T>;

function SelectInput<T>({
  name,
  label,
  options,
  ...props
}: SelectInputProps<T>) {
  const { t } = useTranslation("translation");
  const theme: any = useTheme();
  const [field, meta] = useField(name);
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);

  return (
    <FormControl
      key={name}
      error={isError}
      sx={{ ...theme.typography.customInput, minHeight: "70px" }}
      fullWidth
    >
      <InputLabel id="demo-simple-select-label">
        {t(label as string)}
      </InputLabel>
      <Select
        label={t(label as string)}
        inputProps={{ sx: { ...theme.typography.customInput } }}
        labelId="demo-simple-select-label"
        {...props}
        {...field}
        
      >
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      </Select>
      {isError && <FormHelperText>{t(meta.error ?? "")}</FormHelperText>}
    </FormControl>
  );
}

export default SelectInput;
