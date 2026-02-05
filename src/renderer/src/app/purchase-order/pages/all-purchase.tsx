import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'
import DateFormattedCell from '@renderer/components/date-formated-cell'
import { Chip } from '@mui/material'
import { useGetAllPurchaseOrdersQuery } from '../services/api'
import { routeName } from '@renderer/shared/routeName'
import UpdatePurchaseOrderStatus from '../components/update-status'

function AllInvoices({ canEdit, canDelete }: ComponentPropsType) {
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
  } = usePaginateData(useGetAllPurchaseOrdersQuery)

  const loading = isFetching
  const headers = [
    { key: 'billNumber', value: t('bill_number') },
    { key: 'numberOfItems', value: t('Number of Items') },
    { key: 'account', value: t('Account') },
    { key: 'createdAt', value: t('Created At') },
    { key: 'status', value: t('Status') }
  ]

  const createData = (data) => {
    return {
      ...data,
      id: data.id,
      account: data.account,
      numberOfItems: data.numberOfItems,
      createdAt: <DateFormattedCell date={data.createdAt} format="DD/MM/YYYY HH:mm" />,
      status: <UpdatePurchaseOrderStatus purchaseOrderId={data.id} currentStatus={data.status} />
    }
  }

  const onSearch = (key: string) => setSearchValue(key)

  // const onView = (id: string, data: any) => navigateTo(`/invoices/${data?.orderId}`)

  return (
    <MainTable
      feature={privilegeFeature.order}
      onAdd={routeName.PURCHASE_ORDER}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('Invoices')}
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
        // view: onView,
        update: routeName.PURCHASE_ORDER
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(AllInvoices)
