import React from "react";
import { FormikOnSubmitType } from "src/types";
import { Yup } from "src/validation";
import { Formik } from "formik";
import { Grid } from "@mui/material";
import OutlinedTextInput from "src/components/formik-input/outlined-text-input";
import GenericButton from "src/components/generic-button";
import FileEditorInput from "src/components/formik-input/image-input-editor";
type propsTypes = {
  initialValues: any;
  onSubmit: FormikOnSubmitType<any>;
};
function UpdateMeForm({ initialValues, onSubmit }: propsTypes) {
  const validationSchema = Yup.object().shape({
    firstName: Yup.text({ isRequired: true }),
    lastName: Yup.text({ isRequired: true }),
    image: Yup.text({ isRequired: true }),
  });
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid component="div" size={{ xs: 12, md: 8 }} spacing={2} container>
              <Grid component="div" size={{ xs: 12, md: 6 }}>
                <OutlinedTextInput name="firstName" label="firstName" type="text" />
              </Grid>
              <Grid component="div" size={{ xs: 12, md: 6 }}>
                <OutlinedTextInput name="lastName" label="lastName" type="text" />
              </Grid>
            </Grid>
            <Grid component="div" size={{ xs: 12, md: 4 }}>
              <FileEditorInput accept="*/*" name="image" placeholder="image" label="image" />
            </Grid>
            <Grid component="div" size={{ xs: 6, md: 2 }}>
              <GenericButton loading={isSubmitting} title="submit" type="submit" />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

export default UpdateMeForm;
