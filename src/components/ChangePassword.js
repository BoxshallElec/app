import React, { Component } from "react";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import "../css/index.css";
import * as Constants from "./Constant";
import Moment from "moment";
import Footer from "./Footer";
import ReactLoading from "react-loading";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      password: "",
      confirmPassword: "",
      oldPassword: ""
    };
  }

  componentDidMount() {
    Moment.locale("en");
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangePassword = event => {
    event.preventDefault();
    var self = this;

    if (this.state.confirmPassword === this.state.password) {
      var payload = {
        password: this.state.password,
        oldPassword: this.state.oldPassword,
        token: localStorage.getItem("token")
      };

      self.setState({ isLoading: true });

      var url = Constants.BASE_URL + "employee/changePassword";

      axios
        .post(url, payload)
        .then(function (response) {
          if (response.data.success) {
            ToastsStore.success("Password updated successfully");
            localStorage.setItem("token", response.data.token);
            self.props.history.push("/");
          } else {
            self.setState({ isLoading: false });
            ToastsStore.error("Error occured while updating password");
          }
        })
        .catch(function (error) {
          self.setState({ isLoading: false });
          ToastsStore.error(error.message);
        });
    } else {
      ToastsStore.error("Password and confirm password must match");
    }
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

          <div className="main-content">
            <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8"></div>
            <div className="container-fluid mt-165">
              <div className="row justify-content-center">
                <div className="col-lg-5 col-md-5">
                  <div className="card shadow">
                    <div className="card-body p-4 m-4">
                      <h4 className="mb-4">Change Password</h4>
                      <form htmlFor="form" onSubmit={this.handleChangePassword}>
                        <div className="form-group">
                          <div className="input-group input-group-alternative">
                            <input
                              className="form-control"
                              placeholder="Old Password"
                              type="password"
                              required
                              name="oldPassword"
                              value={this.state.oldPassword}
                              onChange={this.handleChange}
                              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-alternative">
                            <input
                              className="form-control"
                              placeholder="Password"
                              type="password"
                              required
                              name="password"
                              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                              value={this.state.password}
                              onChange={this.handleChange}
                              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-alternative">
                            <input
                              className="form-control"
                              placeholder="Confirm Password"
                              type="password"
                              required
                              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                              name="confirmPassword"
                              value={this.state.confirmPassword}
                              onChange={this.handleChange}
                              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            />
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-link"
                            data-dismiss="modal"
                          >
                            Cancel
                        </button>
                          <button type="submit" className="btn btn-primary">
                            Confirm
                        </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>
          </div>
        </React.Fragment>
      );
  }
}

export default ChangePassword;
