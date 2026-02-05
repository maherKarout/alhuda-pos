import React from "react";
import { useGetTeamsQuery } from "../services/api";
import MainCard from "src/components/cards/Main-card";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import ErrorAlert from "src/components/error/error-alert";
import TeamCard from "../components/team-card";

function AllTeams() {
  const { t } = useTranslation("translation");
  const { isFetching, isLoading, data, isError } = useGetTeamsQuery({
    limit: 50,
    page: 0,
    total: false,
    needPagination: true,
  });

  const resetPassword = (id: string) => {};
  if (isError) return <ErrorAlert />;

  return (
    <MainCard title={t("pos")} loading={isFetching}>
      <Grid container spacing={3}>
        {data?.data.map((d, index) => (
          <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
            <TeamCard adminTitle={d.location} id={d.id} title={d.location} resetPasswordHandler={resetPassword} />
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
}

export default AllTeams;
