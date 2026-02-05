import React from "react";
import { useGetMeQuery, useUpdateMeMutation } from "../services/api";
import MainCard from "src/components/cards/Main-card";
import UpdateMeForm from "../components/update-me-form";
import ErrorAlert from "src/components/error/error-alert";
import Loader from "src/components/loader";
import { FormikHelpers } from "formik";
import {
  uploadFileToServer,
  uploadKeys,
} from "src/helpers/upload-file-to-server";
import { Link, useNavigate } from "react-router-dom";
import { Stack, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
function UpdateMyInfo() {
  const { t } = useTranslation("translation");
  const { data, isFetching, isError } = useGetMeQuery();
  const navigate = useNavigate();
  const initialValues = {
    firstName: data?.data.operator.firstName,
    lastName: data?.data.operator.lastName,
    image: data?.data.operator.image,
  };
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const onSubmit = async (values: any, {}: FormikHelpers<any>) => {
    if (typeof values["image"] === "object") {
      const imageId = await uploadFileToServer(
        values["image"],
        uploadKeys.operator
      );
      values["image"] = imageId;
    } else values["image"] = undefined;

    updateMe(values)
      .unwrap()
      .then((res) => {
        navigate("/");
      });
  };
  if (isError) return <ErrorAlert />;
  return (
    <MainCard
      title={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3">{t("updateMyInfo")}</Typography>

          <Link to="/change-my-password">{t("changeMyPassword")}</Link>
        </Stack>
      }
    >
      {isFetching ? (
        <Loader />
      ) : (
        <UpdateMeForm onSubmit={onSubmit} initialValues={initialValues} />
      )}
    </MainCard>
  );
}

export default UpdateMyInfo;
