import React, { useRef, useState } from "react";
import { Grid, Typography, Divider } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { FormikOnSubmitType, submitType } from "src/types";
import FileInput from "src/components/formik-input/image-input-editor";
import OutlinedTextInput from "src/components/formik-input/outlined-text-input";
import CheckBoxLabel from "src/components/formik-input/check-box-label";
import { Yup } from "src/validation";
import GenericButton from "src/components/generic-button";
import SelectInput from "src/components/formik-input/select-input";
import { useTranslation } from "react-i18next";
import BranchesSelector from "./branches-selector";
type propsType = {
  onSubmit: FormikOnSubmitType<any>;
  initialValues: any;
  roleOptions: { key: string; value: string }[];
  isEdit?: boolean;
};
function AccountForm({ onSubmit, initialValues, roleOptions, isEdit }: propsType) {
  const ref = useRef<any>(null);
  const { t } = useTranslation("translation");
  const validationSchema = Yup.object({}).shape({
    image: Yup.text({}),
    fullName: Yup.text({ isRequired: true }),
    password: isEdit ? Yup.text({}) : Yup.password(),
    username: Yup.username(4),
    role: Yup.text({ isRequired: true }),
    phoneNumber: Yup.phoneNumber(undefined, true),

  });
  return (
    <Formik
      onSubmit={(values: any, helpers: FormikHelpers<any>) => {
        (() => {
          const submitType = ref.current?.nativeEvent.submitter.getAttribute("value") as submitType;
          onSubmit(values, helpers, submitType);
        })();
      }}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {({ handleSubmit, isSubmitting, dirty, errors }) => {
        return (
          <form
            onSubmit={(e) => {
              ref.current = e;
              handleSubmit(e);
            }}
          >
            <Grid container spacing={2}>
              <Grid component="div" size={{ xs: 12 }}>
                <Typography variant="h4">{t("personal information")}</Typography>
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <OutlinedTextInput name="fullName" label="fullName" type="text" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <OutlinedTextInput name="phoneNumber" label="phoneNumber" type="text" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <FileInput
                  name="image"
                  label="image"
                  accept={"image/*"}
                  placeholder={" (200*200)"}
                  width={200}
                  height={200}
                />
              </Grid>
              <Grid component="div" size={{ xs: 12 }}>
                <Divider />
              </Grid>
              <Grid component="div" size={{ xs: 12 }}>
                <Typography variant="h4">{t("account information")}</Typography>
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <OutlinedTextInput name="username" label="userName" type="text" />
              </Grid>
              {!isEdit && (
                <Grid component="div" size={{ xs: 12, md: 4 }}>
                  <OutlinedTextInput name="password" label="password" type="text" />
                </Grid>
              )}
              <Grid component="div" size={{ xs: 12, md: 4 }}>
                <SelectInput options={roleOptions} name="role" label="role" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 12 }} alignSelf="center">
                <CheckBoxLabel name="isActive" label="isActive" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 12 }} alignSelf="center">
                <BranchesSelector />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 4 }} alignSelf="center">
                <GenericButton
                  type="submit"
                  title="submit"
                  loading={isSubmitting}
                  disabled={!dirty}
                  enableSuccessFeedback
                />
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}

export default AccountForm;
