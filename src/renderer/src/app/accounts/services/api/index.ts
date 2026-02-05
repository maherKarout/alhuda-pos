import { isManagementBranch } from "@renderer/helpers/is-management-branch";
import { setSearchParams } from "src/helpers/set-search-params";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";

export type accountType = {
  id: string;
  username: string;
  email: string;
  isActive: boolean | React.ReactNode;
  type: string;
  operatorId: string;
  image?: string | React.ReactNode;
  role?: { id?: string; name?: string };
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  
};

export type accountBodyType = {
  username?: string;
  email?: string;
  isActive?: boolean | React.ReactNode;
  type?: string;
  operatorId?: string;
  image?: string | React.ReactNode;
  role?:
    | {
        id: string;
        name: string;
      }
    | React.ReactNode;
  fullName?: string;
};
export type accountsResType = {
  totalRecords?: number;
  data: accountType[];
};

const accountsService = api
  .enhanceEndpoints({ addTagTypes: ["accounts"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllAccounts: build.query<accountsResType, ArgsType>({
        providesTags: ["accounts"],
        query: (props) => {
          const url = setSearchParams(endPoints.accountsEndPoint(), props);
          return {
            url: (isManagementBranch() ? url.pathname:url.pathname+'/pos') + url.search ,
          };
        },
      }),

      addAccount: build.mutation<void, { body: accountBodyType }>({
        query: ({ body }) => ({
          url: endPoints.accountsEndPoint().pathname,
          method: "POST",
          data: body,
        }),
        invalidatesTags: ["accounts"],
      }),

      updateAccount: build.mutation<
        void,
        { id: string; body: accountBodyType }
      >({
        invalidatesTags: ["accounts"],
        query: ({ id, body }) => {
          return {
            url: `${endPoints.accountsEndPoint().pathname}/${id}`,
            method: "PATCH",
            data: body,
          };
        },
      }),

      deleteAccount: build.mutation<void, string>({
        query: (id) => ({
          url: `${endPoints.accountsEndPoint().pathname}/${id}`,
          method: "DELETE",
        }),
      }),

      getAccountById: build.query<{ data: accountType }, string>({
        query: (id) => ({
          url: `${endPoints.accountsEndPoint().pathname}/${id}`,
        }),
        keepUnusedDataFor: 0,
      }),
    }),
  });
export const {
  useGetAllAccountsQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountByIdQuery,
  useAddAccountMutation,
} = accountsService;
