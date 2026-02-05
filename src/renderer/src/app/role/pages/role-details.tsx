import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRoleByIdQuery } from "../services/api";
import ErrorAlert from "src/components/error/error-alert";
import MainCard from "src/components/cards/Main-card";
import { Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import Loader from "src/components/loader";
import AuthorizedCheckWrapper, { ComponentPropsType } from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";
function RoleDetails({ canEdit }: ComponentPropsType) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("translation");
  const { isFetching, data, isError } = useGetRoleByIdQuery(id ?? "");

  if (isError) return <ErrorAlert />;

  return (
    <MainCard
      loading={isFetching}
      title={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">{t(data?.data.name.ar ?? "")}</Typography>
          {canEdit && (
            <IconButton
              onClick={() => {
                navigate(`/roles/edit/${id}`);
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
          )}
        </Stack>
      }
    >
      <Grid container spacing={2}>
        {data?.data.privileges.map((privileges, index) => {
          if (privileges.privileges.every((p) => p.checked === false)) return <></>;
          return (
            <Grid key={index} component="div" size={{ xs: 12, md: 4 }}>
              <MainCard title={privileges.name}>
                <Grid container columnSpacing={1}>
                  {privileges.privileges.map((p, i) => (
                    <React.Fragment key={i}>
                      <Grid container key={i}  component="div" size={{ xs: 11 }}>
                        <Grid component="div" size={{ xs: 1 }}>
                          {p.checked ? <CheckCircleOutlineIcon color="primary" /> : <BlockIcon color="error" />}
                        </Grid>
                        <Grid component="div" size={{ xs: 1 }}>
                          {p.action}
                        </Grid>
                      </Grid>
                      <Grid component="div" size={{ xs: 1 }}>
                        <Tooltip title={p.description} placement="top">
                          <ErrorIcon sx={{ color: "#bebebe" }} />
                        </Tooltip>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </MainCard>
            </Grid>
          );
        })}
      </Grid>
    </MainCard>
  );
}

export default AuthorizedCheckWrapper({
  type: "view",
  feature: privilegeFeature.role,
})(RoleDetails);
