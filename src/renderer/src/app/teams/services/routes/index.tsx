import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
import { routeName } from "src/shared/routeName";

// const EditTeams = SuspenseWrapper(lazy(() => import("src/app/teams/pages/edit-teams")));
const AllTeams = SuspenseWrapper(lazy(() => import("src/app/teams/pages/all-teams")));
const AddTeams = SuspenseWrapper(lazy(() => import("src/app/teams/pages/add-teams")));

const routes: RouteObject[] = [
  {
    path: routeName.POS,
    element: <AllTeams />,
  },
  {
    path: routeName.POS + "/add",
    element: <AddTeams />,
  },
  // {
  //   path: routeName.POS + "/:id",
  //   element: <EditTeams />,
  // },
];

export default routes;
