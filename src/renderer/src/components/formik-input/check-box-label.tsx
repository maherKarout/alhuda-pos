import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
type propsType = {
  name: string;
  label: string;
};
export type CheckBoxLabelType = propsType & CheckboxProps;
const CheckBoxLabel = ({ name, label, ...props }: CheckBoxLabelType) => {
  const [field, meta] = useField(name);
  const { t } = useTranslation("translation");

  const { setFieldValue } = useFormikContext();
  const isError: boolean = Boolean(meta.error) && Boolean(meta.touched);

  return (
    <FormControl key={name} error={isError}>
      <FormControlLabel
        control={
          <Checkbox
            checked={field.value ?? false}
            onChange={(e) => {
              setFieldValue(field.name, e.target.checked);
            }}
            {...props}
          />
        }
        label={t(label)}
      />
    </FormControl>
  );
};

export default CheckBoxLabel;
