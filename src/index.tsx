import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AppState from "./state";
import ListState from "./state/List";
import CardState from "./state/Card";

ReactDOM.render(
  <React.StrictMode>
    <CardState.Provider>
      <ListState.Provider>
        <AppState.Provider>
          <App />
        </AppState.Provider>
      </ListState.Provider>
    </CardState.Provider>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);
