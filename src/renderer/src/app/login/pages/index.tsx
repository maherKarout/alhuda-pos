import { Box, Grid } from "@mui/material";
import React from "react";
import MainCard from "src/components/cards/Main-card";
import LoginForm from "../components/login-form";
import loginLogo from "src/assets/images/loginLogo.png";
import loginBg from "src/assets/images/loginbg.png";
const Login = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: "100svh",
        backgroundImage: `url(${loginBg})`,
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
            <LoginForm />
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
};

export default Login;
