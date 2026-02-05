import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ArgsType, queryType } from "src/types";
import { getSearchParamsAsObject } from "src/helpers/get-search-params-as-object";
import { stringifyAllValues, typedAllValues } from "src/helpers/object-converter";
import { navigateTo } from "src/components/navigation-component";
import { objectToSearchParamsWithQuestionMark } from "src/helpers/object-to-search-params";
import { SubscriptionOptions } from "@reduxjs/toolkit/query";

export function usePaginateData<T extends { totalRecords?: number | undefined }>(
  hook: queryType<T>,
  options?: SubscriptionOptions & { skip?: boolean },
  skippedQueries?: string[]
) {
  const [totalRecords, setTotalRecords] = useState<number | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsAsObject = getSearchParamsAsObject(searchParams, skippedQueries);
  const typedObject = typedAllValues(searchParamsAsObject) as ArgsType;

  const searchParamsAsObjectWithoutSkippedQueries = getSearchParamsAsObject(searchParams);

  const makePageError = typedObject.page < 0 || typedObject.limit < 1;

  const { isError, isLoading, isSuccess, refetch, data, isFetching } = hook(
    { ...typedObject, needPagination: true, total: true },
    { ...options, skip: makePageError }
  );

  useEffect(() => {
    if (data?.totalRecords !== undefined) setTotalRecords(data?.totalRecords);
  }, [data?.totalRecords]);

  const changePage = useCallback(
    (pageNumber: number) => {
      const newObject = {
        ...searchParamsAsObject,
        page: `${pageNumber}`,
      };
      setSearchParams(newObject);
    },
    [searchParamsAsObject, setSearchParams]
  );

  const handleDelete = useCallback(() => {
    setTotalRecords((prev) => (prev as number) - 1);
    if (((totalRecords as number) - 1) / typedObject.limit <= typedObject.page) {
      if (typedObject.page != 0) {
        const newObject = {
          ...searchParamsAsObject,
          page: `${typedObject.page - 1}`,
        };
        setSearchParams(newObject);
      } else {
        refetch();
      }
    } else refetch();
  }, [
    setTotalRecords,
    totalRecords,
    typedObject.limit,
    typedObject.page,
    searchParamsAsObject,
    setSearchParams,
    refetch,
  ]);

  const changeLimit = useCallback(
    (limit: string) => {
      const newObject = { ...searchParamsAsObject, limit: limit, page: "0" };
      setSearchParams(newObject);
    },
    [searchParamsAsObject, setSearchParams]
  );

  const setSearchValue = useCallback(
    (searchValue: string) => {
      const newObject: Record<string, any> = {
        ...searchParamsAsObject,
        searchValue: searchValue,
        page: `${0}`,
      };
      if (!searchValue) delete newObject.searchValue;
      setSearchParams(newObject);
    },
    [searchParamsAsObject, setSearchParams]
  );

  const sortBy = useCallback(
    (type: 1 | -1, args: string) => {
      const temp = type === -1 ? "-" : "";
      const newObject = {
        ...searchParamsAsObject,
        sort: temp + args,
        page: `${0}`,
      };
      setSearchParams(newObject);
    },
    [searchParamsAsObject, setSearchParams]
  );

  const filterDate = useCallback(
    ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      const newObject = {
        ...searchParamsAsObject,
        startDate: startDate,
        endDate: endDate,
        page: `${0}`,
      };
      if (startDate && endDate) setSearchParams(newObject);
      else {
        searchParams.delete("startDate");
        searchParams.delete("endDate");
        setSearchParams(searchParams);
      }
    },
    [searchParamsAsObject, setSearchParams, searchParams]
  );

  const addExtraParams = useCallback(
    (args: Partial<ArgsType>) => {
      const newObject = { ...searchParamsAsObject, ...stringifyAllValues(args) };
      const searchParamsString = objectToSearchParamsWithQuestionMark(newObject);
      navigateTo(searchParamsString);
    },
    [searchParamsAsObject]
  );

  return {
    data,
    isLoading,
    isFetching,
    isError: makePageError || isError,
    isSuccess,
    totalRecords,
    page: typedObject.page,
    changePage,
    handleDelete,
    changeLimit,
    limit: typedObject.limit,
    setSearchValue,
    refetch,
    sortBy,
    addExtraParams,
    filterDate,
    parameter: typedObject,
    searchParamsAsObject,
    searchParamsAsObjectWithoutSkippedQueries,
  };
}
