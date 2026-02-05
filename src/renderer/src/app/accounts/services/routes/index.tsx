import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
const EditAccount = SuspenseWrapper(lazy(() => import("src/app/accounts/pages/edit-account")));
const AddAccount = SuspenseWrapper(lazy(() => import("src/app/accounts/pages/add-account")));
const AllAccounts = SuspenseWrapper(lazy(() => import("src/app/accounts/pages/all-accounts")));

export default [
  {
    path: "/accounts",
    element: <AllAccounts />,
  },
  {
    path: "/accounts/add",
    element: <AddAccount />,
  },
  {
    path: "/accounts/:id",
    element: <EditAccount />,
  },
] as RouteObject[];
