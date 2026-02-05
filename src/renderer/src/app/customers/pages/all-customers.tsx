import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { useGetAllCustomersQuery, useDeleteCustomersMutation, customersType } from '../services/api'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'
import { Typography } from '@mui/material'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { useGetAllCustomers, type GetAllCustomersData } from '../hooks/use-get-customers'

function AllCustomers({ canEdit, canDelete }: ComponentPropsType) {
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
    // } = usePaginateData(useGetAllCustomersQuery)
  } = usePaginateData(useGetAllCustomers as any)


  const [deleteCustomers] = useDeleteCustomersMutation()

  const loading = isFetching
  const headers = [
    // { key: 'customerId', value: t('Customer ID') },
    { key: 'name', value: t('Name') },
    { key: 'phone', value: t('Phone') },
    { key: '  ', value: t('from_branch') },
    { key: 'balance', value: t('Balance') }
    // { key: 'totalPurchases', value: t('Total Purchases') }
  ]

  const createData = (data) => {
    return {
      ...data,
      id: data.id,
      customerId: data.customerId || data.id,
      name: data.name,
      phone: data.phone,
      numberOfInvoices: data.numberOfInvoices || 0,
      totalPurchases: data.totalPurchases || 0,
      balance: (
        <Typography sx={{ color: data.balance < 0 ? 'red' : 'black' }}>
          {priceToDecimalPrice(data.balance + '')}
        </Typography>
      )
    }
  }

  const onDelete = (id: string) => {
    deleteCustomers(id)
      .unwrap()
      .then(() => {
        handleDelete()
      })
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onAdd = () => navigateTo(`/customers/add`)
  const onEdit = (id: string, data: customersType) => {
    navigateTo(`/customers/edit/${data.customerId}`)
  }
  const onView = (id: string, data: customersType) =>
    navigateTo(`/customers/details/${data.customerId}`)

  return (
    <MainTable
      feature={privilegeFeature.customer}
      onAdd={canEdit ? onAdd : undefined}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('Customers')}
      isError={isError}
      header={headers}
      rows={(data as GetAllCustomersData | undefined)?.data?.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={page}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
      action={{
        delete: canDelete ? onDelete : undefined,
        update: canEdit ? onEdit : undefined,
        // @ts-ignore
        view: onView
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.customer,
  type: 'view'
})(AllCustomers)
