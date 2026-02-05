import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
const ChangeMyPassword = SuspenseWrapper(
  lazy(() => import("src/app/update-me/pages/change-my-password"))
);

const UpdateMyInfo = SuspenseWrapper(
  lazy(() => import("src/app/update-me/pages/update-my-info"))
);

export default [
  {
    path: "/Update-my-info",
    element: <UpdateMyInfo />,
  },
  {
    path: "/change-my-password",
    element: <ChangeMyPassword />,
  },
] as RouteObject[];
