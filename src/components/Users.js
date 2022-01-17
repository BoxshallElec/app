import React, { Component } from "react";
import Icon from "@mdi/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mdiPlus, mdiDotsVertical, mdiCalendar } from "@mdi/js";
import axios from "axios";
import "../css/Employees.css";
import * as Constants from "./Constant";
import UserTimeSheets from "./user/UserTimesheet";
import UserExpenses from "./user/UserExpense";
import UserRatesMain from "./user/UserRatesMain";
import ReactLoading from "react-loading";
import { Multiselect } from "multiselect-react-dropdown";
import {
  ToastsStore,
  ToastsContainerPosition,
  ToastsContainer,
} from "react-toasts";
import Switch from "react-switch";

class Users extends Component {
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
      userList: [],
      selectedTabIndex: 0,
      portalAccess: false,
      accessLevels: [],
      approvalRequired: false,
      approver: {},
      approverId: "",
      columnsToBeShown: ["NAME", "EMAIL", "PHONE", "ACTIVE", "USER ROLE"],
    };
    this.handlePortalAccess = this.handlePortalAccess.bind(this);
    this.handleApproverRequired = this.handleApproverRequired.bind(this);
  }

  componentDidMount() {
    var self = this;
    var payLoad = {
      token: localStorage.getItem("token"),
    };
    var url = Constants.BASE_URL + "employee/list";
    axios
      .post(url, payLoad)
      .then(function (response) {
        if (response.data.success) {
          console.log("USERLIST");
          console.log(response.data.data);
          self.setState({
            userList: response.data.data,
          });
        }
      })
      .catch((error) => {
        console.log("ERROR");
        console.log(error);
        ToastsStore.error(error.message);
      });
  }

  setActiveIndex = (index) => {
    this.setState({
      selectedTabIndex: index,
    });
  };

  handleColumnsVisible = (selectedList) => {
    this.setState({ columnsToBeShown: selectedList });
  };

  handleChange = (event) => {
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

  handleEditUser = (index) => {
    var self = this;
    let user = { ...this.state.userList[index] };
    console.log("User");
    console.log(user);
    var url = Constants.BASE_URL + "employee/getApprover";
    this.setState({ loading: true });
    var payLoad = {
      selectedUser: user["_id"],
      token: localStorage.getItem("token"),
    };
    axios
      .post(url, payLoad)
      .then(function (response) {
        if (response.data.success) {
          self.setState(
            {
              FirstName: user.givenName || "",
              FamilyName: user.middleName || "",
              Title: user.title,
              PrimaryPhone: user.mobile,
              CountrySubDivisionCode: user.PrimaryAddr.CountrySubDivisionCode,
              City: user.PrimaryAddr.City,
              PostalCode: user.PrimaryAddr.PostalCode,
              Line1: user.PrimaryAddr.Line1,
              email: user.email,
              HiredDate: user.HiredDate ? new Date(user.HiredDate) : "",
              ReleasedDate: user.ReleasedDate
                ? new Date(user.ReleasedDate)
                : "",
              selectedEmployeeId: user._id,
              possibleApprovers: response.data.data,
              approverId: user.approver,
              DisplayName: user.displayName,
              // portalAccess: user.access
              //   ? user.access.indexOf("PORTAL") != -1
              //     ? true
              //     : false
              //   : false,
              // accessLevels: user.access,
              // approverId: user.approver,
              // loading: false,
              // approvalRequired: user.approver ? true : false,
              // invitationSent: user.invitation ? true : false,
            },
            () => {
              window.$("#call-modal-form").modal("show");
            }
          );
        } else ToastsStore.error(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error(error.message);
      });
  };
  handleApproverChange = (event) => {
    if (event.target.value == "") {
      this.setState({ approver: {}, approverId: "" });
    } else
      this.setState({
        approverId: event.target.value,
        approver: {
          id: event.target.value,
          model: this.state.possibleApprovers.filter(
            (val) => val["id"] == event.target.value
          )[0]["approverModel"],
        },
        approvalRequired: true,
      });
  };
  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  handleOpenUserDialog = () => {
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
    var url;
    var accessLevels = this.state.accessLevels;
    if (this.state.selectedEmployeeId) url = Constants.BASE_URL + "user/update";
    // console.log("Intuit");
    // url = Constants.BASE_URL + "intuit/demo";
    else url = Constants.BASE_URL + "employee/register";
    // else url = Constants.BASE_URL + "demo/";
    if (this.state.portalAccess && accessLevels.indexOf("PORTAL") == -1)
      accessLevels.push("PORTAL");
    else if (!this.state.portalAccess && accessLevels.indexOf("PORTAL") != -1)
      accessLevels.splice(accessLevels.indexOf("PORTAL"), 1);
    var payload = {
      token: localStorage.getItem("token"),
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
      approver: self.state.approver,
      updateUserId: self.state.selectedEmployeeId,
      access: accessLevels,
    };
    axios
      .post(url, payload)
      .then(function (response) {
        console.log("Response");
        console.log(response);
        self.setState({ loading: false });
        if (response.data.success) {
          ToastsStore.success(response.data.message);
        } else {
          ToastsStore.error(response.data.message);
        }
      })
      .catch(function (error) {
        self.setState({ loading: false });
        ToastsStore.error(error.message);
      });
  };

  handleCloseDialog = () => {
    window.location.reload(false);
    window.$("#call-modal-form").modal("hide");
  };

  addOrRemoveAccessLevels = (event) => {
    var accessLevels = this.state.accessLevels;
    switch (event.target.name) {
      case "accessLevel_timeSheets":
        if (event.target.checked && accessLevels.indexOf("TIMESHEETS") == -1)
          accessLevels.push("TIMESHEETS");
        else if (
          !event.target.checked &&
          accessLevels.indexOf("TIMESHEETS") != -1
        )
          accessLevels.splice(accessLevels.indexOf("TIMESHEETS"), 1);
        break;
      case "accessLevel_expenses":
        if (event.target.checked && accessLevels.indexOf("EXPENSES") == -1)
          accessLevels.push("EXPENSES");
        else if (
          !event.target.checked &&
          accessLevels.indexOf("EXPENSES") != -1
        )
          accessLevels.splice(accessLevels.indexOf("EXPENSES"), 1);
        break;
      case "accessLevel_projects":
        if (event.target.checked && accessLevels.indexOf("PROJECTS") == -1)
          accessLevels.push("PROJECTS");
        else if (
          !event.target.checked &&
          accessLevels.indexOf("PROJECTS") != -1
        )
          accessLevels.splice(accessLevels.indexOf("PROJECTS"), 1);
        break;
      case "accessLevel_purchasing":
        if (event.target.checked && accessLevels.indexOf("PURCHASING") == -1)
          accessLevels.push("PURCHASING");
        else if (
          !event.target.checked &&
          accessLevels.indexOf("PURCHASING") != -1
        )
          accessLevels.splice(accessLevels.indexOf("PURCHASING"), 1);
        break;
      default:
        break;
    }
    this.setState({
      accessLevels: accessLevels,
    });
  };

  handlePortalAccess = (checked) => {
    var self = this;
    if (!this.state.invitationSent && checked) {
      if (
        window.confirm(
          "An invitation mail with auto generated password will be sent to the user email id."
        )
      ) {
        this.setState({ loading: true });
        var url = Constants.BASE_URL + "user/sendInvitation";
        var payload = {
          inviteUserId: this.state.selectedEmployeeId,
          token: localStorage.getItem("token"),
        };
        axios.post(url, payload).then(function (response) {
          this.setState({ loading: false });
          if (response.data.success) {
            ToastsStore.success(response.data.message);
            this.setState({ invitationSent: true });
            this.setState({ portalAccess: checked });
          } else {
            ToastsStore.error(response.data.message);
          }
        });
      }
    } else this.setState({ portalAccess: checked });
  };

  handleApproverRequired(event) {
    this.setState({ approvalRequired: event.target.checked });
  }
  resetPassword = () => {
    const self = this;
    if (
      window.confirm("Mail will be sent to the user with new login credentials")
    ) {
      var payLoad = {
        token: localStorage.getItem("token"),
        inviteUserId: self.state.selectedEmployeeId,
      };
      var url = Constants.BASE_URL + "user/resetPassword";
      axios
        .post(url, payLoad)
        .then(function (response) {
          if (response.data.success) {
            ToastsStore.success(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          ToastsStore.error(error.message);
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        {this.state.loading ? (
          <div className="centered">
            <ReactLoading
              type="spin"
              color="#2B70A0"
              height={"64px"}
              width={"64px"}
            />
          </div>
        ) : (
          ""
        )}
        <div className="text-right">
          <button
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
            onClick={() => this.handleOpenUserDialog()}
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

            <span className="btn-inner--text">Add User</span>
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
              className="modal-dialog modal- modal-dialog-centered modal-lg"
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
                              ? "Edit User"
                              : "Add User"}
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
                        </ul>
                      )}

                      <br />

                      {/* <h1>selected tab index {this.state.selectedTabIndex}</h1> */}

                      {this.state.selectedTabIndex === 2 && (
                        <UserRatesMain
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                          userList={this.state.userList}
                        />
                      )}
                      {this.state.selectedTabIndex === 3 && (
                        <UserExpenses
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 4 && (
                        <UserTimeSheets
                          handleCloseDialog={this.handleCloseDialog}
                          showToast={this.showToast}
                          employeeId={this.state.selectedEmployeeId}
                        />
                      )}
                      {this.state.selectedTabIndex === 0 ? (
                        <form onSubmit={this.handleSubmit}>
                          <hr className="my-4" />
                          <h6 className="heading-small text-muted mb-4">
                            User information
                          </h6>
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

                            {this.state.selectedEmployeeId ? (
                              <React.Fragment>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-control-label"
                                        htmlFor="portalAccess"
                                      >
                                        <span>Portal Access</span>
                                        <Switch
                                          html="portalAccess"
                                          onChange={this.handlePortalAccess}
                                          checked={this.state.portalAccess}
                                        />
                                      </label>
                                    </div>
                                    <a href="#" onClick={this.resetPassword}>
                                      Reset Password
                                    </a>
                                  </div>
                                </div>
                              </React.Fragment>
                            ) : (
                              ""
                            )}
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
                          </div>

                          {this.state.selectedEmployeeId ? (
                            <React.Fragment>
                              <hr className="my-4" />
                              <h6 className="heading-small text-muted mb-4">
                                Access Levels
                              </h6>
                              <div className="col-lg-6">
                                <span>
                                  Choose the access levels for the user
                                </span>
                                <div className="form-group mt-4">
                                  <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                      className="custom-control-input"
                                      id="accessLevel_timeSheets"
                                      type="checkbox"
                                      name="accessLevel_timeSheets"
                                      checked={
                                        this.state.accessLevels.indexOf(
                                          "TIMESHEETS"
                                        ) != -1
                                          ? true
                                          : false
                                      }
                                      onChange={(event) =>
                                        this.addOrRemoveAccessLevels(event)
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="accessLevel_timeSheets"
                                    >
                                      TimeSheets
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mt-4">
                                  <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                      className="custom-control-input"
                                      id="accessLevel_expenses"
                                      type="checkbox"
                                      name="accessLevel_expenses"
                                      checked={
                                        this.state.accessLevels.indexOf(
                                          "EXPENSES"
                                        ) != -1
                                          ? true
                                          : false
                                      }
                                      onChange={(event) =>
                                        this.addOrRemoveAccessLevels(event)
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="accessLevel_expenses"
                                    >
                                      Expenses
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mt-4">
                                  <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                      className="custom-control-input"
                                      id="accessLevel_projects"
                                      type="checkbox"
                                      name="accessLevel_projects"
                                      checked={
                                        this.state.accessLevels.indexOf(
                                          "PROJECTS"
                                        ) != -1
                                          ? true
                                          : false
                                      }
                                      onChange={(event) =>
                                        this.addOrRemoveAccessLevels(event)
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="accessLevel_projects"
                                    >
                                      Projects
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mt-4">
                                  <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                      className="custom-control-input"
                                      id="accessLevel_purchasing"
                                      type="checkbox"
                                      name="accessLevel_purchasing"
                                      checked={
                                        this.state.accessLevels.indexOf(
                                          "PURCHASING"
                                        ) != -1
                                          ? true
                                          : false
                                      }
                                      onChange={(event) =>
                                        this.addOrRemoveAccessLevels(event)
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="accessLevel_purchasing"
                                    >
                                      Purchasing
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            ""
                          )}
                          {this.state.selectedEmployeeId ? (
                            <React.Fragment>
                              <hr className="my-4" />
                              <h6 className="heading-small text-muted mb-4">
                                Approval
                              </h6>
                              <div className="col-lg-6">
                                <div class="form-group">
                                  <div className="form-group mt-4">
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                      <input
                                        className="custom-control-input"
                                        id="approvalRequired"
                                        type="checkbox"
                                        name="approvalRequired"
                                        checked={this.state.approvalRequired}
                                        onChange={(event) =>
                                          this.handleApproverRequired(event)
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="approvalRequired"
                                      >
                                        Requires Approval?
                                      </label>
                                    </div>
                                  </div>
                                </div>
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
                                      required={this.state.approvalRequired}
                                      value={this.state.approverId}
                                      onChange={(e) =>
                                        this.handleApproverChange(e)
                                      }
                                    >
                                      <option value=""></option>
                                      {this.state.possibleApprovers
                                        ? this.state.possibleApprovers.map(
                                            (approver, index) => (
                                              <React.Fragment>
                                                <option
                                                  value={approver.id}
                                                  key={`approver${index}`}
                                                >
                                                  {approver.displayName}
                                                </option>
                                              </React.Fragment>
                                            )
                                          )
                                        : ""}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            ""
                          )}
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
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown">
          <div class="form-group">
            <label className="form-control-label" htmlFor="columns">
              Columns to be displayed
            </label>
            <Multiselect
              options={Constants.USER_TABLE_COLUMNS}
              selectedValues={this.state.columnsToBeShown}
              onSelect={this.handleColumnsVisible}
              onRemove={this.handleColumnsVisible}
              isObject={false}
            />
            {/* <select
              className="form-control input-group input-group-alternative"
              multiple
              name="columns"
              id="columns"
              value={this.state.columnsToBeShown}
              onChange={(e) => this.handleColumnsVisible(e)}
            >
              {Constants.USER_TABLE_COLUMNS.map((columnName, index) => (
                <React.Fragment>
                  <option value={columnName} key={`columnName${index}`}>
                    {columnName}
                  </option>
                </React.Fragment>
              ))}
            </select> */}
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                {this.state.columnsToBeShown.indexOf("NAME") != -1 ? (
                  <th scope="col">Name</th>
                ) : (
                  ""
                )}
                {this.state.columnsToBeShown.indexOf("EMAIL") != -1 ? (
                  <th scope="col">Email</th>
                ) : (
                  ""
                )}
                {this.state.columnsToBeShown.indexOf("PHONE") != -1 ? (
                  <th scope="col">Phone</th>
                ) : (
                  ""
                )}
                {this.state.columnsToBeShown.indexOf("ACTIVE") != -1 ? (
                  <th scope="col">Active</th>
                ) : (
                  ""
                )}
                {this.state.columnsToBeShown.indexOf("USER ROLE") != -1 ? (
                  <th scope="col">User role</th>
                ) : (
                  ""
                )}
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.state.userList.map((user, index) => (
                <tr key={index}>
                  {this.state.columnsToBeShown.indexOf("NAME") != -1 ? (
                    <td>
                      <span className="d-flex align-items-center">
                        
                        {user.DisplayName}
                      </span>
                    </td>
                  ) : (
                    ""
                  )}
                  {this.state.columnsToBeShown.indexOf("EMAIL") != -1 ? (
                    <td>
                      <span className="d-flex align-items-center">{user.email}</span>
                    </td>
                  ) : (
                    ""
                  )}
                  {this.state.columnsToBeShown.indexOf("PHONE") != -1 ? (
                    <td>
                      <div className="d-flex align-items-center">
                        <span>{user.PrimaryPhone.FreeFormNumber}</span>
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
                  {this.state.columnsToBeShown.indexOf("ACTIVE") != -1 ? (
                    <td>
                      <div className="d-flex align-items-center">
                        <span>
                          {" "}
                          {user.active
                            ? true
                              ? "Yes"
                              : "No"
                            : "No"}
                        </span>
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
                  {this.state.columnsToBeShown.indexOf("USER ROLE") != -1 ? (
                    <td>
                      <div className="d-flex align-items-center">
                        <span> {user.type}</span>
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
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
                          onClick={() => this.handleEditUser(index)}
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

export default Users;
