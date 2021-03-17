import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import MyAppBar from "./MyAppBar";
import MainContent from "./MainContent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      // marginTop: theme.spacing.unit,
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      // padding: theme.spacing.unit * 3,
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <MyAppBar />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <MainContent />
        </main>
      </div>
    </>
  );
};
export default App;
