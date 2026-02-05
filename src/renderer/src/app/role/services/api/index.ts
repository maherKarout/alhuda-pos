import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'
export type rolesResType = {
  totalRecords?: number
  data: {
    id: string
    name: string
    isNeedBrash:boolean
    }[]
}

export type subPrivilegesType = {
  id: string
  action: string
  description: string
  checked: boolean,
}

export type privilegesData = {
  name: string
  privileges: subPrivilegesType[]
}

type privilegesResType = {
  data: privilegesData[]
}

export type rolesByIdResType = {
  totalRecords?: number
  data: {
    id: string
    name: { en: string; ar: string }
    privileges: {
      id: string
      name: string
      privileges: {
        id: string
        action: string
        description: string
        checked: boolean
      }[]
    }[]
  }
}

export type TCategoryType = {
  id: string
  name: string
  productsCount: number
}

export type TCategoriesResType = {
  totalRecords?: number
  data: TCategoryType[]
}

const roleService = api.enhanceEndpoints({ addTagTypes: ['addRole'] }).injectEndpoints({
  endpoints: (build) => ({
    getAllRole: build.query<rolesResType, void>({
      providesTags: ['addRole'],
      query: () => {
        return {
          url: endPoints.roleEndPoint().pathname + '?needPagination=true'
        }
      }
    }),
    getAllRoleWithPagination: build.query<rolesResType, ArgsType>({
      providesTags: ['addRole'],
      query: (props) => {
        const url = setSearchParams(endPoints.roleEndPoint(), props)
        return {
          url: url.pathname + url.search
        }
      }
    }),
    getPrivileges: build.query<privilegesResType, void>({
      query: () => ({ url: endPoints.privilegesEndPoint().pathname })
    }),
    deleteRole: build.mutation({
      invalidatesTags: ['addRole'],
      query: (id) => ({
        url: `${endPoints.roleEndPoint().pathname}/${id}`,
        method: 'DELETE'
      })
    }),
    addRole: build.mutation({
      invalidatesTags: ['addRole'],
      query: ({ body }) => ({
        data: body,
        url: endPoints.roleEndPoint().pathname,
        method: 'POST'
      })
    }),
    getRoleById: build.query<rolesByIdResType, string>({
      query: (id) => ({ url: `${endPoints.roleEndPoint().pathname}/${id}` }),
      keepUnusedDataFor: 0
    }),
    updateRole: build.mutation({
      invalidatesTags: ['addRole'],
      query: ({ id, body }) => ({
        url: `${endPoints.roleEndPoint().pathname}/${id}`,
        method: 'PATCH',
        data: body
      })
    }),
    // get all categories
    getAllCategories: build.query<TCategoriesResType, void>({
      query: () => ({ url: endPoints.categoriesEndPoint().pathname })
    })
  })
})
export const {
  useGetAllRoleQuery,
  useGetAllRoleWithPaginationQuery,
  useGetPrivilegesQuery,
  useDeleteRoleMutation,
  useAddRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useGetAllCategoriesQuery
} = roleService
