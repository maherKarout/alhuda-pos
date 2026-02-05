// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery, Typography } from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
import useGetIsRtlDirection from "src/hooks/use-get-is-rtl-direction";
import useGetDirection from "src/hooks/use-get-direction";

// ==============================|| SIDEBAR DRAWER ||============================== //
const drawerWidth = 100;
const Sidebar = ({ drawerOpen, drawerToggle }: any) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const isRtl = useGetIsRtlDirection();
  const dir = useGetDirection();
  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "block" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <Box
          sx={{
            margin: matchUpMd ? " 0 0 120px 0" : "0 0 50px 0",
            paddingLeft: "5px",
            paddingRight: "5px",
            touchAction: "none", 
          }}
        >
          <MenuList />
        </Box>
        {/* </PerfectScrollbar> */}
      </BrowserView>
      <MobileView>
        <Box dir={dir} sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : "auto" }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={matchUpMd ? "persistent" : "temporary"}
        // anchor={isRtl ? "right" : "left"}
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "0px",
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
        PaperProps={{ style: isRtl ? { left: "unset", right: 0 } : { right: 0 } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
