import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
} from "@material-ui/core";

// Material-UIアイコン取得
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";

// スタイルを適用する
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerLogo: {
      color: "inherit",
      marginRight: 20,
    },
    headerTitleStyle: {
      flexGrow: 1,
      color: "inherit",
    },
    menuButton: {
      color: "inherit",
      padding: "8px",
    },
    avatar: {
      margin: "8px",
    },
    drawerList: {
      width: 200,
      height: "100%",
    },
  })
);

function MyAppBar2() {
  // Drawerの状態
  const [isOpen, setOpen] = useState(false);

  // CSSを適用する。
  const classes = useStyles();

  // Drawerの状態を変更する関数。
  const toggleDrawerNav = () => {
    setOpen(!isOpen);
  };

  const closeDrawerNav = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* 上部のバー */}
      <AppBar position="static" aria-label="Global Navi">
        <Toolbar>
          <IconButton onClick={toggleDrawerNav} aria-label="SideMenu">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.headerLogo} variant="subtitle1">
            My Sample App
          </Typography>
          <Typography className={classes.headerTitleStyle} variant="subtitle1">
            Material UI test
          </Typography>
          <IconButton className={classes.menuButton} aria-label="Menu">
            <Avatar className={classes.avatar}></Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* サイドメニュー */}
      <Drawer open={isOpen} onClose={closeDrawerNav}>
        <div className={classes.drawerList}>
          <List>
            <ListItem button onClick={closeDrawerNav}>
              <ListItemIcon>{<HomeIcon />}</ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            <ListItem button onClick={closeDrawerNav}>
              <ListItemIcon>{<InfoIcon />}</ListItemIcon>
              <ListItemText primary={"Info"} />
            </ListItem>
            <ListItem button onClick={closeDrawerNav}>
              <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
              <ListItemText primary={"Setting"} />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
    </React.Fragment>
  );
}

export default MyAppBar2;
