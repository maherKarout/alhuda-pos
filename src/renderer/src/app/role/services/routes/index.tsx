import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
const EditRole = SuspenseWrapper(
  lazy(() => import("src/app/role/pages/edit-role"))
);
const RoleDetails = SuspenseWrapper(
  lazy(() => import("src/app/role/pages/role-details"))
);
const AddRole = SuspenseWrapper(
  lazy(() => import("src/app/role/pages/add-role"))
);
const AllRoles = SuspenseWrapper(
  lazy(() => import("src/app/role/pages/all-roles"))
);

export default [
  {
    path: "/roles",
    element: <AllRoles />,
  },
  {
    path: "/roles/add",
    element: <AddRole />,
  },
  {
    path: "/roles/:id",
    element: <RoleDetails />,
  },
  {
    path: "/roles/edit/:id",
    element: <EditRole />,
  },
] as RouteObject[];
