import { useRoutes } from "react-router-dom";
import ProtectedRoutes from "./protected-routes";
import UnprotectedRoutes from "./unprotected-routes";

function Routes() {
  return useRoutes([...ProtectedRoutes, UnprotectedRoutes]);
}
export default Routes;
