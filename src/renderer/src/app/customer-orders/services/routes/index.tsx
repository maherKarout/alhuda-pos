import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";
import { routeName } from "src/shared/routeName";

const AllCustomerOrders = SuspenseWrapper(lazy(() => import("src/app/customer-orders/pages/all-customer-orders")));


const routes: RouteObject[] = [
  {
    path: routeName.CUSTOMER_ORDERS,
    element: <AllCustomerOrders />,
  },


];

export default routes;