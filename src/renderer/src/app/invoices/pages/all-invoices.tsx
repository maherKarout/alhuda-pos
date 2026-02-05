import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { useGetAllInvoicesQuery } from '../services/api'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'
import DateFormattedCell from '@renderer/components/date-formated-cell'
import { Chip } from '@mui/material'
import { PaidStatus } from '@renderer/consts'

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
  } = usePaginateData(useGetAllInvoicesQuery)

  const loading = isFetching
  const headers = [
    { key: 'billNumber', value: t('bill_number') },
    { key: 'customerName', value: t('Customer Name') },
    { key: 'date', value: t('Date') },
    { key: 'totalPrice', value: t('Total Price') },
    { key: 'status', value: t('Status') }
  ]

  const createData = (data) => {
    const getStatusChip = (status: PaidStatus) => {
      return (
        <Chip
          label={status === PaidStatus.paid ? t('Paid') : t('Not Paid')}
          color="success"
          variant="filled"
          size="small"
          sx={{
            backgroundColor: status === PaidStatus.paid ? '#4CAF50' : '#e62d2d',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      )
    }
    // Add other status types if needed
    // return <Chip label={t(status)} color="default" variant="outlined" size="small" />

    return {
      ...data,
      id: data.id,
      date: <DateFormattedCell date={data.date} format="DD/MM/YYYY" />,
      status: getStatusChip(data.status)
    }
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onView = (id: string, data: any) => navigateTo(`/invoices/${data?.orderGuid}`)

  return (
    <MainTable
      feature={privilegeFeature.order}
      // onAdd={canEdit ? onAdd : undef"not-paid"ined}
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
        view: onView
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(AllInvoices)
