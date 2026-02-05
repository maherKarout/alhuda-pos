import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
import { routeName } from "src/shared/routeName";

const CasherScreenDetails = SuspenseWrapper(lazy(() => import("src/app/casher-screen/pages/casher-screen")));

const routes: RouteObject[] = [
  {
    path: routeName.CASHER_SCREEN + "/:customer_id_order",
    element: <CasherScreenDetails />,
  },
  {
    path: routeName.CASHER_SCREEN ,
    element: <CasherScreenDetails />,
  },
];

export default routes;
