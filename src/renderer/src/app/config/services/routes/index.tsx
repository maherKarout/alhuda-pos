import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
import { routeName } from "src/shared/routeName";

const EditConfig = SuspenseWrapper(lazy(() => import("src/app/config/pages/edit-config")));



const routes: RouteObject[] = [

  {
    path: `${routeName.CONFIG}`,
    element: <EditConfig />,
  },

];

export default routes;