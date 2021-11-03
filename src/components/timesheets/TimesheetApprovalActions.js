import React, { Component } from "react";
import "./timesheets.css";
import "../../css/Employees.css";
import moment from "moment";
import { APPROVAL_STATUS } from "../Constant";
class TimeSheetActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className="tab-content">
          <div className="container-fluid">
            <div className="row">
              {this.props.selectedStatus === "Approved" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={this.props.timesheetData ? false : true}
                        onClick={() =>
                          this.props.changeStatusTimesheets(
                            APPROVAL_STATUS.WITH_APPROVER
                          )
                        }
                      >
                        UnApprove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={this.props.timesheetData ? false : true}
                          onClick={() =>
                            this.props.changeStatusTimesheets(
                              APPROVAL_STATUS.APPROVED
                            )
                          }
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={this.props.timesheetData ? false : true}
                          onClick={() =>
                            this.props.changeStatusTimesheets(
                              APPROVAL_STATUS.REJECTED
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TimeSheetActions;
