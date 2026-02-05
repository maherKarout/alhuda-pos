import { privilegeKeys } from "src/shared/privileges";
import { paginationStringConcatenation } from "src/helpers/pagination-string-concatenation";
import { menuItemType } from "src/types";
import AccountsIcon from "src/assets/images/sidebar-icons/users.svg";
export default [
  {
    id: "accounts management",
    title: "",
    privileges: [privilegeKeys.viewOperator, privilegeKeys.viewRole],
    caption: "",
    type: "group",
    children: [
      {
        id: "accounts",
        title: "accounts",
        privileges: [privilegeKeys.viewOperator],
        type: "item",
        url: paginationStringConcatenation("/accounts"),

        icon: AccountsIcon,
      },
      {
        id: "roles",
        title: "roles",
        privileges: [privilegeKeys.viewRole],
        type: "item",
        url: paginationStringConcatenation("/roles"),

        icon: AccountsIcon,
      },
    ],
  },
] as menuItemType[];
