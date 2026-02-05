import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
type meRes = {
  id: string;
  username: string;
  email: string;
  isActive: true;
  type: string;
  changePassword: false;
  operator: {
    image: null;
    firstName: string;
    lastName: string;
  };
  privileges: string[];
  phoneNumber: string;
};
const apiService = api.enhanceEndpoints({ addTagTypes: [] }).injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<{ data: meRes }, void>({
      query: () => ({ url: endPoints.meEnPoint().pathname }),
    }),
    updateMe: build.mutation({
      query: (body) => ({
        url: endPoints.updateMe().pathname,
        method: "PATCH",
        data: body,
      }),
    }),
  }),
});
export const { useGetMeQuery, useUpdateMeMutation } = apiService;
