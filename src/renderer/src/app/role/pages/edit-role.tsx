import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { privilegesData, useGetRoleByIdQuery, useUpdateRoleMutation } from "../services/api";
import ErrorAlert from "src/components/error/error-alert";
import RoleForm from "../components/role-form";
import Loader from "src/components/loader";
import MainCard from "src/components/cards/Main-card";
import { FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";
import { showSuccessToasts } from "src/components/toasts";

function EditRole() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFetching, data, isError } = useGetRoleByIdQuery(id ?? "");

  const [updateRole] = useUpdateRoleMutation();

  const options = data?.data.privileges.map((d, i) => ({
    key: d.name,
    value: JSON.stringify(d),
  }));

  const initialValues = {
    name: { ar: data?.data?.name.ar, en: data?.data?.name.en },
    privileges: data?.data.privileges
      .filter((privilege) => privilege.privileges.some((p) => p.checked !== false))
      .map((e) => JSON.stringify(e)),
    privilegesToEdit: data?.data.privileges.map((privilege) => ({
      ...privilege,
      privileges: privilege.privileges.map((p) => ({
        ...p,
        checked: privilege.privileges.some((p) => p.checked) ? p.checked : true,
      })),
    })),
  };

  const onSubmit = (
    values: {
      privileges: string[];
      privilegesToEdit: privilegesData[];
      name: { ar: string; en: string };
    },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    const filteredPrivilegesToEdit = values.privilegesToEdit.filter((pToEdit) =>
      values.privileges.some((p) => (JSON.parse(p) as privilegesData).name === pToEdit.name)
    );
    const checkedIds = filteredPrivilegesToEdit
      .flatMap((obj) => obj.privileges) // Flatten the array of privileges
      .filter((privilege) => privilege.checked) // Filter privileges with checked = true
      .map((privilege) => privilege.id);
    updateRole({
      id: id,
      body: { name: values.name, privileges: checkedIds },
    })
      .unwrap()
      .then((res) => {
        showSuccessToasts("updated successfully");
        navigate("/roles");
      })
      .catch((err) => {
        setSubmitting(false);
      });
  };

  if (isError) return <ErrorAlert />;

  return (
    <>
      <MainCard loading={isFetching} title={t("edit_role")}>
        <RoleForm initialValues={initialValues} onSubmit={onSubmit} options={options ?? []} />
      </MainCard>
    </>
  );
}
export default AuthorizedCheckWrapper({
  type: "edit",
  feature: privilegeFeature.role,
})(EditRole);
