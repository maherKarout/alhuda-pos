import { privilegeKeys } from "src/shared/privileges";
import { menuItemType } from "src/types";
// import HomeIcon from '@mui/icons-material/Home';
import HomeIcon from "src/assets/images/sidebar-icons/home.svg";
export default [
  {
    id: "homeManagement",
    title: "",
    icon: HomeIcon,

    privileges: [privilegeKeys.viewStatistics],
    caption: "",
    type: "group",
    children: [
      {
        id: "home",
        title: "home",
        type: "item",
        icon: HomeIcon,
        privileges: [privilegeKeys.viewStatistics],
        url: "/",
      },
    ],
  },
] as menuItemType[];
