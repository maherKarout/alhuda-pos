import React from 'react'
import MainCard from 'src/components/cards/Main-card'
import { Grid } from '@mui/material'
import { Formik, FormikHelpers } from 'formik'
import OutlinedPasswordInput from 'src/components/formik-input/outlined-password-input'
import GenericButton from 'src/components/generic-button'
import { useUpdatePasswordMutation } from 'src/app/change-password/services/api'
import { useLogout } from '@renderer/hooks/use-logo-out'
import { showSuccessToasts } from 'src/components/toasts'
import { useTranslation } from 'react-i18next'
import { Yup } from 'src/validation'
function ChangeMyPassword() {
  const { t } = useTranslation('translation')

  const [updatePassword, {}] = useUpdatePasswordMutation()
  const handleLogout = useLogout()
  const initialValues = {
    oldPassword: '',
    newPassword: ''
  }
  const onSubmit = (
    values: {
      oldPassword: string
      newPassword: string
    },
    {
      setSubmitting
    }: FormikHelpers<{
      oldPassword: string
      newPassword: string
    }>
  ) => {
    updatePassword(values)
      .unwrap()
      .then((res) => {
        showSuccessToasts('password_changed_successFully')
        handleLogout()
      })
      .catch((err) => {
        setSubmitting(false)
      })
  }
  const validationSchema = Yup.object({
    oldPassword: Yup.password(),
    newPassword: Yup.password()
  })
  return (
    <MainCard title={t('changeMyPassword')}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <OutlinedPasswordInput name="oldPassword" label="oldPassword" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <OutlinedPasswordInput name="newPassword" label="newPassword" />
              </Grid>
              <Grid component="div" size={{ xs: 12 }} container>
                <Grid component="div" size={{ xs: 6, md: 3 }}>
                  <GenericButton loading={isSubmitting} title="submit" type="submit" />
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  )
}

export default ChangeMyPassword
