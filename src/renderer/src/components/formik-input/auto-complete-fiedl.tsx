import { useTheme } from "@emotion/react";
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    OutlinedInputProps,
    Autocomplete,
} from "@mui/material";
import { useField } from "formik";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type AutoCompleteOption = { label: string; value: string };

type propsType = Omit<OutlinedInputProps, "onChange"> & {
    name: string;
    type?: string;
    label: React.ReactNode;
    multiple?: boolean;
    optionsAutoComplete: AutoCompleteOption[];
    freeSolo?: boolean;
    onChange?: (newValue: AutoCompleteOption | string | null) => void;
};

export type OutlinedTextInputProps = propsType;

const AutoCompleteField = ({ name, type, label, optionsAutoComplete, multiple = false, ...props }: OutlinedTextInputProps) => {
    const [field, meta, helpers] = useField(name);
    const theme: any = useTheme();
    const { t } = useTranslation("translation");
    const inputRef = useRef<any>(null);

    // Find the selected option based on field value
    const selectedOption = optionsAutoComplete?.find((option) => option.value === field.value) || field.value;

    return (
        <FormControl
            fullWidth
            error={Boolean(meta.touched && meta.error)}
            sx={{ ...theme.typography.customInput, marginY: 0, pl: 0 }}
            disabled={props?.disabled ?? false}
        >
            <Autocomplete
                multiple={multiple}
                disablePortal
                freeSolo={props?.freeSolo ?? false}
                options={optionsAutoComplete || []}
                value={selectedOption}
                disabled={props?.disabled ?? false}
                getOptionLabel={(option: any) => option.label || ""}
                // inputValue={props?.freeSolo ? field.value : selectedOption?.label || ""}
                onChange={(event, newValue: any) => {
                    const valueToSet = newValue?.value || newValue || "";
                    helpers.setValue(valueToSet);
                    props?.onChange?.(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    if (props?.freeSolo) {
                        helpers.setValue(newInputValue);
                    }
                }}
                onBlur={() => {
                    helpers.setTouched(true);
                }}
                isOptionEqualToValue={(option, value) => {
                    if (typeof option === "string" && typeof value === "string") return option === value;
                    if (typeof option === "object" && typeof value === "object") return option.value === value.value;
                    return false;
                }}
                renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                        <InputLabel htmlFor={field.name} sx={{ zIndex: 1000 }}>{t(label as string)}</InputLabel>

                        <OutlinedInput
                            label={t(label as string)}
                            onClick={() => { }}
                            inputRef={inputRef}
                            {...params}
                            onBlur={() => {
                                helpers.setTouched(true);
                            }}
                            value={params.inputProps.value}
                            sx={{
                                width: "100%",
                                transition: " all 0.4s ",
                                px: "2px !important",
                                height: "62px",
                                paddingTop: "28px !important",
                            }}
                        />
                    </div>
                )}
                sx={{ width: "100%", p: 0 }}
            />
            {/* Show error message below autocomplete if needed */}
            {/* {meta.touched && meta.error && (
        <FormHelperText error id={field.name}>
          {t(meta.error)}
        </FormHelperText>
      )} */}
        </FormControl>
    );
};

export default AutoCompleteField;
