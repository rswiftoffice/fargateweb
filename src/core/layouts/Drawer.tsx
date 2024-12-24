import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Outlet, useNavigate } from "react-router-dom";
import MainMenu from "./MainMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { AccountCircle } from "@mui/icons-material";
import { Chip, Badge, Menu, MenuItem } from "@mui/material";
import { getRoleName } from "core/utils/getRoleName";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { setCurrentRole, setLogin } from "modules/login/loginSlice";
import { UserRoles } from "core/types/db-enum";
import useLocalStorage from "core/hooks/useLocalStorage";
import MuiDrawer from "@mui/material/Drawer";
import { useEffect } from "react";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type Props = {
  onMenuItemClick: (menuKey: string) => void;
};

export default function AppDrawer({ onMenuItemClick }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const title = useSelector((state: RootState) => state.layout.pageTitle);
  const dispatch = useDispatch<AppDispatch>();
  const [token, setToken] = useLocalStorage<string>("access_token", "");
  const navigate = useNavigate();
  const [savedCurrentRole, setSavedCurrentRole] =
    useLocalStorage<UserRoles | null>("current_role", null);

  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const userRoles = useSelector(
    (state: RootState) => state.login.authenticatedUser?.roles ?? []
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleSelect = (role: UserRoles) => {
    handleClose();
    dispatch(setCurrentRole(role));
  };

  const onLogout = async () => {
    setToken("");
    setSavedCurrentRole(null);
    dispatch(setLogin(false));
    navigate("/login");
  };

  useEffect(() => {
    setSavedCurrentRole(currentRole);
  }, [currentRole, setSavedCurrentRole]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar sx={{backgroundColor:"#070b1c !important"}} position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* Right side content */}
          <div>
            {currentRole && (
              <Chip
                label={getRoleName(currentRole)}
                color="success"
                variant="outlined"
              />
            )}
          </div>
          {userRoles && userRoles?.length > 1 && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Badge
                  badgeContent={(userRoles?.length || 1) - 1 || 0}
                  color="info"
                >
                  <AccountCircle />
                </Badge>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {userRoles &&
                  userRoles
                    //@ts-ignore
                    .filter((role) => role !== currentRole)
                    .map((role) => (
                      <MenuItem
                        onClick={() => {
                          handleRoleSelect(role);
                        }}
                        key={role!}
                        dense
                      >
                        {getRoleName(role)}
                      </MenuItem>
                    ))}
              </Menu>
            </div>
          )}
          <IconButton color="secondary" onClick={onLogout}>
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <MainMenu />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: "auto" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
