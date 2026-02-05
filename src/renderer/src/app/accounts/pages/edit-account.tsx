import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  accountBodyType,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,
} from "../services/api";
import { useTranslation } from "react-i18next";
import MainCard from "src/components/cards/Main-card";
import AccountForm from "../components/account-form";
import {
  uploadFileToServer,
  uploadKeys,
} from "src/helpers/upload-file-to-server";
import { FormikHelpers } from "formik";
import { useGetAllRoleQuery } from "src/app/role/services/api";
import Loader from "src/components/loader";
import ErrorAlert from "src/components/error/error-alert";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";

function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("translation");
  const {
    isLoading,
    data: account,
    isError,
  } = useGetAccountByIdQuery(id ?? "");

  const {
    isLoading: roleLoading,
    data,
    isError: roleError,
  } = useGetAllRoleQuery();

  const [updateAccount] = useUpdateAccountMutation();
  const roleOptions = data?.data?.map((d: any) => ({
    key: d.name,
    value: d.id,
  }));

  const initialValues = {
    fullName: account?.data.fullName,
    username: account?.data.username,
    role: (account?.data.role as { id: string })?.id,
    isActive: account?.data.isActive,
    image: account?.data.image,
    phoneNumber: account?.data.phoneNumber,
  };
  const onSubmit = async (values: accountBodyType) => {
    const image = await uploadFileToServer(
      values["image"],
      uploadKeys.operator
    );
    updateAccount({ id: id ?? "", body: { ...values, image } })
      .unwrap()
      .then((res) => {
        navigate("/accounts");
      });
  };

  if (isError || roleError) return <ErrorAlert />;

  return (
    <MainCard loading={isLoading || roleLoading} title={t("edit_account")}>
      <AccountForm
        isEdit
        initialValues={initialValues}
        onSubmit={onSubmit}
        roleOptions={roleOptions ?? []}
      />
    </MainCard>
  );
}

export default AuthorizedCheckWrapper({
  type: "edit",
  feature: privilegeFeature.operator,
})(EditAccount);
