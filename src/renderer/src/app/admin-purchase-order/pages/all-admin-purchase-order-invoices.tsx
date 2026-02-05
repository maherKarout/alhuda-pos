import UpdatePurchaseOrderStatus from '@renderer/app/purchase-order/components/update-status'
import { useUpdateAdminPurchaseOrderStatusMutation } from '@renderer/app/purchase-order/services/api'
import DateFormattedCell from '@renderer/components/date-formated-cell'
import { useTranslation } from 'react-i18next'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import MainTable from 'src/components/main-table'
import { navigateTo } from 'src/components/navigation-component'
import { usePaginateData } from 'src/hooks/use-paginate-data'
import { privilegeFeature } from 'src/shared/privileges'
import { useGetAllAdminPurchaseOrderQuery } from '../services/api'
import { routeName } from '@renderer/shared/routeName'
import { useEffect } from 'react'

function AllAdminPurchaseOrderInvoices({ canEdit, canDelete }: ComponentPropsType) {
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
        refetch,
        addExtraParams,

    } = usePaginateData(useGetAllAdminPurchaseOrderQuery)

    useEffect(() => { addExtraParams({ status: "completed" }) }, [])
    const loading = isFetching
    const headers = [
        { key: 'billNumber', value: t('order_number') },
        { key: 'numberOfItems', value: t('Number of Items') },
        { key: 'account', value: t('Account') },
        { key: 'createdAt', value: t('Created At') },
        { key: 'branch', value: t('Branch') },
        { key: 'status', value: t('Status') }
    ]
    const createData = (data) => {
        return {
            ...data,
            id: data.id,
            account: data.account,
            numberOfItems: data.numberOfItems,
            createdAt: <DateFormattedCell date={data.createdAt} format="DD/MM/YYYY HH:mm" />,
            status: <UpdatePurchaseOrderStatus purchaseOrderId={data.id} currentStatus={data.status} />,
            billNumber: data.billNumber ?? "---"

        }
    }   

    const onSearch = (key: string) => setSearchValue(key)

    const onView = (id: string) => {
        navigateTo(`${routeName.ADMIN_PURCHASE_ORDER_INVOICES}/${id}`)
    }


    return (
        <MainTable
            feature={privilegeFeature.role}
            refetch={refetch}
            handleSearch={onSearch}
            title={t('shope_invoices')}
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
    feature: privilegeFeature.purchase,
    type: 'view'
})(AllAdminPurchaseOrderInvoices)
