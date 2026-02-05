import React from "react";
import { Grid, Box } from "@mui/material";
import MainCard from "src/components/cards/Main-card";
import ChangePasswordForm from "../components/change-password-form";
import loginLogo from "src/assets/images/loginLogo.png";
import changePasswordBg from "src/assets/images/loginbg.png";
function ChangePasswordPage() {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: "100svh",
        backgroundImage: `url('${changePasswordBg}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: { md: "100vw 50vh", xs: "160vw 35vh" },
        backgroundPosition: "center top",
      }}
    >
      <Grid component="div" size={{ xs: 12 }}>
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          sx={{ minHeight: "calc(100vh - 68px)" }}
        >
          <Grid component="div" size={{ xs: 12, md: 6, lg: 4, xl: 3 }} sx={{ p: { xs: 2, md: 0 } }}>
            <ChangePasswordForm />
          </Grid>
          <Grid
            component="div"
            size={{ xs: 12, md: 4 }}
            sx={{ display: { md: "block", xs: "none" } }}
          >
            <img src={loginLogo} alt="" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChangePasswordPage;
