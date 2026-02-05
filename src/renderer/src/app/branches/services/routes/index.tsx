import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";

const EditBranches = SuspenseWrapper(lazy(() => import("src/app/branches/pages/edit-branches")));
const AllBranches = SuspenseWrapper(lazy(() => import("src/app/branches/pages/all-branches")));
const AddBranches = SuspenseWrapper(lazy(() => import("src/app/branches/pages/add-branches")));


const routes: RouteObject[] = [
  {
    path: "/branches",
    element: <AllBranches />,
  },
  {
    path: "/branches/add",
    element: <AddBranches />,
  },
  {
    path: "/branches/edit/:id",
    element: <EditBranches />,
  },
  
];

export default routes;