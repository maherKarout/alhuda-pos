import appRoutesUnprotected from "src/app/app-unprotected-routes";
import Login from "src/app/login/pages";
import AuthLayout from "src/layout/authLayout";

const UnprotectedRoutes = {
  path: "/",
  element: <AuthLayout />,
  children: [...appRoutesUnprotected],
};
export default UnprotectedRoutes;
