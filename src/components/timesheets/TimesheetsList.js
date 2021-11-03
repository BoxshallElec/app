import React, { Component } from "react";
import { getTimesheetStatus } from "../../UtilService";
import moment from "moment";
class TimesheetsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log("props", this.props.selectedStatus);
    return (
      <React.Fragment>
        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                <th scope="col">Employee Name</th>
                <th scope="col">Client</th>
                {/* <th scope="col">Task</th> */}
                <th scope="col">Hours</th>
                {/* {this.props.canUpdate !== false && <th scope="col">Status</th>} */}
              </tr>
            </thead>
            <tbody>
              {this.props.timesheets.map((timesheet, index) => (
                <tr
                  key={index}
                  //   onClick={() =>
                  //     this.props.handleAddMyExpenseDialog(true, index)
                  //   }
                >
                  <td>
                    <span>{timesheet.employee[0].DisplayName}</span>
                  </td>
                  <td>
                    <span>{timesheet.client[0].DisplayName}</span>
                  </td>
                  {/* <td>
                    <span>{timesheet.task[0].Name}</span>
                  </td> */}
                  <td>
                    <span>{timesheet.Hours}</span>
                  </td>
                  {/* {this.props.canUpdate !== false && (
                    <td>
                      <span>{getTimesheetStatus(timesheet.status)}</span>
                    </td>
                  )} */}
                  <td className="text-right"></td>
                </tr>
              ))}
              {this.props.timesheets.length === 0 && (
                <tr>
                  <td colSpan="5">No Timesheets Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default TimesheetsList;
