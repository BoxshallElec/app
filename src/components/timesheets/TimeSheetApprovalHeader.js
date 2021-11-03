import React, { Component } from "react";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { httpClient } from "../../UtilService";
import "./timesheets.css";
import { TIMESHEET_APPROVAL_STATUS } from "../Constant";

class TimesheetApprovalHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSheetCountDetails: {},
    };
  }

  componentDidMount = async () => {
    await this.getTimesheetCount();
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.isUpdateCount !== prevState.isUpdateCount) {
  //     return {
  //       isUpdateCount: nextProps.isUpdateCount,
  //     };
  //   }
  //   return null;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.isUpdateCount !== this.state.isUpdateCount) {
  //     this.setState(
  //       (prevState) => ({
  //         isUpdateCount: this.props.isUpdateCount,
  //       }),
  //       this.getTimesheetCount
  //     );
  //   }
  // }

  getTimesheetCount = async () => {
    this.setState({ isLoading: true });
    let result = await httpClient("timesheet/countForApproval", "GET");
    if (result.success) {
      this.setState({
        timeSheetCountDetails: result.data,
        isLoading: false,
      });
      this.props.selectedStatus
        ? this.props.onStatusSelected(this.props.selectedStatus)
        : this.props.onStatusSelected("pendingApproval");
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting my expenses", "error");
    }
  };

  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <div className="row">
          {TIMESHEET_APPROVAL_STATUS.map((status) => (
            <div
              key={status.value}
              className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"
              onClick={() => this.props.onStatusSelected(status.value)}
            >
              <div
                className={`align-items-center d-flex status-card  ${
                  status.value
                } ${
                  status.value === this.props.selectedStatus ? "selected" : ""
                }`}
              >
                <div className="align-items-center d-flex justify-content-center status-count">
                  {this.state.timeSheetCountDetails
                    ? this.state.timeSheetCountDetails[status.value]
                      ? this.state.timeSheetCountDetails[status.value].count
                      : 0
                    : 0}
                </div>
                <div className="flex-column d-flex justify-content-center">
                  <label>{status.label}</label>
                  <span>
                    {this.state.timeSheetCountDetails
                      ? this.state.timeSheetCountDetails[status.value]
                        ? this.state.timeSheetCountDetails[status.value]
                            .totalHours + " hours"
                        : 0
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default TimesheetApprovalHeader;
