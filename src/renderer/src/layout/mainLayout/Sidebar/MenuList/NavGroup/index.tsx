
// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, List, Typography } from "@mui/material";

// project imports
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useTranslation } from "react-i18next";
import { privilegeKeys } from "src/shared/privileges";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }: any) => {
  const theme: any = useTheme();
  const { t } = useTranslation("translation");
  const { account } = useAppSelector((state) => state.auth);
  const privileges = account?.privileges ?? [];
  // menu list collapse & items
  const items = item.children?.map((menu: any) => {
    switch (menu.type) {
      case "collapse": {
        if (
          privileges.some((e) => menu.privileges.includes(e)) ||
          menu?.privileges?.includes(privilegeKeys.all)
        )
          return <NavCollapse key={menu.id} menu={menu} level={1} />;
        else return <></>;
      }
      case "item": {
        if (
          privileges.some((e) => menu.privileges.includes(e)) ||
          menu?.privileges?.includes(privilegeKeys.all)
        )
          return <NavItem key={menu.id} item={menu} level={1} />;
        else return <></>;
      }
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.menuCaption }}
              display="block"
              gutterBottom
            >
              {t(item.title)}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{ ...theme.typography.subMenuCaption }}
                  display="block"
                  gutterBottom
                >
                  {t(item.caption)}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
};


export default NavGroup;
