import { Formik, FormikHelpers, FormikValues } from 'formik'
import React, { memo, useRef, useState } from 'react'
import { DynamicFormTypeFields, FormikOnSubmitType, inputType, submitType } from 'src/types'
import MainCard from '../cards/Main-card'
import { Grid, SxProps } from '@mui/material'
import LanguagesTabWrapper from '../languages-tab-wrapper'
import DynamicInput from '../formik-input'
import GenericButton from '../generic-button'
import AreYouSureDialog from '../dialog/are-you-sure-dialog'
import { getDifferentValuesKeys } from 'src/helpers/get-different-values-keys'
import ErrorAlert from '../error/error-alert'
type PropsType<T> = {
  initialValues: T
  loading?: boolean
  isError?: boolean
  onSubmit: FormikOnSubmitType<T>
  isMultiLanguage?: boolean
  title?: string | null
  fields: DynamicFormTypeFields
  validationSchema?: {}
  hideCardContainer?: Boolean
  hideSubmitButton?: boolean
  submitButtonTitle?: string
  submitButtonSx?: SxProps
  dirtyValuesOnly?: boolean
  disableDirtyFlag?: boolean
  showCancelButton?: {
    title: string
    onClick: Function
    disabled?: boolean
    loading?: boolean
  }
  enableSuccessFeedback?: boolean
}
function GenerateForm<T = any>({
  initialValues,
  onSubmit,
  isMultiLanguage = false,
  title = '',
  fields,
  validationSchema,
  hideCardContainer = false,
  loading,
  isError,
  hideSubmitButton = false,
  submitButtonTitle = 'submit',
  submitButtonSx = {},
  dirtyValuesOnly = false,
  showCancelButton = undefined,
  disableDirtyFlag = false,
  enableSuccessFeedback = false
}: PropsType<T>) {
  const ref = useRef<any>(null)
  const [ln, setLn] = useState('ar')
  const [open, setOpen] = useState(false)
  const isValuesHasEnEmpty = (values: { [key: string]: any }) => {
    let result: boolean = false
    for (const [key, value] of Object.entries(values)) {
      result = typeof value === 'object' && values[key]['en'] === ''
      if (result) {
        break
      }
    }
    return result
  }

  const submitHandler: FormikOnSubmitType<FormikValues> = (values, helpers) => {
    const submitType = ref.current?.nativeEvent.submitter?.getAttribute('value') as submitType
    const dirtyValues = getDifferentValuesKeys(
      initialValues as FormikValues,
      values as FormikValues
    )
    if (dirtyValuesOnly) onSubmit(dirtyValues as T, helpers as FormikHelpers<T>)
    else return onSubmit(values as T, helpers as FormikHelpers<T>, submitType)
  }

  if (isError) return <ErrorAlert />

  return (
    <MainCard loading={loading} hide={hideCardContainer} title={title}>
      <Formik
        initialValues={initialValues as FormikValues}
        onSubmit={submitHandler}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting, dirty, handleSubmit, submitForm, values }) => {
          console.log('🚀 ~ GenerateForm ~ errors:', errors)
          console.log('🚀 ~ GenerateForm ~ values:', values)
          return (
            <form
              onSubmit={(e) => {
                ref.current = e
                if (isMultiLanguage && isValuesHasEnEmpty(values)) {
                  e.preventDefault()
                  setOpen(true)
                } else handleSubmit(e)
              }}
            >
              <Grid container spacing={2}>
                {isMultiLanguage && (
                  <Grid component="div" columns={{ xs: 12 }}>
                    <LanguagesTabWrapper errors={errors} ln={ln} setLn={setLn} touched={touched} />
                  </Grid>
                )}
                {fields.map((field, index) => {
                  const { name, renderComponent, xs, md, sm, lg, xl } = field
                  if (field.inputType === inputType.checkBox)
                    return (
                      <Grid key={index} component="div" columns={{ xs: 12 }}>
                        <DynamicInput {...field} name={name.replace('[multiLn]', ln)} />
                      </Grid>
                    )
                  else if (field.inputType === inputType.custom)
                    return (
                      <Grid
                        key={index}
                        component="div"
                        size={{ xs: xs ?? 12, sm: sm, md: md ?? 6, lg: lg, xl: lg }}
                      >
                        {renderComponent}
                      </Grid>
                    )
                  else
                    return (
                      <Grid
                        key={index}
                        component="div"
                        size={{ xs: xs ?? 12, sm: sm, md: md ?? 6, lg: lg, xl: lg }}
                      >
                        <DynamicInput {...field} name={name.replace('[multiLn]', ln)} />
                      </Grid>
                    )
                })}
                <Grid component="div" size={{ xs: 12 }}>
                  <>
                    {showCancelButton && (
                      <Grid component="div" size={{ xs: 4, md: 2 }}>
                        <GenericButton
                          variant="outlined"
                          onClick={showCancelButton.onClick}
                          title={showCancelButton.title}
                          loading={showCancelButton.loading}
                          disabled={showCancelButton.disabled}
                        />
                      </Grid>
                    )}
                    {!hideSubmitButton && (
                      <Grid component="div" size={{ xs: 4, md: 3 }}>
                        <GenericButton
                          type="submit"
                          title={submitButtonTitle}
                          loading={isSubmitting}
                          disabled={!dirty && !disableDirtyFlag}
                          enableSuccessFeedback={enableSuccessFeedback}
                          sx={submitButtonSx}
                        />
                      </Grid>
                    )}
                  </>
                </Grid>

                <AreYouSureDialog
                  isWarning
                  message="some content are missing are you sure"
                  open={open}
                  setOpen={setOpen}
                  confirmHandler={submitForm}
                />
              </Grid>
            </form>
          )
        }}
      </Formik>
    </MainCard>
  )
}

export default memo(GenerateForm) as <T>(props: PropsType<T>) => React.ReactElement
