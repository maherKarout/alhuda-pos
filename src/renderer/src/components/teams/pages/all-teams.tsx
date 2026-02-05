import React from 'react'
import { useGetTeamsQuery } from '../services/api'
import MainCard from 'src/components/cards/Main-card'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import ErrorAlert from 'src/components/error/error-alert'
// import TeamCard from "../components/team-card";
// import ChangePasswordDialog from "src/app/representatives/components/change-password-dialog";
function AllTeams() {
  const { t } = useTranslation('translation')
  const { isFetching, isLoading, data, isError } = useGetTeamsQuery({
    limit: 50,
    page: 0,
    total: false,
    needPagination: true
  })

  const resetPassword = (id: string) => {}
  if (isError) return <ErrorAlert />

  return (
    <MainCard title={t('teams')} loading={isFetching}>
      {/* <Grid container spacing={3}>
        {data?.data.map((d, index) => (
          <Grid key={index} item xs={12} md={3}>
            <TeamCard
              adminTitle={d.fullName}
              id={d.accountId}
              title={d.title}
              resetPasswordHandler={resetPassword}
            />
          </Grid>
        ))}
      </Grid> */}
    </MainCard>
  )
}

export default AllTeams
