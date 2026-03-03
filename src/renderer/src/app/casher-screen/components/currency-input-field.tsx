import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const NumericFormatCustom = React.forwardRef<HTMLInputElement, { onChange: (event: { target: { value: string } }) => void }>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value, 
            },
          });
        }}
        thousandSeparator=","
        decimalSeparator="."
        decimalScale={4} 
        allowNegative={false} 
      />
    );
  }
);

export interface CurrencyInputFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

const CurrencyInputField: React.FC<CurrencyInputFieldProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value === '' ? 0 : Number(event.target.value);
    onChange(numericValue);
  };

  return (
    <TextField
      {...rest}
      value={value === 0 ? '' : value.toString()}
      onChange={handleChange}
      slotProps={{
        input: {
          inputComponent: NumericFormatCustom as any,
        },
      }}
    />
  );
};

export default CurrencyInputField;