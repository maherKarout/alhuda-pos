import { Grid } from '@mui/material'
import { usePaginateData } from 'src/hooks/use-paginate-data'
import {
  rolesResType,
  useDeleteRoleMutation,
  useGetAllRoleWithPaginationQuery
} from '../services/api'
import { useTranslation } from 'react-i18next'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { privilegeFeature } from 'src/shared/privileges'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'

function AllRoles({ canDelete, canEdit }: ComponentPropsType) {
  const { t } = useTranslation('translation')
  const {
    data,
    isFetching,
    changePage,
    limit,
    page,
    totalRecords,
    changeLimit,
    isError,
    handleDelete,
    refetch
  } = usePaginateData<rolesResType>(useGetAllRoleWithPaginationQuery)

  const [deleteRole, { isLoading }] = useDeleteRoleMutation()

  const loading = isFetching || isLoading

  const header = [
    { key: 'name', value: t('name') }
    // { key: "details", value: t("details") },
  ]

  const createData = (data: { id: string; name: string }) => {
    return {
      ...data
    }
  }

  const onDelete = (id: string) => {
    deleteRole(id)
      .unwrap()
      .then((res) => {
        handleDelete()
      })
  }
  const onView = (id: string) => {
    navigateTo(`/roles/${id}`)
  }
  return (
    <Grid container spacing={2}>
      <Grid component="div" size={{ xs: 12 }}>
        <MainTable
          refetch={refetch}
          hideColumns={[]}
          title="roles"
          feature={privilegeFeature.role}
          onAdd="/roles/add"
          header={header}
          onPageChange={changePage}
          rows={data?.data.map((d, i) => createData(d)) ?? []}
          totalRecords={totalRecords ?? 0}
          action={{
            delete: canDelete ? onDelete : undefined,
            update: canEdit ? '/roles/edit' : undefined
            // view: onView,
          }}
          limit={limit}
          loading={loading}
          onLimitChange={changeLimit}
          page={page}
          isError={isError}
        />
      </Grid>
    </Grid>
  )
}

export default AuthorizedCheckWrapper({
  type: 'view',
  feature: privilegeFeature.role
})(AllRoles)
