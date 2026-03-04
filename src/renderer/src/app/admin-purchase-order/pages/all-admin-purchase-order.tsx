import { usePaginateData } from 'src/hooks/use-paginate-data'
import { useTranslation } from 'react-i18next'
import { privilegeFeature } from 'src/shared/privileges'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { useGetAllAdminPurchaseOrderQuery } from '../services/api'
import { useUpdateAdminPurchaseOrderStatusMutation } from '@renderer/app/purchase-order/services/api'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'
import DateFormattedCell from '@renderer/components/date-formated-cell'
import UpdatePurchaseOrderStatus from '@renderer/app/purchase-order/components/update-status'
import { routeName } from '@renderer/shared/routeName'
import { PurchaseStatus } from '@renderer/consts'
import { useEffect } from 'react'
import BigTextPreview from '@renderer/components/dialog/big-text-preview'

function AllAdminPurchaseOrder({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation('translation')
  const [updateAdminPurchaseOrderStatus] = useUpdateAdminPurchaseOrderStatusMutation()
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
    refetch,
    addExtraParams,
  } = usePaginateData(useGetAllAdminPurchaseOrderQuery)
  useEffect(() => { addExtraParams({ status: "un-completed" }) }, [])

  const loading = isFetching
  const headers = [
    { key: 'billNumber', value: t('order_number') },
    { key: 'numberOfItems', value: t('Number of Items') },
    { key: 'branch', value: t('Branch') },
    { key: 'account', value: t('Account') },
    { key: 'createdAt', value: t('Created At') },
    { key: 'status', value: t('Status') },
    { key: 'notes', value: t('Notes') },

  ]
  const createData = (data) => {
    return {
      ...data,
      id: data.id,
      account: data.account,
      numberOfItems: data.numberOfItems,
      createdAt: <DateFormattedCell date={data.createdAt} format="DD/MM/YYYY HH:mm" />,
      status: <UpdatePurchaseOrderStatus purchaseOrderId={data.id} currentStatus={data.status} allowEdit={false} isForAdmin />,
      notes: <BigTextPreview text={data.itemNote} />,
      billNumber: data.billNumber ?? "---"
    }
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onEdit = (id: string) => {
    updateAdminPurchaseOrderStatus({ id, status: PurchaseStatus.IN_PROGRESS })
    navigateTo(`${routeName.ADMIN_PURCHASE_ORDER}/${id}`)
  }
  return (
    <MainTable
      feature={privilegeFeature.role}
      onAdd={routeName.ADMIN_PURCHASE_ORDER + '/add'}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('shope_orders')}
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
        update: canEdit ? onEdit : undefined
      }}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.purchase,
  type: 'view'
})(AllAdminPurchaseOrder)
// export default AllAdminPurchaseOrder
