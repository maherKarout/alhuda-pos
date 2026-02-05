import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectProps } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useField } from "formik";
import { FormHelperText } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import useGetDirection from "src/hooks/use-get-direction";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = (dir: "rtl" | "ltr") => ({
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      direction: dir,
    },
  },
});
type propsType = {
  name: string;
  label: React.ReactNode;
  options?: { key: string; value: any }[];
};
export type MultiChipSelectType = propsType & SelectProps<string[]>;

function MultiChipSelect({
  name,
  label,
  options,
  ...props
}: MultiChipSelectType) {
  const { t } = useTranslation("translation");
  const [field, meta] = useField(name);
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);
  const theme: any = useTheme();
  const dir = useGetDirection();

  return (
    <div key={name}>
      <FormControl
        sx={{ ...theme.typography.customInput }}
        error={isError}
        fullWidth
      >
        <InputLabel htmlFor={field.name}>{t(label as string)}</InputLabel>
        <Select
          fullWidth
          id={field.name}
          label={t(label as string)}
          multiple
          {...field}
          inputProps={{ sx: { ...theme.typography.customInput } }}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value: any, index: number) => {
                  return (
                    <Chip
                      key={index}
                      label={
                        options?.find(
                          (o) =>
                            JSON.stringify(o.value) === JSON.stringify(value) ||
                            ///just for roles
                            (o.value?.name === value?.name && o.value.name)
                        )?.key
                      }
                    />
                  );
                })}
              </Box>
            );
          }}
          MenuProps={MenuProps(dir)}
          {...props}
        >
          {options?.map((option) => (
            <MenuItem key={option.key} value={option.value}>
              {option.key}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ height: "5px" }}>
          {isError && (
            <FormHelperText sx={{ color: "error.main" }}>
              {t(meta.error ?? "")}
            </FormHelperText>
          )}
        </Box>
      </FormControl>
    </div>
  );
}

export default MultiChipSelect;
