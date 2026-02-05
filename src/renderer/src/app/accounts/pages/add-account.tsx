import React from "react";
import { useTranslation } from "react-i18next";
import MainCard from "src/components/cards/Main-card";

import AccountForm from "../components/account-form";
import { useGetAllRoleQuery } from "src/app/role/services/api";
import { useAddAccountMutation } from "../services/api";
import { FormikHelpers } from "formik";
import { uploadFileToServer, uploadKeys } from "src/helpers/upload-file-to-server";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "src/components/error/error-alert";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";
import { showSuccessToasts } from "src/components/toasts";
import { submitType } from "src/types";

function AddAccount() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const { isLoading, data, isError } = useGetAllRoleQuery();

  const roleOptions = data?.data?.map((d, i) => ({ key: d.name, value: d.id }));
  const [addAccount] = useAddAccountMutation();
  const initialValues = {
    fullName: "",
    password: "",
    username: "",
    role: "",
    isActive: false,
    image: "",
    phoneNumber: "",
    pos: []
  };
  const onSubmit = async (values: any, helpers: FormikHelpers<any>, submitType?: submitType) => {
    const imageId = await uploadFileToServer(values["image"], uploadKeys.operator);
    const dataToSend = { ...values, image: imageId };
    addAccount({ body: dataToSend })
      .unwrap()
      .then((res) => {
        if (submitType === "saveAndAddNew") helpers.resetForm();
        else navigate(-1);
        showSuccessToasts("added successfully");
      })
      .catch((err) => {
        helpers.setSubmitting(false);
      });
  };
  if (isError) return <ErrorAlert />;
  return (
    <MainCard loading={isLoading} title={t("add_account")}>
      <AccountForm onSubmit={onSubmit} initialValues={initialValues} roleOptions={roleOptions ?? []} />
    </MainCard>
  );
}

export default AuthorizedCheckWrapper({
  type: "add",
  feature: privilegeFeature.operator,
})(AddAccount);
