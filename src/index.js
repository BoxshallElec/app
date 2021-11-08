import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ChangePassword from "./components/ChangePassword";
import AddEmployee from "./components/AddEmployee";
import "./css/argon.min.css";
import "./css/index.css";
import "argon-design-system-free/assets/vendor/headroom/headroom.min.js";
import "argon-design-system-free/assets/js/argon.js?v=1.1.0";
import "./css/argon-dashboard.min.css";
import "@creative-tim-official/argon-dashboard-free/assets/js/argon-dashboard.min.js";
import "@creative-tim-official/argon-dashboard-free/assets/js/plugins/nucleo/css/nucleo.css";
import * as serviceWorker from "./serviceWorker";
import { ConfirmDialogProvider } from "./components/common/ConfirmDialogProvide";

ReactDOM.render(
  <ConfirmDialogProvider>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={AddEmployee} />
        <PrivateRoute exact path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/" component={Login} />
        <PrivateRoute exact path="" component={Login} />
      </Switch>
    </Router>
  </ConfirmDialogProvider>,
  document.getElementById("root")
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: "/register", state: { from: props.location } }}
            />
          )
      }
    />
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
