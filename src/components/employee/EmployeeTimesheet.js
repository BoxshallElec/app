import React, { Component } from 'react';
import TextField from '../../shared/inputs/TextField';
import "./employee.css"
class EmployeeTimeSheets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeesTimeSheets: [{
                date: "12-02-2020",
                project: "test",
                task: "task",
                hours: "8",
                description: "description",
                billable: "Yes",
                status: "Hold"
            }],
            searchObj: {
                status: ""
            }
        }
    }
    handleChange = (event) => {
        let eve = { ...event };
        this.setState(prevState => ({
            searchObj: {
                ...prevState.searchObj,
                [eve.target.name]: eve.target.value
            }
        }))
    }
    render() {
        return (
            <React.Fragment>
                <div className="d-flex flex-wrap align-items-center employee-time-sheet-filter">
                    <label>Current Period</label>
                    <label>Last Period</label>
                    <label>This Year</label>
                    <div className="form-group">
                        <label
                            className="form-control-label"
                            htmlFor="status"
                        >
                            Status
                         </label>
                        <select
                            className="form-control input-group input-group-alternative"
                            name="status"
                            value={this.state.searchObj.status}
                            onChange={this.handleChange}
                        >
                            <option value="">All</option>
                            <option value="on-hold">On Hold</option>
                            <option value="rejected">Rejected</option>
                            <option value="with-approver">With Approver</option>
                            <option value="approved">Approved</option>
                            <option value="submitted">Submitted</option>
                            <option value="downloaded">Downloaded</option>
                        </select>
                    </div>
                    <div>
                        <TextField label="Start Date"
                            type="date"
                            placeholder="Start Date"
                            name="startDate"
                            value={this.state.startDate}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <TextField label="End Date"
                            type="date"
                            placeholder="End Date"
                            name="endDate"
                            value={this.state.endDate}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <button className="btn btn-primary">Search</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-items-center table-flush mt-2">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Customer:Project</th>
                                <th scope="col">Task</th>
                                <th scope="col">Hours</th>
                                <th scope="col">Description</th>
                                <th scope="col">Billable</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.employeesTimeSheets.map((timeSheet, index) => (
                                <tr key={index}>
                                    <td>
                                        {timeSheet.date}
                                    </td>
                                    <td>
                                        {timeSheet.project}
                                    </td>
                                    <td>{timeSheet.task}</td>
                                    <td>{timeSheet.hours}</td>
                                    <td>{timeSheet.description}</td>
                                    <td>{timeSheet.billable}</td>
                                    <td>
                                        <span> {timeSheet.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="d-flex justify-content-end">
                    <button
                        className="btn  text-uppercase mb-4"
                        type="button"
                        onClick={() => this.props.handleCloseDialog()}
                    >
                        Close
                            </button>
                </div>
            </React.Fragment>
        );
    }
}

export default EmployeeTimeSheets;