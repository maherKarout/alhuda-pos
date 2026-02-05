import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { useGetAllPosUsersQuery, useDeletePosUsersMutation } from '../services/api'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'

function AllPosUsers({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation('translation')

  const {
    changePage,
    data,
    isError,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    handleDelete,
    refetch
  } = usePaginateData(useGetAllPosUsersQuery)

  const [deletePosUsers] = useDeletePosUsersMutation()

  const loading = isFetching
  const headers = [
    { key: 'name', value: t('Full Name') },
    { key: 'username', value: t('Username') },
    { key: 'role', value: t('Role') },
    { key: 'accountRole', value: t('Account Role') }
  ]

  const createData = (data) => {
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      role: data.role,
      accountRole: data.accountRole
    }
  }

  const onDelete = (id: string) => {
    deletePosUsers(id)
      .unwrap()
      .then(() => {
        handleDelete()
      })
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onAdd = () => navigateTo(`/pos-users/add`)
  const onEdit = (id: string) => navigateTo(`/pos-users/edit/${id}`)

  return (
    <MainTable
      feature={privilegeFeature.pos}
      onAdd={canEdit ? onAdd : undefined}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('POS users')}
      isError={isError}
      header={headers}
      rows={data?.data.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={page}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
      action={{
        delete: canDelete ? onDelete : undefined,
        update: canEdit ? onEdit : undefined
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'view'
})(AllPosUsers)
