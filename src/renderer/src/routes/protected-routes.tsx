import SuspenseWrapper from "src/components/suspenseWrapper";
import { lazy } from "react";
import appRoutes from "src/app/app-protected-routes";
const MainLayout = SuspenseWrapper(lazy(() => import("src/layout/mainLayout")));

const ProtectedRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...appRoutes,
      {
        path: "*",
        element: <></>,
      },
    ],
  },
];

export default ProtectedRoutes;
