import { CheckboxProps, TextFieldProps, RadioGroupProps, SelectProps, OutlinedInputProps } from "@mui/material";
import { DatePickerProps, DateTimePickerProps, TimePickerProps } from "@mui/x-date-pickers";
import { Moment } from "moment";
import CheckBoxLabel from "./check-box-label";
import DateInput from "./date-input";
import DateTimeInput from "./date-time-input";
import MultiChipSelect from "./multi-chip-select";
import OutlinedPasswordInput from "./outlined-password-input";
import FormRadioGroup from "./Form-radio-group";
import OutlinedTextInput from "./outlined-text-input";
import SelectInput from "./select-input";
import TimeInput, { TimeInputProps } from "./time-input";
import FileInput from "./file-input";
import { dynamicFormType, inputType } from "src/types";
import { InputFieldProps } from "./file-input";
import FileEditorInput from "./image-input-editor";

function DynamicInput({ name, label, inputType: type, ...props }: dynamicFormType) {
  let Component: React.ReactNode;

  switch (type) {
    case inputType.checkBox: {
      const checkboxProps = props as CheckboxProps;
      Component = <CheckBoxLabel name={name} label={label} {...checkboxProps} />;
      break;
    }
    case inputType.date: {
      const dateProps = props as DatePickerProps;
      Component = <DateInput label={(label ?? "") as React.ReactNode} name={name} {...dateProps} />;
      break;
    }
    case inputType.dateTime: {
      const dateTimeProps = props as DateTimePickerProps;
      Component = <DateTimeInput label={(label ?? "") as React.ReactNode} name={name} {...dateTimeProps} />;
      break;
    }
    case inputType.multiSelect: {
      const multiSelectProps = props as SelectProps<string[]>;
      Component = <MultiChipSelect label={(label ?? "") as React.ReactNode} name={name} {...multiSelectProps} />;
      break;
    }
    case inputType.password: {
      const passwordProps = props as OutlinedInputProps;
      Component = <OutlinedPasswordInput label={(label ?? "") as React.ReactNode} name={name} {...passwordProps} />;
      break;
    }
    case inputType.radio: {
      const radioProps = props as RadioGroupProps;
      Component = <FormRadioGroup label={(label ?? "") as React.ReactNode} name={name} {...radioProps} />;
      break;
    }
    case inputType.select: {
      const selectProps = props as SelectProps<string>;
      Component = <SelectInput label={(label ?? "") as React.ReactNode} name={name} {...selectProps} />;

      break;
    }
    case inputType.text: {
      const textProps = props as TextFieldProps;
      Component = <OutlinedTextInput label={(label ?? "") as React.ReactNode} name={name} {...textProps} />;
      break;
    }
    case inputType.time: {
      const timeProps = props as TimeInputProps;
      Component = <TimeInput {...timeProps} />;
      break;
    }
    case inputType.image: {
      const imageProps = props as Omit<Omit<InputFieldProps, "name">, "label">;
      Component = <FileInput label={(label ?? "") as React.ReactNode} name={name} {...imageProps} />;
      break;
    }
    case inputType.imageEditor: {
      const imageProps = props as Omit<Omit<InputFieldProps, "name">, "label">;
      Component = <FileEditorInput label={(label ?? "") as React.ReactNode} name={name} {...imageProps} />;
      break;
    }
    default: {
      const textProps = props as TextFieldProps;
      Component = <OutlinedTextInput label={(label ?? "") as React.ReactNode} name={name} {...textProps} />;
      break;
    }
  }

  return Component;
}

export default DynamicInput;
