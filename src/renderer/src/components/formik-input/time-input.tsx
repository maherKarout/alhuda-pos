import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useField, useFormikContext } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTheme } from "@emotion/react";
import { FormHelperText, Box } from "@mui/material";
import moment, { Moment } from "moment";
import { MobileTimePicker, MobileTimePickerProps } from "@mui/x-date-pickers/MobileTimePicker";
import { TimePicker, TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type BaseProps = {
  name: string;
  label: React.ReactNode;
};

type MobileTimeInputProps = BaseProps & {
  isFullPage: true;
} & Omit<MobileTimePickerProps, "name" | "label">;

type DesktopTimeInputProps = BaseProps & {
  isFullPage: false;
} & Omit<TimePickerProps, "name" | "label">;

export type TimeInputProps = MobileTimeInputProps | DesktopTimeInputProps;

const TimeInput = (props: TimeInputProps) => {
  const { name, label, isFullPage, ...restProps } = props;
  const theme: any = useTheme();
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <LocalizationProvider key={name} dateAdapter={AdapterMoment}>
      {isFullPage ? (
        <MobileTimePicker
          label={label}
          sx={{ ...theme.typography.customInput, width: "100%" }}
          value={field.value ? moment(field.value) : undefined}
          onChange={(newValue) => {
            setFieldValue(field.name, moment(newValue).format());
          }}
          slotProps={{
            textField: {
              InputProps: {
                endAdornment: <AccessTimeIcon sx={{ color: "grey" }} />,
              },
            },
          }}
          {...(restProps as MobileTimePickerProps)}
        />
      ) : (
        <TimePicker
          label={label}
          sx={{ ...theme.typography.customInput, width: "100%" }}
          value={field.value ? moment(field.value) : undefined}
          onChange={(newValue) => {
            setFieldValue(field.name, moment(newValue).format());
          }}
          {...(restProps as TimePickerProps)}
        />
      )}
      <Box sx={{ height: "5px" }}>
        {meta.touched && meta.error && (
          <FormHelperText sx={{ margin: "0 10px" }} error id={field.name}>
            {meta.error}
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default TimeInput;
