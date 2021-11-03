import React, { Component } from "react";
import Icon from "@mdi/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mdiPlus, mdiDotsVertical, mdiCalendar } from "@mdi/js";
import axios from "axios";
import "../css/Employees.css";
import * as Constants from "./Constant";
import EmployeeRatesMain from "./employee/EmployeeRatesMain";
import {
  ToastsStore,
  ToastsContainerPosition,
  ToastsContainer,
} from "react-toasts";
import EmployeeTimeSheets from "./employee/EmployeeTimesheet";
import EmployeeExpenses from "./employee/EmployeeExpense";
import EmployeeAddress from "./employee/EmployeeAddress";
import EmloyeeProjects from "./employee/EmployeeProject";
import EmployeeProject from "./employee/EmployeeProject";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: "",
      FamilyName: "",
      Title: "Mr",
      PrimaryPhone: "",
      CountrySubDivisionCode: "",
      City: "",
      PostalCode: "",
      Line1: "",
      email: "",
      HiredDate: new Date(),
      ReleasedDate: new Date(),
      employees: [],
      selectedEmployeeId: undefined,
      selectedTabIndex: 0,
      employeeExtended: "",
    };
  }

  componentDidMount() {
    var self = this;

    var payload = {
      token: localStorage.getItem("token"),
    };

    var url = Constants.BASE_URL + "employee/list";

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          self.setState({
            employees: response.data.data,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleApproverChange = (event, employeeId) => {
    var url = Constants.BASE_URL + "employee/setApprover";
    var payload = {
      token: localStorage.getItem("access-token"),
      approverId: event.target.value,
      employeeId: employeeId,
    };
    axios.post(url, payload).then(function (response) {
      if (response.data.success) {
        ToastsStore.success("Approver changed successfully", "success");
      }
    });
    this.setState({ [event.target.name]: event.target.value });
  };

  handleHireDateChange = (date) => {
    this.setState({
      HiredDate: date,
    });
  };

  handleEndDateChange = (date) => {
    this.setState({
      ReleasedDate: date,
    });
  };

  handleTypeChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleEditEmployee = (index) => {
    let employee = { ...this.state.employees[index] };
    // let possibleApprovers = this.state.employees.filter(
    //   (emp) => emp["_id"] != employee["_id"]
    // );
    let possibleApprovers = this.state.employees;
    this.setState(
      {
        FirstName: employee.FirstName || "",
        FamilyName: employee.FamilyName || "",
        Title: employee.Title,
        PrimaryPhone: employee.PrimaryPhone.FreeFormNumber,
        CountrySubDivisionCode: employee.PrimaryAddr.CountrySubDivisionCode,
        City: employee.PrimaryAddr.City,
        PostalCode: employee.PrimaryAddr.PostalCode,
        Line1: employee.PrimaryAddr.Line1,
        email: employee.email,
        HiredDate: employee.HiredDate ? new Date(employee.HiredDate) : "",
        ReleasedDate: employee.ReleasedDate
          ? new Date(employee.ReleasedDate)
          : "",
        selectedEmployeeId: employee._id,
        possibleApprovers: possibleApprovers,
        approverId: employee.employeeExtended
          ? employee.employeeExtended["approverId"]
            ? employee.employeeExtended["approverId"]
            : ""
          : "",
        DisplayName: employee.DisplayName,
      },
      () => {
        window.$("#call-modal-form").modal("show");
      }
    );
  };

  handleOpenEmployeeDialog = () => {
    this.setState(
      {
        FirstName: "",
        FamilyName: "",
        Title: "",
        PrimaryPhone: "",
        CountrySubDivisionCode: "",
        City: "",
        PostalCode: "",
        Line1: "",
        email: "",
        HiredDate: new Date(),
        ReleasedDate: new Date(),
        selectedEmployeeId: undefined,
      },
      () => {
        window.$("#call-modal-form").modal("show");
      }
    );
  };

  handleSubmit = (event) => {
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
      CountrySubDivisionCode: self.state.CountrySubDivisionCode,
      City: self.state.City,
      PostalCode: self.state.PostalCode,
      Line1: self.state.Line1,
      email: self.state.email,
      HiredDate: self.state.HiredDate,
      ReleasedDate: self.state.ReleasedDate,
    };

    window.$("#call-modal-form").modal("hide");

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          window.location.reload();
        } else {
          self.setState({
            FirstName: "",
            FamilyName: "",
            Title: "",
            PrimaryPhone: "",
            CountrySubDivisionCode: "",
            City: "",
            PostalCode: "",
            Line1: "",
            email: "",
            HiredDate: new Date(),
            ReleasedDate: new Date(),
            employees: self.state.employees.concat([response.data.data]),
            selectedEmployeeId: undefined,
          });
        }
      })
      .catch(function (error) {
        self.setState({ loading: false });
      });
  };

  setActiveIndex = (index) => {
    this.setState({
      selectedTabIndex: index,
    });
  };

  handleCloseDialog = () => {
    window.$("#call-modal-form").modal("hide");
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <div className="text-right">
          <button
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
          >
            <span className="btn-inner--icon">
              <Icon
                path={mdiPlus}
                title="Dashboard"
                size={1}
                horizontal
                vertical
                rotate={180}
                color="#ffffff"
              />
            </span>

            <span
              onClick={() => this.handleOpenEmployeeDialog()}
              className="btn-inner--text"
            >
              Add Employee
            </span>
          </button>
          <div
            className="modal fade"
            id="call-modal-form"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modal-form"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal- modal-dialog-centered modal-lg full-page-dialog"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body p-0">
                  <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                      <div className="row align-items-center">
                        <div className="col-12">
                          <h3 className="mb-0 text-center">
                            {this.state.selectedEmployeeId
                              ? "Edit Employee"
                              : "Add Employee"}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-body text-left employee-dialog-body">
                      {this.state.selectedEmployeeId && (
                        <ul className="nav nav-pills">
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(0)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 0
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              General
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(1)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 1
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              Projects
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(2)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 2
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              Accounting
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(3)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 3
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              Expenses
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(4)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 4
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              Time Sheets
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            onClick={() => this.setActiveIndex(5)}
                          >
                            <a
                              className={`nav-link ${
                                this.state.selectedTabIndex === 5
                                  ? "active"
                                  : ""
                              }`}
                              href="#"
                            >
                              Address
                            </a>
                          </li>
                        </ul>
                      )}

                      <br />

                      {/* <h1>selected tab index {this.state.selectedTabIndex}</h1> */}
                      {this.state.selectedTabIndex === 1 && (
                        <EmployeeProject
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}

                      {this.state.selectedTabIndex === 2 && (
                        <EmployeeRatesMain
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 3 && (
                        <EmployeeExpenses
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 4 && (
                        <EmployeeTimeSheets
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 5 && (
                        <EmployeeAddress
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 0 && (
                        <form onSubmit={this.handleSubmit}>
                          {/* <h6 className="heading-small text-muted mb-4">
                            Employee information
                        </h6> */}
                          <div className="pl-lg-4">
                            <div className="row">
                              <div className="col-lg-2">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    for="input-title"
                                  >
                                    Title
                                  </label>

                                  <select
                                    className="form-control input-group input-group-alternative"
                                    type="text"
                                    id="input-title"
                                    placeholder="Title"
                                    name="Title"
                                    value={this.state.Title}
                                    onChange={this.handleTypeChange}
                                  >
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                  </select>
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
                                  <label
                                    className="form-control-label"
                                    for="input-email"
                                  >
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
                                  <label
                                    className="form-control-label"
                                    for="input-City"
                                  >
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
                          <div className="col-lg-6">
                            <div class="dropdown">
                              <div class="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="approver"
                                >
                                  Choose the approver for timesheets and
                                  expenses
                                </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="approverId"
                                  id="approver"
                                  value={this.state.approverId}
                                  onChange={(e) =>
                                    this.handleApproverChange(
                                      e,
                                      this.state.selectedEmployeeId
                                    )
                                  }
                                >
                                  <option value=""></option>
                                  {this.state.possibleApprovers
                                    ? this.state.possibleApprovers.map(
                                        (approver, index) => (
                                          <React.Fragment>
                                            <option
                                              value={approver._id}
                                              key={`approver${index}`}
                                            >
                                              {approver.DisplayName}
                                            </option>
                                          </React.Fragment>
                                        )
                                      )
                                    : ""}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              className="btn  text-uppercase mb-4"
                              type="button"
                              onClick={this.handleCloseDialog}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary text-uppercase mb-4"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Active</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.state.employees.map((employee, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge badge-dot mr-4">
                      {employee.DisplayName}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-dot mr-4">
                      {employee.email}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span>
                        {employee.PrimaryPhone
                          ? employee.PrimaryPhone.FreeFormNumber
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span> {employee.Active ? "Yes" : "No"}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="dropdown">
                      <a
                        className="btn btn-sm btn-icon-only text-light"
                        href="/"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <Icon
                          path={mdiDotsVertical}
                          title="Dashboard"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="#000000"
                        />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => this.handleEditEmployee(index)}
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Employees;
