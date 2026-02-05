import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
const apiService = api.enhanceEndpoints({ addTagTypes: [] }).injectEndpoints({
  endpoints: (build) => ({
    updatePassword: build.mutation({
      query: (body) => ({
        url: endPoints.updatePassword().pathname,
        method: "PATCH",
        data: body,
      }),
    }),
  }),
});
export const { useUpdatePasswordMutation } = apiService;
