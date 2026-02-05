import { useGetAllCustomersWithoutPaginationQuery } from '@renderer/app/customers'
import React from 'react'

function useGetCustomers(inputValue?: string) {
  // return useDbDataWithStatus(() => window.api.getCustomers())
  return useGetAllCustomersWithoutPaginationQuery({ searchValue: inputValue })
}

export default useGetCustomers
