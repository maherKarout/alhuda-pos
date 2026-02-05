import { Divider, Grid, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import OutlinedPasswordInput from "src/components/formik-input/outlined-password-input";
import OutlinedTextInput from "src/components/formik-input/outlined-text-input";
import GenericButton from "src/components/generic-button";
import { Yup } from "src/validation";
import { useUpdatePasswordMutation } from "../services/api";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { resetAuthData } from "src/app/login/services/slice";
import { showSuccessToasts } from "src/components/toasts";

type initialValuesType = { password: string; newPassword: string };

const initialValues = {
  password: "",
  newPassword: "",
};
const ChangePasswordForm = () => {
  const { t } = useTranslation("translation");
  const [changePassword, {}] = useUpdatePasswordMutation();
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object({
    password: Yup.password(),
    newPassword: Yup.password(),
  });

  const onSubmit = (
    values: initialValuesType,
    helpers: FormikHelpers<initialValuesType>
  ) => {
    changePassword({
      oldPassword: values.password,
      newPassword: values.newPassword,
    })
      .unwrap()
      .then((res) => {
        showSuccessToasts("update successfully please login again");
        dispatch(resetAuthData());
      })
      .catch((err) => {});
  };

  return (
    <Grid
      sx={{ minWidth: "350px" }}
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <Grid component="div" size={{ xs: 12 }}>
        <Typography variant="h4">{t("changePasswordTitle")}</Typography>
      </Grid>
      <Grid component="div" size={{ xs: 12 }}></Grid>
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
                  <OutlinedPasswordInput
                    name="password"
                    label={"oldPassword"}
                    type="text"
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12 }}>
                  <OutlinedPasswordInput
                    name="newPassword"
                    label={"newPassword"}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12 }}>
                  <GenericButton
                    loading={isSubmitting}
                    title="submit"
                    type="submit"
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
      <Grid component="div" size={{ xs: 12 }}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default ChangePasswordForm;
