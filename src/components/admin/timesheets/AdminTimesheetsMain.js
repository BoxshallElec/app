import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import {
  ToastsStore,
  ToastsContainerPosition,
  ToastsContainer,
} from "react-toasts";
import AddMyExpenseModal from "../../expenses/AddMyExpenseModal";
import { httpClient } from "../../../UtilService";
import moment from "moment";
import "../../expenses/expense.css";
import TimesheetsList from "../../timesheets/TimesheetsList";
import TimesheetActions from "../timesheets/TimesheetActions";
import axios from "axios";
import TimesheetsTable from "./TimesheetsTable";
import * as Constants from "../../Constant";

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
      selectedStatus: "",
      timesheetIds: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedStatus !== prevState.selectedStatus) {
      return {
        selectedStatus: nextProps.selectedStatus,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedStatus !== this.state.selectedStatus) {
      console.log("status updated");
      this.setState(
        (prevState) => ({
          selectedStatus: this.props.selectedStatus,
          timesheets: {
            ...prevState.timesheets,
            search: {
              ...prevState.timesheets.search,
              from: 0,
            },
          },
        }),
        this.getTimesheetsList
      );
    }
  }

  getTimesheetsList = async () => {
    var self = this;
    this.setState({ isLoading: true });
    let result = await httpClient("timesheet/getTimesheetsForAdmin", "POST", {
      ...this.state.timesheets.search,
      status: this.state.selectedStatus,
    });
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
      this.showToast("Error while getting my expenses", "error");
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

  sendToQuickBook = () => {
    const self = this;
    var url = "";
    this.setState({ isLoading: true });
    var payload = {
      token: localStorage.getItem("token"),
      timeSheetIds: this.state.timesheetIds,
    };

    var url = Constants.BASE_URL + "timesheet/sendTimesheetsToQB";

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          ToastsStore.success(response.data.message);
          self.setState({ isLoading: false });
        } else {
          ToastsStore.error(response.data.message);
          self.setState({ isLoading: false });
        }
      })
      .catch(function (error) {
        ToastsStore.error(error.message);
        self.setState({ isLoading: false });
      });
  };

  changeStatusTimesheets = (status) => {
    const self = this;
    var url = "";
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
  };

  sendRemainder = async () => {
    const self = this;
    this.setState({ isLoading: true });
    let result = await httpClient("timesheet/sendRemainder", "POST", {
      timesheetIds: this.state.timesheetIds,
    });
    self.setState({ isLoading: false });
    if (result.success) {
      ToastsStore.success(result.message);
    } else {
      ToastsStore.error(result.message);
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
        <TimesheetActions
          selectedStatus={this.state.selectedStatus}
          sendToQuickBook={this.sendToQuickBook}
          changeStatusTimesheets={this.changeStatusTimesheets}
          sendRemainder={this.sendRemainder}
          timesheetData={this.state.timesheets.data}
        ></TimesheetActions>
        <TimesheetsTable
          selectedStatus={this.state.selectedStatus}
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
