import React, { Component } from "react";
import "../css/SideNav.css";
import Icon from "@mdi/react";
import {
  mdiClock,
  mdiCurrencyUsd,
  mdiMonitor,
  mdiGoogleSpreadsheet,
  mdiReceipt,
  mdiFileChart,
  mdiAccountGroup,
  mdiFormatListBulleted,
  mdiChartBar,
  mdiBell,
  mdiSettings,
  mdiBook,
} from "@mdi/js";

import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Users from "./Users";
import About from "./About";
import Graphs from "./Graphs";
import MyTime from "./MyTime";
import MyExpensesMain from "./expenses/MyExpensesMain";
import Customers from "./customer/Customers";
import AdminExpensesMain from "./admin/expenses/AdminExpensesMain";
import ExpenseStatusMain from "./admin/expenses/ExpenseStatusMain";
import ListTasksMain from "./admin/lists/ListTasksMain";
import ClassesListMain from "./admin/lists/ClassesListMain";
import ExpenseListMain from "./admin/lists/ExpenseListMain";
import VendorsMain from "./admin/lists/VendorsMain";
import TimesheetApprovalBody from "./timesheets/TimesheetApprovalBody";
import TimesheetApprovalHeader from "./timesheets/TimeSheetApprovalHeader";

const logo = require("../images/logo-black.png");

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListExpanded: false,
      accessLevels: localStorage.getItem("access"),
      role: localStorage.getItem("role"),
    };
  }

  handleListExpanded = () => {
    this.setState({
      isListExpanded: !this.state.isListExpanded,
    });
  };

  isActive = (value) => {
    // console.log(value, this.props.title);
    return "nav-link " + (value === this.props.title ? "active" : "nav-link");
  };

  handleClick = (event, type) => {
    event.preventDefault();
    this.props.handleNavigation(type);

    var component = <Dashboard />;
    var header = undefined;

    switch (type) {
      default:
      case "dashboard":
        component = <Dashboard />;
        header = <Graphs />;
        break;
      case "users":
        component = <Users />;
        break;
      case "about":
        component = <About />;
        break;
      case "mytime":
        component = <MyTime />;
        break;
      case "myexpenses":
        component = <MyExpensesMain />;
        break;
      case "customers":
        component = <Customers />;
        break;
      case "expenses":
        component = <AdminExpensesMain />;
        header = <ExpenseStatusMain />;
        break;
      case "approve-timesheets":
        component = <TimesheetApprovalBody />;
        header = <TimesheetApprovalHeader />;
        break;
      case "list-task":
        component = <ListTasksMain />;
        break;
      case "list-classes":
        component = <ClassesListMain />;
        break;
      case "list-expenses":
        component = <ExpenseListMain />;
        break;
      case "suppliers":
        return <VendorsMain />;
        break;
      case "employees":
        return <Employees />;
        break;
    }

    this.props.setComponent(component, type, header);
  };

  handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    this.props.setLogout();
  };

  render() {
    return (
      <nav
        className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white"
        id="sidenav-main"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#sidenav-collapse-main"
            aria-controls="sidenav-main"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand pt-0" href="/">
            <img
              src={logo}
              height="500px"
              className="navbar-brand-img h-100"
              alt="..."
            />
          </a>
          <ul className="nav align-items-center d-md-none">
            <li className="nav-item dropdown">
              <a
                className="nav-link"
                href="/"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="media align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img src="../assets/img/theme/team-1-800x800.jpg" alt="" />
                  </span>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
                <div className=" dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </div>
                <a href="./examples/profile.html" className="dropdown-item">
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </a>
                <div className="dropdown-divider" />
                <a href="#!" className="dropdown-item">
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </a>
              </div>
            </li>
          </ul>
          <div className="collapse navbar-collapse" id="sidenav-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <div className="row">
                <div className="col-6 collapse-brand">
                  <a href="../index.html">
                    <img src="../assets/img/brand/blue.png" alt="" />
                  </a>
                </div>
                <div className="col-6 collapse-close">
                  <button
                    type="button"
                    className="navbar-toggler"
                    data-toggle="collapse"
                    data-target="#sidenav-collapse-main"
                    aria-controls="sidenav-main"
                    aria-expanded="false"
                    aria-label="Toggle sidenav"
                  >
                    <span />
                    <span />
                  </button>
                </div>
              </div>
            </div>
            <h6 className="navbar-heading text-muted">My Workspace</h6>
            <h5>Trial</h5>
            <ul className="navbar-nav">
              {/* {this.state.accessLevels && this.state.accessLevels.indexOf("TIMESHEETS") != -1 ? ( */}
                <li className="nav-item">
                  <a
                    className={this.isActive("mytime")}
                    onClick={(event) => {
                      this.handleClick(event, "mytime");
                    }}
                    href="/"
                  >
                    <Icon
                      path={mdiClock}
                      title="mytime"
                      size={0.9}
                      horizontal
                      vertical
                      rotate={180}
                      color="#5e72e4"
                      className="mr-2"
                    />
                    My Time
                  </a>
                </li>
              {/* ) : (
                ""
              )} */}
              {/* {this.state.accessLevels.indexOf("EXPENSES") != -1 ? ( */}
                <li className="nav-item">
                  <a
                    className={this.isActive("myexpenses")}
                    onClick={(event) => {
                      this.handleClick(event, "myexpenses");
                    }}
                    href="/"
                  >
                    <Icon
                      path={mdiClock}
                      title="myexpenses"
                      size={0.9}
                      horizontal
                      vertical
                      rotate={180}
                      color="#ffd600"
                      className="mr-2"
                    />
                    My Expenses
                  </a>
                </li>
              {/* ) : (
                ""
              )} */}
              {/* {this.state.accessLevels.indexOf("TIMESHEETS") != -1 ? ( */}
                <li className="nav-item">
                  <a
                    className={this.isActive("approve-timesheets")}
                    onClick={(event) => {
                      this.handleClick(event, "approve-timesheets");
                    }}
                    href="/"
                  >
                    <Icon
                      path={mdiClock}
                      title="approve-timesheets"
                      size={0.9}
                      horizontal
                      vertical
                      rotate={180}
                      color="#ffd600"
                      className="mr-2"
                    />
                    Approve Timesheets
                  </a>
                </li>
              {/* ) : (
                ""
              )} */}
            </ul>
            {this.state.role && this.state.role == "Admin" ? (
              <React.Fragment>
                <hr className="my-3" />
                <h6 className="navbar-heading text-muted">Administration</h6>
                <ul className="navbar-nav mb-md-3">
                  <li className="nav-item">
                    <a
                      className={this.isActive("dashboard")}
                      onClick={(event) => {
                        this.handleClick(event, "dashboard");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiMonitor}
                        title="dashboard"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#e74c3c"
                        className="mr-2"
                      />
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("timesheets")}
                      onClick={(event) => {
                        this.handleClick(event, "timesheets");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiGoogleSpreadsheet}
                        title="Timesheets"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#94d82d"
                        className="mr-2"
                      />
                      Timesheets
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("expenses")}
                      onClick={(event) => {
                        this.handleClick(event, "expenses");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiCurrencyUsd}
                        title="expenses"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#22b8cf"
                        className="mr-2"
                      />
                      Expenses
                    </a>
                  </li>
                  {/* <li className="nav-item">
                <a
                  className={this.isActive("invoices")}
                  onClick={(event) => {
                    this.handleClick(event, "invoices");
                  }}
                  href="/"
                >
                  <Icon
                    path={mdiReceipt}
                    title="invoices"
                    size={0.9}
                    horizontal
                    vertical
                    rotate={180}
                    color="#5c7cfa"
                    className="mr-2"
                  />
                  Invoices
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={this.isActive("budget/po")}
                  onClick={(event) => {
                    this.handleClick(event, "budget/po");
                  }}
                  href="/"
                >
                  <Icon
                    path={mdiFileChart}
                    title="budget/po"
                    size={0.9}
                    horizontal
                    vertical
                    rotate={180}
                    color="#cc5de8"
                    className="mr-2"
                  />
                  Budget/PO
                </a>
              </li> */}
                  <li className="nav-item">
                    <a
                      className={this.isActive("users")}
                      onClick={(event) => {
                        this.handleClick(event, "users");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiAccountGroup}
                        title="users"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#f06595"
                        className="mr-2"
                      />
                      Users
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("customers")}
                      onClick={(event) => {
                        this.handleClick(event, "customers");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiAccountGroup}
                        title="customers"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ff922b"
                        className="mr-2"
                      />
                      Add Customers
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("employees")}
                      onClick={(event) => {
                        this.handleClick(event, "employees");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiAccountGroup}
                        title="employees"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#00008b"
                        className="mr-2"
                      />
                      Add Employees
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("suppliers")}
                      onClick={(event) => {
                        this.handleClick(event, "suppliers");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiAccountGroup}
                        title="suppliers"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ff922b"
                        className="mr-2"
                      />
                      Add Suppliers
                    </a>
                  </li>
                  <li className="nav-item">
                    <div
                      className={`pr-0 pointer ${this.isActive("list")}`}
                      onClick={(event) => {
                        // this.handleClick(event, "list");
                        this.handleListExpanded();
                      }}
                    >
                      <div className="w-100 d-flex justify-content-between">
                        <div>
                          <Icon
                            path={mdiFormatListBulleted}
                            title="list"
                            size={0.9}
                            horizontal
                            vertical
                            rotate={180}
                            color="#51cf66"
                            className="mr-2"
                          />
                          List
                        </div>
                        <div>
                          <i
                            className={`"fa fa-user ni ${
                              this.state.isListExpanded === false
                                ? "ni-bold-down"
                                : "ni-bold-up"
                            }`}
                          ></i>
                        </div>
                      </div>
                    </div>
                    {this.state.isListExpanded && (
                      <div className="pl-3">
                        <ul className="navbar-nav mb-md-3 ml-0 mr-0">
                          <li className="nav-item">
                            <a
                              className={this.isActive("list-task")}
                              onClick={(event) => {
                                this.handleClick(event, "list-task");
                              }}
                              href="/"
                            >
                              Tasks
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={this.isActive("list-classes")}
                              onClick={(event) => {
                                this.handleClick(event, "list-classes");
                              }}
                              href="/"
                            >
                              Services
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={this.isActive("list-expenses")}
                              onClick={(event) => {
                                this.handleClick(event, "list-expenses");
                              }}
                              href="/"
                            >
                              Products
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={this.isActive("list-other-items")}
                              onClick={(event) => {
                                this.handleClick(event, "list-other-items");
                              }}
                              href="/"
                            >
                              Chart of Accounts
                            </a>
                          </li>
                          {/* <li className="nav-item">
                        <a
                          className={this.isActive("list-vendors")}
                          onClick={(event) => {
                            this.handleClick(event, "list-vendors");
                          }}
                          href="/"
                        >
                          Vendors
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={this.isActive("list-credit-cards")}
                          onClick={(event) => {
                            this.handleClick(event, "list-credit-cards");
                          }}
                          href="/"
                        >
                          Company Credit Cards
                        </a>
                      </li> */}
                        </ul>
                      </div>
                    )}
                  </li>
                  <li className="nav-item">
                    <a
                      className={this.isActive("reports")}
                      onClick={(event) => {
                        this.handleClick(event, "reports");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiChartBar}
                        title="reports"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ff6b6b"
                        className="mr-2"
                      />
                      Reports
                    </a>
                  </li>
                  {/* <li className="nav-item">
                <a
                  className={this.isActive("what's up")}
                  onClick={(event) => {
                    this.handleClick(event, "what's up");
                  }}
                  href="/"
                >
                  <Icon
                    path={mdiBell}
                    title="whatsup"
                    size={0.9}
                    horizontal
                    vertical
                    rotate={180}
                    color="#339af0"
                    className="mr-2"
                  />
                  What's Up
                </a>
              </li> */}
                  <li className="nav-item">
                    <a
                      className={this.isActive("setup")}
                      onClick={(event) => {
                        this.handleClick(event, "setup");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiSettings}
                        title="setup"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffd600"
                        className="mr-2"
                      />
                      Setup
                    </a>
                  </li>
                  <div className="pl-3">
                    <li className="nav-item">
                      <a
                        className={this.isActive("quickbooks")}
                        onClick={(event) => {
                          this.handleClick(event, "quickbooks");
                        }}
                        href="/"
                      >
                        <Icon
                          path={mdiBook}
                          title="quickbooks"
                          size={0.9}
                          horizontal
                          vertical
                          rotate={180}
                          color="#ff922b"
                          className="mr-2"
                        />
                        Quickbooks
                      </a>
                    </li>
                  </div>
                  <li className="nav-item">
                    <a
                      className={this.isActive("my account")}
                      onClick={(event) => {
                        this.handleClick(event, "my account");
                      }}
                      href="/"
                    >
                      <Icon
                        path={mdiClock}
                        title="my account"
                        size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#94d82d"
                        className="mr-2"
                      />
                      My Account
                    </a>
                  </li>
                </ul>{" "}
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default SideNav;
