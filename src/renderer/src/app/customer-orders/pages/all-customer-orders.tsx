import { usePaginateData } from "src/hooks/use-paginate-data";
import { useTranslation } from "react-i18next";
import { privilegeFeature } from "src/shared/privileges";
import AuthorizedCheckWrapper, { ComponentPropsType } from "src/components/authorized-check-wrapper";
import { useGetAllCustomerOrdersQuery } from "../services/api";
import MainTable from "src/components/main-table";
import { navigateTo } from "src/components/navigation-component";
import DateFormattedCell from "@renderer/components/date-formated-cell";
import { routeName } from "@renderer/shared/routeName";
import { priceToDecimalPrice } from "@renderer/helpers/price-to-decimal-price";

function AllCustomerOrders({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation("translation");

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
    refetch,
  } = usePaginateData(useGetAllCustomerOrdersQuery);


  const loading = isFetching;
  const headers = [
    { key: 'billNumber', value: t('order_number') },
    { key: 'customerName', value: t('Customer Name') },
    { key: 'date', value: t('Date') },
    { key: 'totalPrice', value: t('invoice value') },
    { key: 'status', value: t('Status') }
  ]

  const createData = (data) => {
    return {
      id: data.id,
      ...data,
      date: <DateFormattedCell date={data.date} format="DD/MM/YYYY" />,
      totalPrice: priceToDecimalPrice(data.totalPrice + '')
    };
  };



  const onSearch = (key: string) => setSearchValue(key);

  const onEdit = (id: string) => navigateTo(`${routeName.CASHER_SCREEN}${id}`);


  return (
    <MainTable
      feature={privilegeFeature.order}
      refetch={refetch}
      handleSearch={onSearch}
      title={t("Customer orders")}
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
      }}
    />
  );
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: "view",
})(AllCustomerOrders);