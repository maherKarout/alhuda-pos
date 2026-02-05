// import { dynamicFormType, inputType } from "src/components/formik-input";
import { dynamicFormType, FormikOnSubmitType, inputType } from 'src/types'
import { FormikHelpers } from 'formik'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { Divider, Grid, Typography } from '@mui/material'
import { uploadFileToServer, uploadKeys } from 'src/helpers/upload-file-to-server'
import { useAddTeamMutation } from '../services/api'
import { showSuccessToasts } from 'src/components/toasts'

const StyledTitle = ({ title }: { title: string }) => {
  const { t } = useTranslation('translation')

  return (
    <Grid size={12}>
      <Typography variant="h3" color="primary">
        {t(title)}
      </Typography>
    </Grid>
  )
}

function AddTeams() {
  const { t } = useTranslation('translation')
  const [addTeam] = useAddTeamMutation()
  const fields: dynamicFormType[] = [
    {
      inputType: inputType.custom,
      label: '',
      name: '',
      renderComponent: <StyledTitle title="team information" />
    },
    { inputType: inputType.text, label: 'team name', name: 'title', md: 4 },
    {
      inputType: inputType.custom,
      label: '',
      name: '',
      renderComponent: (
        <Grid size={12}>
          <Divider />
        </Grid>
      )
    },
    {
      inputType: inputType.custom,
      label: '',
      name: '',
      renderComponent: <StyledTitle title="team admin information" />
    },
    {
      inputType: inputType.text,
      label: 'firstName',
      name: 'account.firstName',
      md: 4
    },
    {
      inputType: inputType.text,
      label: 'lastName',
      name: 'account.lastName',
      md: 4
    },
    {
      inputType: inputType.text,
      label: 'phoneNumber',
      name: 'account.phoneNumber',
      md: 4
    },
    {
      inputType: inputType.text,
      label: 'username',
      name: 'account.username',
      md: 4
    },
    {
      inputType: inputType.text,
      label: 'password',
      name: 'account.password',
      md: 4
    },

    {
      inputType: inputType.image,
      label: 'image',
      name: 'account.image',
      md: 4
    }
  ]

  const initialValue = {
    title: '',
    account: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      username: '',
      image: ''
    }
  }

  const validationSchema = Yup.object({
    title: Yup.text({ isRequired: true }),
    account: Yup.object({
      firstName: Yup.text({ isRequired: true }),
      lastName: Yup.text({ isRequired: true }),
      phoneNumber: Yup.phoneNumber(['9']),
      password: Yup.text({ isRequired: true }),
      username: Yup.text({ isRequired: true })
    })
  })

  const onSubmit = async (
    values: typeof initialValue,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValue>
  ) => {
    const imageId = await uploadFileToServer(values.account.image, uploadKeys.operator)
    const dataToSend = {
      ...values,
      account: { ...values.account, image: imageId }
    }
    addTeam(dataToSend)
      .unwrap()
      .then(() => {
        resetForm()
        showSuccessToasts('added successfully')
      })
      .catch(() => {
        setSubmitting(false)
      })
  }

  return (
    <GenerateForm
      title={t('add team')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      dirtyValuesOnly={false}
    />
  )
}

export default AddTeams
