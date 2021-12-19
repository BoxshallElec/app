import React, { Component } from "react";
import "./admin-timesheets.css";
import "../../../css/Employees.css";
import moment from "moment";
import { APPROVAL_STATUS, TIMESHEET_STATUS } from "../../Constant";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class TimeSheetActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  deleteConfirm = () => {
    const self = this;
    if (
      window.confirm(
        "By proceeding you will be deleting the record permanently!"
      )
    ) {
      self.props.changeStatusTimesheets("Delete");
    }
  };
  render() {
    return (
      
      <React.Fragment>
        {console.log("Timehett")}
        {console.log(this.props.timesheetData)};
        <div className="tab-content">
          <div className="container-fluid">
            <div className="row">
              {this.props.selectedStatus === "Approved" ? (
                <div className="col-xl-3 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={this.props.timesheetData ? false : true}
                        onClick={this.props.sendToQuickBook}
                      >
                        Send To Quickbook

                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus === "Approved" || this.props.selectedStatus === "WithApprover" ? (
                <div className="col-xl-3 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.DownloadTimesheet}
                        // disabled={this.props.timesheetData ? false : true}
                      >
                        Download Timesheet
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={this.props.sendRemainder}
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Send Remainder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          this.props.changeStatusTimesheets(
                            APPROVAL_STATUS.APPROVED
                          )
                        }
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithApprover" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={this.props.sendRemainder}
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Send Remainder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "Approved" ||
              this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() =>
                          this.props.changeStatusTimesheets(
                            APPROVAL_STATUS.ARCHIVED
                          )
                        }
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Move to Archive
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "Archived" ? (
                <React.Fragment>
                  <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={this.props.timesheetData ? false : true}
                        >
                          Download Again
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={this.deleteConfirm}
                          disabled={this.props.timesheetData ? false : true}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TimeSheetActions;
