import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { useGetAllBranchesQuery, branchesType } from '../services/api'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'

function AllBranches({ canEdit, canDelete }: ComponentPropsType) {
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
  } = usePaginateData(useGetAllBranchesQuery)

  const loading = isFetching
  const headers = [
    { key: 'location', value: t('Location') },
    { key: 'posAdmin', value: t('POS Admin') },
    { key: 'cashBox', value: t('Cash Box') },
    { key: 'createdAt', value: t('Created At') }
  ]

  const createData = (data: branchesType) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatCashBox = (casherBox: { syp: number; usd: number }) => {
      return `SYP ${casherBox.syp.toLocaleString()} | USD ${casherBox.usd.toLocaleString()}`
    }

    return {
      id: data.id,
      location: data.location,
      posAdmin: data.posAdmin || t('Not Assigned'),
      cashBox: formatCashBox(data.casherBox),
      createdAt: formatDate(data.createdAt)
    }
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onAdd = () => navigateTo(`/branches/add`)
  const onEdit = (id: string) => navigateTo(`/branches/edit/${id}`)
  const onView = (id: string) => navigateTo(`/branches/${id}`)

  return (
    <MainTable
      feature={privilegeFeature.pos}
      onAdd={canEdit ? onAdd : undefined}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('Branches')}
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
        update: canEdit ? onEdit : undefined,
        // view: onView
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'view'
})(AllBranches)
