import { store } from "src/redux-config/store";
import { privilegeKeys } from "src/shared/privileges";

export const isPrivilegesIncludes = (privilege: privilegeKeys) => {
  return store.getState().auth.account?.privileges.includes(privilege);
};
