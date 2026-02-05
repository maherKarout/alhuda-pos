import { useTheme } from '@emotion/react'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInputProps,
  Box,
  TextFieldProps
} from '@mui/material'
import TextField from '@mui/material/TextField'

import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
type propsType = {
  name: string
  type?: string
  label: React.ReactNode
}
export type OutlinedTextInputProps = propsType & TextFieldProps
const OutlinedTextInput = ({ name, type, label, ...props }: OutlinedTextInputProps) => {
  const [field, meta] = useField(name)
  const theme: any = useTheme()
  const { t } = useTranslation('translation')
  return (
    <FormControl
      key={name}
      fullWidth
      variant="outlined"
      sx={{ ...theme.typography.customInput, minHeight: '70px' }}
    >
      <TextField
        label={t(label as string)}
        autoComplete="off"
        type={type}
        error={Boolean(meta.touched && meta.error)}
        {...field}
        {...props}
        helperText={meta.touched && meta.error ? t(meta.error) : ''}
      />
    </FormControl>
  )
}

export default OutlinedTextInput
