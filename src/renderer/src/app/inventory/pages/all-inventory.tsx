import { Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import MainTable from 'src/components/main-table'
import { usePaginateData } from 'src/hooks/use-paginate-data'
import { privilegeFeature } from 'src/shared/privileges'
import {
  TNewQuantity,
  useDeleteInventoryMutation,
  useEditInventoryMutation,
  useGetAllInventoryQuery
} from '../services/api'
import { showSuccessToasts } from '@renderer/components/toasts'

function AllInventory({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation('translation')
  const [newQuantities, setNewQuantities] = useState<TNewQuantity[]>([])
  const [updateInventory, { isLoading: isUpdating }] = useEditInventoryMutation()
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
  } = usePaginateData(useGetAllInventoryQuery)

  const [deleteInventory] = useDeleteInventoryMutation()

  const loading = isFetching
  const headers = [
    // { key: 'text', value: t('text') },
    { key: 'name', value: t('Product') },
    { key: 'quantity', value: t('quantity') },
    { key: 'color', value: t('Color') },
    // { key: 'price', value: t('total_price') },
    { key: 'newInventory', value: t('') }
  ]

  const onChangeNewQuantity = (newValue: number, id: string) => {
    setNewQuantities((prev) => {
      const prevItem = prev.find((item) => item.id === id)
      if (prevItem) {
        return prev.map((item) => (item.id === id ? { ...item, newValue } : item))
      }
      return [...prev, { id, newValue }]
    })
  }

  const createData = (data) => {
    return {
      ...data,
      id: data.id,
      newInventory: (
        <TextField
          type="number"
          placeholder={'الجرد الفعلي'}
          onChange={(e) => {
            onChangeNewQuantity(Number(e.target.value), data.id)
          }}
        // value={newQuantities.find((item) => item.id === data.id)?.newValue ?? undefined}
        />
      )
    }
  }

  const onSearch = (key: string) => setSearchValue(key)

  const onUpdateInventory = () => {
    updateInventory({
      inventories: newQuantities.map((item) => ({
        productGuid: item.id,
        quantity: item.newValue
      }))
    })
      .unwrap()
      .then(() => {
        setNewQuantities([])
        showSuccessToasts(t('Inventory updated successfully'))
      })
  }

  const customButton = (
    <Button
      variant="contained"
      onClick={onUpdateInventory}
      disabled={isUpdating || !newQuantities.some((item) => item.newValue)}
    >
      {isUpdating ? <CircularProgress size={16} /> : t('تسوية الجرد')}
    </Button>
  )
  return (
    <MainTable
      feature={privilegeFeature.pos}
      // onAdd={canEdit ? onAdd : undefined}
      customButton={customButton}
      refetch={refetch}
      handleSearch={onSearch}
      title={t('inventory')}
      // isError={isError}
      isError={false}
      header={headers}
      rows={data?.data.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={page}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(AllInventory)
