import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
let navigateTo: NavigateFunction;
function NavigationComponent() {
  const navigate = useNavigate();
  navigateTo = navigate;
  return <></>;
}
export { navigateTo };
export default NavigationComponent;
