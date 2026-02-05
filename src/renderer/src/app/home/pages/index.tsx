import { Grid } from "@mui/material";

import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature } from "src/shared/privileges";
const Home = () => {
  return <Grid container spacing={2}></Grid>;
};

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.Statistics,
  type: "view",
})(Home);
