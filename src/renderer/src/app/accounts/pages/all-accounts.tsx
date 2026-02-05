import { Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import GenericTable from "src/components/generic-table";
import {
  accountType,
  accountsResType,
  useDeleteAccountMutation,
  useGetAllAccountsQuery,
  useUpdateAccountMutation,
} from "../services/api";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { Link } from "react-router-dom";
import AuthorizedCheckWrapper, { ComponentPropsType } from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";
import MainTable from "src/components/main-table";
import { useAppSelector } from "src/hooks/useAppSelector";
import { showStringErrorToasts } from "src/components/toasts";

function AllAccounts({ canDelete, canEdit }: ComponentPropsType) {
  const { t } = useTranslation("translation");
  const currentAccount = useAppSelector((state) => state.auth.account);
  const {
    changePage,
    data,
    page,
    totalRecords,
    limit,
    changeLimit,
    isFetching,
    handleDelete,
    isError,
    filterDate,
    setSearchValue,
    refetch,
  } = usePaginateData(useGetAllAccountsQuery);

  const [updateAccount, { isLoading: updateLoading }] = useUpdateAccountMutation();

  const [deleteAccount, { isLoading: deleteLoading }] = useDeleteAccountMutation();

  const loading = isFetching || updateLoading || deleteLoading;

  const createRows = (data: accountType) => {
    return {
      ...data,
      role: data.role ? (
        <Link to={`/roles/${data.role?.id}`}>{data.role?.name}</Link>
      ) : (
        <Typography>{t("roleNotExist")}</Typography>
      ),
      removeDelete: !data.isActive,
    };
  };

  const headers = [
    { key: "username", value: t("username") },
    { key: "fullName", value: t("fullName") },
    { key: "role", value: t("role") },
  ];

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const onDelete = (id: string) => {
    // Prevent self-deletion
    if (currentAccount?._id === id) {
      return undefined
    }

    deleteAccount(id)
      .unwrap()
      .then((res) => {
        handleDelete();
      });
  };

  const handleActivation = (id: string, currentValue: boolean) => {
    updateAccount({
      id,
      body: { isActive: !currentValue },
    });
  };

  return (
    <MainTable
      refetch={refetch}
      onAdd="/accounts/add"
      feature={privilegeFeature.operator}
      handleSearch={handleSearch}
      title="accounts"
      loading={loading}
      page={page}
      header={headers}
      rows={data?.data.map((d) => createRows(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      onLimitChange={changeLimit}
      limit={limit}
      onPageChange={changePage}
      action={{
        update: canEdit ? "/accounts" : undefined,
        delete: true ? onDelete : undefined,
        activation: canEdit
          ? {
            key: "isActive",
            handler: handleActivation,
          }
          : undefined,
        // view: true ? () => {} : undefined,
      }}
      isError={isError}
    />
  );
}

export default AuthorizedCheckWrapper({
  type: "view",
  feature: privilegeFeature.operator,
})(AllAccounts);
