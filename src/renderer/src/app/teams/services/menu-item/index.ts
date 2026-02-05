import { privilegeKeys } from "src/shared/privileges";
import { routeName } from "src/shared/routeName";
import { menuItemType } from "src/types";
import POS from "src/assets/images/sidebar-icons/POS.svg";

export default [
  {
    id: "POS",
    title: "",
    privileges: [privilegeKeys.viewPOS, privilegeKeys.createPOS, privilegeKeys.updatePOS, privilegeKeys.deletePOS],
    caption: "",
    type: "group",
    url: "",
    children: [
      {
        id: "POS",
        title: "POS",
        privileges: [privilegeKeys.viewPOS, privilegeKeys.createPOS, privilegeKeys.updatePOS, privilegeKeys.deletePOS],
        caption: "",
        type: "item",
        url: routeName.POS,
        icon: POS,
      },
    ],
    icon: null,
  },
] as menuItemType[];
