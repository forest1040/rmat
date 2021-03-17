import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
//import red from "@material-ui/core/colors/red";

import "./App.css";
import Home from "./Home";
import BoardList from "./BoardList";
import Board from "./Board";

// 独自のテーマを作成する
const theme = createMuiTheme({
  palette: {
    // type: "dark", // ダークテーマ
    primary: green,
    // primary: red,
  },
  typography: {
    fontFamily: ["Noto Sans", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontSize: "1.75rem",
    },
    h2: {
      fontSize: "1.5rem",
    },
    h3: {
      fontSize: "1.25rem",
    },
    h4: {
      fontSize: "1.125rem",
    },
    h5: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "1rem",
    },
  },
});

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/boards" component={BoardList} />
          <Route path="/board" component={Board} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
