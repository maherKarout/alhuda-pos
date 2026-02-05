import { FormikHelpers } from 'formik'
// 
import {
  BaseQueryFn,
  MutationActionCreatorResult,
  MutationDefinition,
  QueryDefinition
} from '@reduxjs/toolkit/dist/query'

import { CheckboxProps, OutlinedInputProps, RadioGroupProps, SelectProps } from '@mui/material'
import { DatePickerProps, DateTimePickerProps, TimePickerProps } from '@mui/x-date-pickers'
import { Moment } from 'moment'
import { InputFieldProps } from 'src/components/formik-input/file-input'
import { OutlinedTextInputProps } from 'src/components/formik-input/outlined-text-input'
import { privilegeKeys } from 'src/shared/privileges'
// @ts-ignore
import { TypedUseMutation, TypedUseQuery } from '@reduxjs/toolkit/dist/query/react'
export type submitType = 'saveAndAddNew' | 'saveAndGoBack'
export type FormikOnSubmitType<T> = (
  values: T,
  formikHelpers: FormikHelpers<T>,
  submitType?: submitType
) => any

export type languagesObject = {
  en: string
  ar: string
}

export type ArgsType = {
  page: number
  total: boolean
  searchValue?: string
  limit: number
  needPagination?: boolean
  isPayed?: boolean
  startDate?: string
  endDate?: string
  search?: string
  sort?: string
  id?: string
  key?: string
  forgetPassword?: boolean
  statusId?: string
  from?: string
  to?: string
  outOfStock?: boolean
  type?: string
  level?: number
  section?: string
  category?: string
  company?: string
  subcategory?: string
  allPos?: boolean
  status?: string
}
export type ArgsSpecial = {
  from: string
  to: string
}

export type mutationType<V> = TypedUseMutation<V, any, any>
export type mutationFn<T extends string> = (arg: any) => MutationActionCreatorResult<
  MutationDefinition<
    any,
    BaseQueryFn<
      {
        url: string
        method?: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH' | undefined
        data?: any
        params?: any
      },
      unknown,
      unknown
    >,
    T,
    any,
    string
  >
>
export type queryType<T> = TypedUseQuery<T, ArgsType, any>

export enum inputType {
  text = 'text',
  password = 'password',
  checkBox = 'checkBox',
  checkbox = 'checkBox', // alias for checkBox
  date = 'date',
  dateTime = 'dateTime',
  radio = 'radio',
  select = 'select',
  time = 'time',
  multiSelect = 'multiSelect',
  custom = 'custom',
  image = 'image',
  imageEditor = 'imageEditor',
  fileEditor = 'fileEditor'
}
type dynamicPropsType = {
  inputType: inputType
  name: string
  label: string
  isFullPage?: boolean
  placeholder?: String
  accept?: string
  disabled?: boolean
  options?: { value: string; key: string }[]
  isRow?: boolean
  type?: string
  renderComponent?: React.ReactNode
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export type dynamicFormType = dynamicPropsType &
  (
    | CheckboxProps
    | DatePickerProps<boolean>
    | DateTimePickerProps<boolean>
    | RadioGroupProps
    | SelectProps<string[]>
    | OutlinedInputProps
    | SelectProps<string>
    | TimePickerProps<boolean>
    | InputFieldProps
    | OutlinedTextInputProps
  )

export type DynamicFormTypeFields = dynamicFormType[]

export type menuItemType = {
  id: string
  title: string
  caption?: string
  type: 'group' | 'collapse' | 'item'
  url?: string
  icon?: any
  privileges?: privilegeKeys[]
  children?: menuItemType[]
}
