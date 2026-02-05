import { FormControl, FormControlLabel, FormLabel, Radio } from '@mui/material'
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup'
import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
type propsType = {
  name: string
  label: React.ReactNode
  options?: { value: string; key: string }[]
  isRow?: boolean
}
export type FormRadioGroupTypes = propsType & RadioGroupProps
const FormRadioGroup = ({ options, label, name, isRow = false, ...props }: FormRadioGroupTypes) => {
  const [field, meta] = useField(name)
  const { t } = useTranslation('translation')
  return (
    <FormControl key={name}>
      <FormLabel id="demo-radio-buttons-group-label">{t(label as string)}</FormLabel>
      <RadioGroup row={isRow} {...field} {...props}>
        {options?.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio />}
            label={t(option.key as string)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default FormRadioGroup
