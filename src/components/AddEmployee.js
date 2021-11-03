import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiCalendar } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
// import "../css/Employee.css"
import * as Constants from "./Constant";
// import "../css/Employee"

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: "",
      FamilyName: "",
      Title: "",
      PrimaryPhone: "",
      familyName: "",
      CountrySubDivisionCode: "",
      City: "",
      PostalCode: "",
      Line1: "",
      email: "",
      HiredDate: new Date(),
      ReleasedDate: new Date()
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleHireDateChange = date => {
    this.setState({
      HiredDate: date
    });
  };

  handleEndDateChange = date => {
    this.setState({
      ReleasedDate: date
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    var self = this;
    self.setState({ loading: true });

    var url = Constants.BASE_URL + "employee/register";
    var payload = {
      token: localStorage.getItem("access-token"),
      FirstName: self.state.FirstName,
      FamilyName: self.state.FamilyName,
      Title: self.state.Title,
      PrimaryPhone: self.state.PrimaryPhone,
      familyName: self.state.familyName,
      CountrySubDivisionCode: self.state.CountrySubDivisionCode,
      City: self.state.City,
      PostalCode: self.state.PostalCode,
      Line1: self.state.Line1,
      email: self.state.email,
      HiredDate: self.state.HiredDate,
      ReleasedDate: self.state.ReleasedDate
    };

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data.success) {
          ToastsStore.success("Employee created successfully.");
          window.location.reload();
        } else {
          self.setState({ loading: false });
          ToastsStore.error(response.data.message);
        }
      })
      .catch(function(error) {
        self.setState({ loading: false });
        ToastsStore.error(error.message);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid mt--7 bg-secondary">
          <div className="card bg-secondary shadow">
            <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8">
                  <h3 className="mb-0">Add Employee</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <h6 className="heading-small text-muted mb-4 text-left">
                  Employee information
                </h6>
                <div className="pl-lg-4">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="form-group text-left">
                        <label className="form-control-label text-right" for="input-title">
                          Title
                        </label>
                        <input
                          type="text"
                          id="input-title"
                          className="form-control form-control-alternative"
                          placeholder="Title"
                          name="Title"
                          value={this.state.Title}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-first-name"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="input-first-name"
                          className="form-control form-control-alternative"
                          placeholder="First Name"
                          name="FirstName"
                          value={this.state.FirstName}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-last-name"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="input-last-name"
                          className="form-control form-control-alternative"
                          placeholder="Last Name"
                          name="FamilyName"
                          value={this.state.FamilyName}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label" for="input-email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="input-email"
                          className="form-control form-control-alternative"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-mobile"
                        >
                          Mobile
                        </label>
                        <input
                          type="number"
                          id="input-mobile"
                          className="form-control form-control-alternative"
                          placeholder="Mobile"
                          name="PrimaryPhone"
                          value={this.state.PrimaryPhone}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                <h6 className="heading-small text-muted mb-4">
                  Contact information
                </h6>
                <div className="pl-lg-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-address"
                        >
                          Address
                        </label>
                        <input
                          id="input-address"
                          className="form-control form-control-alternative"
                          placeholder="Home Address"
                          name="Line1"
                          value={this.state.Line1}
                          onChange={this.handleChange}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="form-control-label" for="input-City">
                          City
                        </label>
                        <input
                          type="text"
                          id="input-City"
                          className="form-control form-control-alternative"
                          placeholder="City"
                          name="City"
                          value={this.state.City}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-country"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          id="input-country"
                          className="form-control form-control-alternative"
                          placeholder="Country"
                          name="CountrySubDivisionCode"
                          value={this.state.CountrySubDivisionCode}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-country"
                        >
                          Postal code
                        </label>
                        <input
                          type="number"
                          id="input-postal-code"
                          className="form-control form-control-alternative"
                          placeholder="Postal code"
                          name="PostalCode"
                          value={this.state.PostalCode}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-country"
                        >
                          Hire Date
                        </label>
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <Icon
                                path={mdiCalendar}
                                title="calendar"
                                size={0.9}
                                horizontal
                                vertical
                                rotate={180}
                                color="#5e72e4"
                                className="mr-2"
                              />
                            </span>
                          </div>
                          <DatePicker
                            className="form-control datepicker"
                            selected={this.state.HiredDate}
                            onChange={this.handleHireDateChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label
                          className="form-control-label"
                          for="input-country"
                        >
                          End Date
                        </label>
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <Icon
                                path={mdiCalendar}
                                title="calendar"
                                size={0.9}
                                horizontal
                                vertical
                                rotate={180}
                                color="#5e72e4"
                                className="mr-2"
                              />
                            </span>
                          </div>
                          <DatePicker
                            className="form-control datepicker"
                            selected={this.state.ReleasedDate}
                            onChange={this.handleEndDateChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-lg btn-primary btn-block text-uppercase mb-4"
                  type="submit"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddEmployee;
