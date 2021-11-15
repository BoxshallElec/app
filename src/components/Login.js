import React, { Component } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiInstagram,
  mdiFacebook,
  mdiTwitter,
  mdiKey,
} from "@mdi/js";
import axios from "axios";
import ReactLoading from "react-loading";
import * as Constants from "./Constant";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
const logo = require("../images/logo-black.png");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    var self = this;

    self.setState({ loading: true });

    var payload = {
      email: this.state.email,
      password: this.state.password,
    };

    var url = Constants.BASE_URL + "employee/login";
    console.log("URL:out");
    console.log(url);
    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          console.log("URL:");
          console.log(url);
	  console.log("Response");
	  console.log(response.data);
          var displayName = response.data.employee.DisplayName
            ? response.data.employee.DisplayName
            : response.data.employee.displayName;
          var access = response.data.employee.access
            ? response.data.employee.access
            : response.data.access
            ? response.data.access
            : [];
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", displayName);
          localStorage.setItem("access", access);
          localStorage.setItem(
            "role",
            response.data.employee["user_type"]
              ? response.data.employee["user_type"]
              : response.data.employee["type"]
              ? response.data.employee["type"]
              : ""
          );
          if (response.data.employee.isFirstTime) {
            self.props.history.push("/changePassword");
          } else {
            self.props.history.push("/");
          }
        } else {
          self.setState({ loading: false });
          ToastsStore.error(response.data.message);
        }
      })
      .catch(function (error) {
        self.setState({ loading: false });
        ToastsStore.error(error.message);
        console.log("error");
	console.log(error.response.data.message);
      });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return this.state.isLoading ? (
      <div className="centered">
        <ReactLoading
          type="spin"
          color="#2B70A0"
          height={"64px"}
          width={"64px"}
        />
      </div>
    ) : (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <main>
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5">
                  <div className="card bg-secondary shadow border-0">
                    <div className="card-header bg-white text-center">
                      <img src={logo} height="80px" alt="Logo" />
                    </div>
                    <div className="card-body px-lg-5 py-lg-2">
                      <div className="text-center text-muted mb-4">
                        <small>sign in with credentials</small>
                      </div>
                      <form htmlFor="form" onSubmit={this.handleSubmit}>
                        <div className="form-group mb-3">
                          <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <Icon
                                  path={mdiEmail}
                                  title="User Profile"
                                  size={1}
                                  horizontal
                                  vertical
                                  rotate={180}
                                  color="#9e9e9e"
                                />
                              </span>
                            </div>
                            <input
                              className="form-control"
                              placeholder="Email"
                              type="email"
                              name="email"
                              value={this.state.email}
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <Icon
                                  path={mdiKey}
                                  title="User Profile"
                                  size={1}
                                  horizontal
                                  vertical
                                  rotate={180}
                                  color="#9e9e9e"
                                />
                              </span>
                            </div>
                            <input
                              className="form-control"
                              placeholder="Password"
                              type="password"
                              name="password"
                              value={this.state.password}
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input
                            className="custom-control-input"
                            id=" customCheckLogin"
                            type="checkbox"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor=" customCheckLogin"
                          >
                            <span>Remember me</span>
                          </label>
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-primary my-4"
                          >
                            Sign in
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col text-right">
                      <a href="/" className="text-light">
                        <small>Forgot Password?</small>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="row row-grid align-items-center mb-5">
              <div className="col-lg-6">
                <h3 className="text-primary font-weight-light mb-2">
                  Thank you for supporting us!
                </h3>
                <h4 className="mb-0 font-weight-light">
                  Let's get in touch on any of these platforms.
                </h4>
              </div>
              <div className="col-lg-6 text-lg-center btn-wrapper">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/csa"
                  className="btn btn-neutral btn-icon-only btn-twitter btn-round btn-lg"
                  data-toggle="tooltip"
                  data-original-title="Follow us"
                >
                  <Icon
                    path={mdiTwitter}
                    title="User Profile"
                    size={1}
                    horizontal
                    vertical
                    rotate={180}
                    color="#fff"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/csa"
                  className="btn btn-neutral btn-icon-only btn-facebook btn-round btn-lg"
                  data-toggle="tooltip"
                  data-original-title="Like us"
                >
                  <Icon
                    path={mdiFacebook}
                    title="User Profile"
                    size={1}
                    horizontal
                    vertical
                    rotate={180}
                    color="#fff"
                  />
                </a>
                <a
                  target="_blank"
                  href="/"
                  className="btn btn-neutral btn-icon-only btn-dribbble btn-lg btn-round"
                  data-toggle="tooltip"
                  data-original-title="Follow us"
                >
                  <Icon
                    path={mdiInstagram}
                    title="User Profile"
                    size={1}
                    horizontal
                    vertical
                    rotate={180}
                    color="#fff"
                  />
                </a>
              </div>
            </div>
            <hr />
            <div className="row align-items-center justify-content-md-between">
              <div className="col-md-6">
                <div className="copyright">
                  &copy; 2019
                  <a href="/" target="_blank">
                    Verd
                  </a>
                  .
                </div>
              </div>
              <div className="col-md-6">
                <ul className="nav nav-footer justify-content-end">
                  <li className="nav-item">
                    <a href="/" className="nav-link" target="_blank">
                      Verd
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/" className="nav-link" target="_blank">
                      About Us
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/" className="nav-link" target="_blank">
                      License
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Login;
