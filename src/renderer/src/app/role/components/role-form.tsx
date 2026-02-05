import { Formik } from "formik";
import React, { useState } from "react";
import { Grid, Checkbox, Divider, Tooltip, useScrollTrigger, Stack, Typography, Button } from "@mui/material";
import { FormikOnSubmitType } from "src/types";
import OutlinedTextInput from "src/components/formik-input/outlined-text-input";
import MultiChipSelect from "src/components/formik-input/multi-chip-select";
import MainCard from "src/components/cards/Main-card";
import ErrorIcon from "@mui/icons-material/Error";
import { Yup } from "src/validation";
import GenericButton from "src/components/generic-button";
import LanguagesTabWrapper from "src/components/languages-tab-wrapper";
import { privilegesData } from "../services/api";
import CheckBoxLabel from "src/components/formik-input/check-box-label";
import RoleCardHeader from "./role-card-header";
type propsType = {
  onSubmit: FormikOnSubmitType<any>;
  initialValues: any;
  options: { key: string; value: string }[];
};
const validationSchema = Yup.object().shape({
  name: Yup.multiLanguage("ar"),
  privileges: Yup.limitedArray(1),
});
function RoleForm({ onSubmit, initialValues, options }: propsType) {
  const [ln, setLn] = useState("ar");
  return (
    <>
      <Formik onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, values, setFieldValue, errors, touched, isSubmitting, dirty }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid component="div" size={{ xs: 12 }}>
                  <LanguagesTabWrapper errors={errors} ln={ln} setLn={setLn} touched={touched} />
                </Grid>
                <Grid component="div" size={{ xs: 12, md: 4 }}>
                  <OutlinedTextInput type="text" label="name" name={`name.${ln}`} />
                </Grid>
                <Grid component="div" size={{ xs: 12, md: 4 }}>
                  <MultiChipSelect label="roles" name="privileges" options={options} />
                </Grid>
                <Grid component="div" size={{ xs: 12, md: 2 }} alignSelf="center">
                  <GenericButton title="submit" loading={isSubmitting} disabled={!dirty} type="submit" />
                </Grid>
                <Grid size={12} container spacing={2} columns={12}>
                  {(values.privileges as string[]).map((p, index) => {
                    const privileges = JSON.parse(p) as privilegesData;
                    return (
                      <Grid key={index} component="div" size={{ xs: 12, md: 4 }}>
                        <MainCard
                          title={
                            <RoleCardHeader privileges={privileges} setFieldValue={setFieldValue} values={values} />
                          }
                        >
                          <Grid container spacing={1}>
                            {privileges.privileges.map((privilege, subIndex) => {
                              const privilegeIndex = (values.privilegesToEdit as privilegesData[])?.findIndex(
                                (Privilege) => Privilege.name === privileges.name
                              );
                              return (
                                <React.Fragment key={subIndex}>
                                  <Grid component="div" size={{ xs: 11 }}>
                                    <CheckBoxLabel
                                      disabled={privilege.action === "عرض" || privilege.action === "View"}
                                      label={privilege.action}
                                      name={`privilegesToEdit[${privilegeIndex}].privileges[${(
                                        values.privilegesToEdit as privilegesData[]
                                      )[privilegeIndex].privileges.findIndex((p) => p.id === privilege.id)}].checked`}
                                    />
                                  </Grid>
                                  <Grid component="div" size={{ xs: 1 }}>
                                    <Tooltip title={privilege.description} placement="top">
                                      <ErrorIcon sx={{ color: "#bebebe" }} />
                                    </Tooltip>
                                  </Grid>
                                </React.Fragment>
                              );
                            })}
                          </Grid>
                        </MainCard>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
}

export default RoleForm;
