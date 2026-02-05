import { setSearchParams } from "src/helpers/set-search-params";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";



const apiService = api.enhanceEndpoints({ addTagTypes: [] }).injectEndpoints({
  endpoints: (build) => ({}),
});
export const {} = apiService;
