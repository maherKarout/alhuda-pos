import React from "react";
import { privilegesData, subPrivilegesType, useAddRoleMutation, useGetPrivilegesQuery } from "../services/api";
import MainCard from "src/components/cards/Main-card";
import RoleForm from "../components/role-form";
import { useTranslation } from "react-i18next";
import Loader from "src/components/loader";
import ErrorAlert from "src/components/error/error-alert";
import { FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";

function AddRole() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const { isLoading, data, isError } = useGetPrivilegesQuery();
  const [addRole] = useAddRoleMutation();

  const options = data?.data.map((d, i) => ({
    key: d.name,
    value: JSON.stringify(d),
  }));

  const onSubmit = (
    values: {
      privileges: string[];
      privilegesToEdit: privilegesData[];
      name: { ar: string; en: string };
    },
    { setSubmitting, setErrors }: FormikHelpers<any>
  ) => {
    const filteredPrivilegesToEdit = values.privilegesToEdit.filter((pToEdit) =>
      values.privileges.some((p) => JSON.parse(p).name === pToEdit.name)
    );

    const checkedIds = filteredPrivilegesToEdit
      .flatMap((obj) => obj.privileges) // Flatten the array of privileges
      .filter((privilege) => privilege.checked) // Filter privileges with checked = true
      .map((privilege) => privilege.id);
    if (checkedIds.length === 0) {
      setErrors({ privileges: t("notAllowed to be empty") ?? "" });
      setSubmitting(false);
    } else
      addRole({ body: { name: values.name, privileges: checkedIds } })
        .unwrap()
        .then((res) => {
          navigate("/roles");
        })
        .catch((err) => {
          setSubmitting(false);
        });
  };

  const initialValues = {
    name: { ar: "", en: "" },
    privileges: [],
    privilegesToEdit: options?.map((option) => ({
      ...JSON.parse(option.value),
      privileges: JSON.parse(option.value).privileges.map((value: subPrivilegesType) => ({
        ...value,
        checked: true,
      })),
    })),
  };

  if (isError) return <ErrorAlert />;

  return (
    <MainCard loading={isLoading} title={t("add_role")}>
      <RoleForm initialValues={initialValues} onSubmit={onSubmit} options={options ?? []} />
    </MainCard>
  );
}

export default AuthorizedCheckWrapper({
  type: "add",
  feature: privilegeFeature.role,
})(AddRole);
