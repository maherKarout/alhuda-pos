import { FormikHelpers } from 'formik'
import { navigateTo } from 'src/components/navigation-component'
import { showSuccessToasts } from 'src/components/toasts'
import { mutationFn, submitType } from 'src/types'
type PropsType<T extends string, V> = {
  fn: mutationFn<T>
  helpers: FormikHelpers<any>
  isNew?: boolean
  submitType?: submitType
  dataToSend: V
  customFeedback?: (res: any) => void
  onSuccess?: () => void
  disableNavigate?: boolean
}
export async function promiseWrapper<T extends string, V>({
  fn,
  dataToSend,
  helpers,
  isNew,
  submitType,
  customFeedback,
  onSuccess,
  disableNavigate=false
}: PropsType<T, V>) {
  return fn(dataToSend)
    .unwrap()
    .then((res) => {
      if (customFeedback) customFeedback?.(res)
      else {
        if (submitType === 'saveAndAddNew') {
          helpers.resetForm()
        } else {
          if (!disableNavigate) navigateTo(-1)  
          onSuccess?.()
        }
      }

      showSuccessToasts(isNew ? 'added successfully' : 'updated_successfully')
    })
    .catch(() => {
      helpers.setSubmitting(false)
    })
}
