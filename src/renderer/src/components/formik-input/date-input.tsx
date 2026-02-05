import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useField, useFormikContext } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTheme } from "@emotion/react";
import { FormHelperText, Box, InputAdornment } from "@mui/material";
import moment, { Moment } from "moment";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useTranslation } from "react-i18next";
type propsProp = {
  name: string;
  label: React.ReactNode;
  isFullPage?: boolean;
};
export type DateInputType = propsProp & DatePickerProps;
const DateInput = ({ name, label, isFullPage = true, ...props }: DateInputType) => {
  const theme: any = useTheme();
  const { t } = useTranslation("translation");
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  return (
    <LocalizationProvider key={name} dateAdapter={AdapterMoment}>
      {isFullPage ? (
        <MobileDatePicker
          label={t(label as string)}
          sx={{
            ...theme.typography.customInput,
            width: "100%",
          }}
          value={field.value ? moment(field.value) : null}
          onChange={(newValue) => {
            setFieldValue(field.name, moment(newValue).format("YYYY-MM-DD"));
          }}
          slotProps={{
            textField: {
              error: meta.touched && meta.error ? true : undefined,
              helperText: meta.touched && meta.error ? t(meta.error) : "",
              InputProps: {
                endAdornment: <CalendarMonthIcon sx={{ color: "grey" }} />,
              },
            },
          }}
          {...props}
        />
      ) : (
        <DatePicker
          slots={{
            textField: (params) => <TextField {...params} disabled />,
          }}
          label={label}
          sx={{ ...theme.typography.customInput, width: "100%" }}
          value={field.value ? moment(field.value) : undefined}
          onChange={(newValue) => {
            setFieldValue(field.name, moment(newValue).format());
          }}
          {...props}
        />
      )}
    </LocalizationProvider>
  );
};

export default DateInput;
