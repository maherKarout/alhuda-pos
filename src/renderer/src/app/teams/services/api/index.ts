import { setSearchParams } from "src/helpers/set-search-params";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";
type teamType = {
  id: string;
  location: string;
  posAdmin: any | null;
};
type resType = {
  totalRecords: number;
  data: teamType[];
};

const apiService = api.enhanceEndpoints({ addTagTypes: [] }).injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query<resType, ArgsType>({
      query: (args) => {
        const url = setSearchParams(endPoints.posEndPoint(), args);
        return { url: url.pathname + url.search };
      },
    }),
    addTeam: build.mutation({
      query: (data) => ({
        url: endPoints.posEndPoint().pathname,
        data,
        method: "POST",
      }),
    }),
    updateOperatorPassword: build.mutation<void, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${endPoints.posEndPoint().pathname}/changePassword/${id}`,
        method: "PATCH",
        data,
      }),
    }),
  }),
});
export const { useAddTeamMutation, useGetTeamsQuery, useUpdateOperatorPasswordMutation } = apiService;
