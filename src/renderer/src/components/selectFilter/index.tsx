import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectProps } from "@mui/material/Select";

import { useTranslation } from "react-i18next";

type propsType = {
  label: React.ReactNode;
  options?: { key: string; value: any }[];
  viewAllOption?: boolean;
};
export type SelectInputProps<T> = propsType & SelectProps<T>;

function SelectFilter<T>({
  label,
  options,
  viewAllOption = true,
  ...props
}: SelectInputProps<T>) {
  const { t } = useTranslation("translation");
  const theme: any = useTheme();

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 120,
        m: 0,
        // "& .MuiSelect-select": { padding: "15px 16px 10px !important" },
      }}
    >
      <InputLabel id="demo-simple-select-label">
        {t(label as string)}
      </InputLabel>
      <Select
        label={t(label as string)}
        inputProps={{
          sx: {
            // ...theme.typography.customInput,
            // p: 2,
          },
        }}
        labelId="demo-simple-select-label"
        {...props}
      >
        {viewAllOption && <MenuItem value={"all"}>{t("all")}</MenuItem>}
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectFilter;
