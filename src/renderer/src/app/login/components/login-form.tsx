import { Divider, Grid, Typography } from '@mui/material'
import { Formik, FormikHelpers } from 'formik'
import { useTranslation } from 'react-i18next'
import OutlinedPasswordInput from 'src/components/formik-input/outlined-password-input'
import OutlinedTextInput from 'src/components/formik-input/outlined-text-input'
import GenericButton from 'src/components/generic-button'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../services/api'
import { Yup } from 'src/validation'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import { setLoginData } from '../services/slice'
import { isManagementBranch } from '@renderer/helpers/is-management-branch'
type initialValuesType = { username: string; password: string }

const initialValues = {
  username: '',
  password: ''
}
const LoginForm = () => {
  const { t } = useTranslation('translation')
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    username: Yup.username(4)
    // password: Yup.password(), //TODO
  })

  const onSubmit = (values: initialValuesType, helpers: FormikHelpers<initialValuesType>) => {
    login(values)
      .unwrap()
      .then((data) => {
        dispatch(setLoginData(data))
      })
      .catch((error) => {
        helpers.setSubmitting(false)
      })
  }

  return (
    <Grid
      sx={{ minWidth: '350px', width: '100%' }}
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <Grid component="div" size={{ xs: 12 }} sx={{ margin: '0px 20px' }}>
        <Typography variant="h2">{t('welcome')}</Typography>
      </Grid>
      <Grid component="div" size={{ xs: 12 }}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ values, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid component="div" size={{ xs: 12 }}>
                  <OutlinedTextInput name="username" label={'username'} type="text" />
                </Grid>
                <Grid component="div" size={{ xs: 12 }}>
                  <OutlinedPasswordInput name="password" label={'password'} />
                </Grid>
                <Grid component="div" size={{ xs: 12 }}>
                  <GenericButton loading={isSubmitting} title="submit" type="submit" />
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
      <Grid component="div" size={{ xs: 12 }}>
        <Typography
          variant="body1"
          color="grey"
          sx={{ textDecoration: 'underline', textAlign: 'center' }}
        >
          {t('developed_by_darsoft')}
        </Typography>
      </Grid>
      {!isManagementBranch() && <Grid component="div" size={{ xs: 12 }} sx={{ mt: 2, textAlign: 'center' }}>
        <GenericButton
          type="button"
          title={t('go_to_casher_login')}
          onClick={() => navigate('/casher-login')}
          variant="text"
        />
      </Grid>}
    </Grid>
  )
}

export default LoginForm
