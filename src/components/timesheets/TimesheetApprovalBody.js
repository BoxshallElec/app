import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import {
  ToastsStore,
  ToastsContainerPosition,
  ToastsContainer,
} from "react-toasts";
import { httpClient } from "../../UtilService";
import "../../components/expenses/expense.css";
import TimesheetApprovalActions from "./TimesheetApprovalActions";
import axios from "axios";
import TimesheetsTable from "../../components/admin/timesheets/TimesheetsTable";
import * as Constants from "../Constant";

class AdminTimesheetsMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      timesheetCountDetails: {},
      timesheets: {
        data: [],
        search: {
          from: 0,
          size: 10,
        },
      },
      hasMoreResults: false,
      timesheetDialog: {
        isOpen: false,
        data: undefined,
      },
      selectedApprovalStatus: "",
      timesheetIds: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedApprovalStatus !== prevState.selectedApprovalStatus) {
      return {
        selectedApprovalStatus: nextProps.selectedApprovalStatus,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.selectedApprovalStatus !== this.state.selectedApprovalStatus
    ) {
      console.log("status updated");
      this.setState(
        (prevState) => ({
          selectedApprovalStatus: this.props.selectedApprovalStatus,
          timesheets: {
            ...prevState.timesheets,
            search: {
              ...prevState.timesheets.search,
              from: 0,
            },
          },
        }),
        this.getTimesheetsApprovalList
      );
    }
  }

  getTimesheetsApprovalList = async () => {
    var self = this;
    this.setState({ isLoading: true });
    let result = await httpClient(
      "timesheet/getTimesheetsForApproval",
      "POST",
      {
        ...this.state.timesheets.search,
        status: this.state.selectedApprovalStatus,
      }
    );
    console.log(result);
    if (result.success) {
      self.setState((prevState) => ({
        timesheets: {
          ...prevState.timesheets,
          data: result.data,
        },
        hasMoreResults:
          this.state.timesheets.search.size === result.data
            ? result.data.length
            : 0,
        isLoading: false,
        timesheetIds: [],
      }));
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting my timesheets", "error");
    }
  };

  getTimesheetsFrom = (from) => {
    this.setState(
      (prevState) => ({
        timesheets: {
          ...prevState.timesheets,
          search: {
            ...prevState.timesheets.search,
            from: from,
          },
        },
      }),
      this.getTimesheetsList
    );
  };

  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  setTimesheetIds = (timesheetIds) => {
    this.setState({ timesheetIds: timesheetIds });
  };

  changeStatusTimesheets = (status) => {
    const self = this;
    var url = "";
    var proceed = false;
    if (status == "Rejected") {
      if (
        window.confirm(
          "Rejecting the timesheet will send a notification to the employee and timesheet has to be resubmitted for approval!"
        )
      ) {
        proceed = true;
      } else proceed = false;
    } else {
      proceed = true;
    }
    if (proceed) {
      this.setState({ isLoading: true });
      var payload = {
        token: localStorage.getItem("token"),
        timeSheetIds: this.state.timesheetIds,
        status: status,
      };

      var url = Constants.BASE_URL + "timesheet/changeTimesheetsStatus";

      axios
        .post(url, payload)
        .then(function (response) {
          if (response.data.success) {
            ToastsStore.success(response.data.message);
          } else {
            ToastsStore.error(response.data.message);
          }
          self.setState({ isLoading: false });
          window.location.reload(false);
        })
        .catch(function (error) {
          ToastsStore.error(error.message);
          self.setState({ isLoading: false });
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && (
          <div className="centered">
            <ReactLoading
              type="spin"
              color="#2B70A0"
              height={"64px"}
              width={"64px"}
            />
          </div>
        )}
        <div className="row">
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6"></div>
        </div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        {/* <TimesheetsList
          selectedStatus={this.state.selectedStatus}
          canUpdate={false}
          timesheets={this.state.timesheets.data}
          //handleAddMyExpenseDialog={this.handleAddMyExpenseDialog}
        ></TimesheetsList> */}
        <TimesheetApprovalActions
          selectedStatus={this.state.selectedApprovalStatus}
          changeStatusTimesheets={this.changeStatusTimesheets}
          timesheetData={this.state.timesheets.data}
        ></TimesheetApprovalActions>
        <TimesheetsTable
          selectedStatus={this.state.selectedApprovalStatus}
          timesheetData={this.state.timesheets.data}
          setTimesheetIds={this.setTimesheetIds}
        ></TimesheetsTable>
        <br />
        {/* <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-danger pagination-btn"
            onClick={() =>
              this.getTimesheetsFrom(
                this.state.timesheets.search.from -
                  this.state.timesheets.search.size
              )
            }
            disabled={this.state.timesheets.search.from === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-danger pagination-btn"
            onClick={() =>
              this.getTimesheetsFrom(
                this.state.timesheets.search.from +
                  this.state.timesheets.search.size
              )
            }
            disabled={!this.state.hasMoreResults}
          >
            Next
          </button>
        </div> */}
      </React.Fragment>
    );
  }
}

export default AdminTimesheetsMain;
