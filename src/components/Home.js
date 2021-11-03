import React, { Component } from "react";
import SideNav from "./SideNav";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/Home.css";
import Dashboard from "./Dashboard";
import Graphs from "./Graphs";
import Employees from "./Employees";
import About from "./About";
import MyTime from "./MyTime";
import User from "./Users";
import MyExpensesMain from "./expenses/MyExpensesMain";
import Customers from "./customer/Customers";
import AdminExpensesMain from "./admin/expenses/AdminExpensesMain";
import AdminTimesheetsMain from "./admin/timesheets/AdminTimesheetsMain";
import ExpenseStatusMain from "./admin/expenses/ExpenseStatusMain";
import TimesheetStatusMain from "./admin/timesheets/TimesheetStatusMain";
import ListTasksMain from "./admin/lists/ListTasksMain";
import ClassesListMain from "./admin/lists/ClassesListMain";
import ExpenseListMain from "./admin/lists/ExpenseListMain";
import VendorsMain from "./admin/lists/VendorsMain";
import TimeSheetActions from "./admin/timesheets/TimesheetActions";
import TimesheetApprovalBody from "./timesheets/TimesheetApprovalBody";
import TimesheetApprovalHeader from "./timesheets/TimeSheetApprovalHeader";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: "",
      isUpdateCount: false,
      selectedTimeSheetStatus: "",
      isTimesheetUpdateCount: false,
      // component: <Dashboard />,
      // title: "Dashboard",
      // header: <Graphs />
      selectedApprovalStatus: "",
      accessLevels: localStorage.getItem("access"),
    };
  }

  componentDidMount() {
    let pathName = window.location.pathname;
    let component = <Dashboard />;
    let header = undefined;
    pathName = pathName.slice(1);
    switch (pathName) {
      default:
      case "dashboard":
        component = <Dashboard />;
        header = <Graphs />;
        pathName = "dashboard";
        break;
      case "employees":
        component = <Employees />;
        break;
      case "users":
        component = <User />;
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
        header = (
          <ExpenseStatusMain
            selectedStatus={this.state.selectedStatus}
            onStatusSelected={this.onStatusSelected}
          />
        );
        break;
      case "timesheets":
        component = <AdminTimesheetsMain />;
        header = (
          <TimesheetStatusMain
            selectedStatus={this.state.selectedTimeSheetStatus}
            onStatusSelected={this.onTimesheetStatusSelected}
          />
        );
        break;
      case "list-task":
        component = <ListTasksMain />;
        break;
      case "list-classes":
        component = <ClassesListMain />;
        break;
      case "list-expenses":
        component = (
          <TimesheetApprovalBody
            selectedStatus={this.state.selectedApprovalStatus}
            onStatusSelected={this.onApprovalStatusSelected}
          />
        );
        header = <TimesheetApprovalHeader />;
        break;
      case "suppliers":
        component = <VendorsMain />;
    }

    this.setState({
      component,
      header,
      title: pathName,
    });
  }

  getHeader = () => {
    let pathName = window.location.pathname;
    pathName = pathName.slice(1);
    switch (pathName) {
      default:
      case "dashboard":
        return <Graphs />;
      case "expenses":
        return (
          <ExpenseStatusMain
            isUpdateCount={this.state.isUpdateCount}
            selectedStatus={this.state.selectedStatus}
            onStatusSelected={this.onStatusSelected}
          />
        );
      case "timesheets":
        return (
          <TimesheetStatusMain
            isUpdateCount={this.state.isTimesheetUpdateCount}
            selectedStatus={this.state.selectedTimeSheetStatus}
            onStatusSelected={this.onTimesheetStatusSelected}
          />
        );
      case "approve-timesheets":
        return (
          <TimesheetApprovalHeader
            selectedStatus={this.state.selectedApprovalStatus}
            onStatusSelected={this.onApprovalStatusSelected}
          />
        );
    }
  };

  getBody = () => {
    let pathName = window.location.pathname;
    pathName = pathName.slice(1);
    switch (pathName) {
      default:
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <Employees />;
      case "users":
        return <User />;
      case "about":
        return <About />;
      case "mytime":
        return <MyTime />;
      case "myexpenses":
        return <MyExpensesMain />;
      case "customers":
        return <Customers />;
      case "expenses":
        return (
          <AdminExpensesMain
            updateExpenseCount={this.updateExpenseCount}
            selectedStatus={this.state.selectedStatus}
          />
        );
      case "timesheets":
        return (
          <AdminTimesheetsMain
            updateTimesheetCount={this.updateTimesheetCount}
            selectedStatus={this.state.selectedTimeSheetStatus}
          />
        );
        return "";
      case "list-task":
        return <ListTasksMain />;
      case "list-classes":
        return <ClassesListMain />;
      case "list-expenses":
        return <ExpenseListMain />;
      case "suppliers":
        return <VendorsMain />;
      case "approve-timesheets":
        return (
          <TimesheetApprovalBody
            selectedApprovalStatus={this.state.selectedApprovalStatus}
          />
        );
    }
  };
  updateExpenseCount = () => {
    this.setState({
      isUpdateCount: !this.state.isUpdateCount,
    });
  };
  updateTimesheetCount = () => {
    this.setState({
      isTimesheetUpdateCount: !this.state.isTimesheetUpdateCount,
    });
  };
  onStatusSelected = (status) => {
    this.setState({ selectedStatus: status });
  };
  onTimesheetStatusSelected = (status) => {
    this.setState({ selectedTimeSheetStatus: status });
  };
  onApprovalStatusSelected = (status) => {
    this.setState({ selectedApprovalStatus: status });
  };

  handleNavigation = (url) => {
    this.props.history.push("/" + url);
  };

  getComponent = (component, type, header) => {
    this.setState({ component: component, title: type, header: header });
  };

  getLogout = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <React.Fragment>
        <SideNav
          title={this.state.title}
          setComponent={this.getComponent}
          handleNavigation={this.handleNavigation}
          setLogout={this.getLogout}
        />
        <div className="main-content">
          <Nav title={this.state.title} setLogout={this.getLogout} />
          <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
            <div className="container-fluid">
              <div className="header-body">
                {this.state.header ? this.getHeader() : ""}
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row mt-64">
              <div className="col">
                <div className="card shadow">
                  <div className="card-body" style={{ minHeight: "200px" }}>
                    {this.getBody()}
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

export default Home;
