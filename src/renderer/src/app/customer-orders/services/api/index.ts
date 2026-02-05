import { setSearchParams } from "src/helpers/set-search-params";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";

export type customerOrdersType = {
  id: string;
};

type ResType = {
  totalRecords?: number;
  data: customerOrdersType[];
};

type customerOrdersById = customerOrdersType;

const apiService = api.enhanceEndpoints({ 
  addTagTypes: ["Customer-orders"] 
}).injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAllCustomerOrders: query<ResType, ArgsType>({
      providesTags: ["Customer-orders"],
      query: (props) => {
        const url = setSearchParams(endPoints.customerOrderEndpoint(), props);
        return { url: url.pathname + url.search };
      },
    }),
    getCustomerOrdersById: query<customerOrdersById, string>({
      providesTags: (result, error, id) => [{ type: "Customer-orders", id }],
      query: (id) => ({
        url: `${endPoints.customerOrderEndpoint().pathname}/${id}`,
      }),
    }),
    editCustomerOrders: mutation<void, { id: string; data: Partial<customerOrdersType> }>({
      invalidatesTags: (result, error, { id }) => [
        { type: "Customer-orders", id },
        "Customer-orders"
      ],
      query: ({ data, id }) => ({
        url: `${endPoints.customerOrderEndpoint().pathname}/${id}`,
        method: "PATCH",
        data,
      }),
    }),

  }),
});

export const { 
  useGetAllCustomerOrdersQuery,
  useGetCustomerOrdersByIdQuery,
  useEditCustomerOrdersMutation,
} = apiService;