import React from "react";
import * as Constants from "../Constant";
import axios from "axios";
import ReactLoading from "react-loading";
import Icon from "@mdi/react";
import { mdiPlusBox, mdiMinusBox } from "@mdi/js";

class ManageTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updates: {},
      edit: false,
      assignedTasks: [],
      unassignedTasks: [],
      employeeSelected: "",
      loading: false,
    };
  }
  componentDidMount() {
    var updates = this.props.teamDetails
      ? this.props.teamDetails.map((td) => ({
          employeeId: td["employeeId"],
          tasks: td.tasks,
        }))
      : [];
    if (this.props.selectedId != undefined) {
      var taskDetails = this.props.teamDetails.filter(
        (td) => td["employeeId"] == this.props.selectedId
      )[0];
      var assignedTaskIds = taskDetails["tasks"];

      var assignedTasks = this.props.taskList.filter(
        (task) => assignedTaskIds.indexOf(task["Id"]) != -1
      );

      var unassignedTask = this.props.taskList.filter(
        (task) => assignedTaskIds.indexOf(task["Id"]) == -1
      );

      this.setState({
        index: true,
        assignedTasks: assignedTasks,
        unassignedTasks: unassignedTask,
        updates: updates,
        employeeSelected: taskDetails["employeeId"],
      });
    } else {
      this.setState({
        index: false,
        assignedTasks: [],
        unassignedTasks: Array.from(this.props.taskList),
        updates: updates,
      });
    }
  }

  assignTask = (event, index) => {
    if (this.state.employeeSelected) {
      var taskToAssign = this.state.unassignedTasks[index]["Id"];
      var assignedTasks = this.state.assignedTasks;
      assignedTasks.push(this.state.unassignedTasks[index]);
      var unassignedTasks = this.state.unassignedTasks;
      var updated = false;
      unassignedTasks.splice(index, 1);
      var updates = this.state.updates;
      for (var i = 0; i < this.state.updates.length; i++) {
        if (updates[i]["employeeId"] == this.state.employeeSelected) {
          updates[i]["tasks"]
            ? updates[i]["tasks"].push(taskToAssign)
            : (updates[i]["tasks"] = [taskToAssign]);
          updated = true;
          break;
        }
      }
      if (!updated) {
        updates.push({
          employeeId: this.state.employeeSelected,
          tasks: [taskToAssign],
        });
      }
      this.setState({
        updates: updates,
        assignedTasks: assignedTasks,
        unassignedTasks: unassignedTasks,
      });
    } else {
      this.props.showToast("Select an employee to assign!", "error");
    }
  };

  handleDropdown = (event) => {
    var updateEmp = this.state.updates.filter(
      (upd) => upd["employeeId"] == event.target.value
    );
    var assignedTasks = [];
    var unassignedTasks = [];
    if (updateEmp && updateEmp.length) {
      assignedTasks = updateEmp[0]["tasks"];
    }
    if (assignedTasks && assignedTasks.length) {
      unassignedTasks = this.props.taskList.filter(
        (ftask) => assignedTasks.indexOf(ftask["Id"]) == -1
      );
      assignedTasks = this.props.taskList.filter(
        (ftask) => assignedTasks.indexOf(ftask["Id"]) != -1
      );
    } else {
      unassignedTasks = Array.from(this.props.taskList);
    }
    this.setState({
      assignedTasks: assignedTasks,
      unassignedTasks: unassignedTasks,
      employeeSelected: event.target.value,
    });
  };

  save = () => {
    var url = Constants.BASE_URL + "client/addToTeam";
    this.setState({ loading: true });
    var payload = {
      teamDetails: this.state.updates,
      token: localStorage.getItem("token"),
      clientId: this.props.data["Id"],
    };
    axios
      .post(url, payload)
      .then((result) => {
        this.setState({ loading: false });
        if (result.data.success) {
          this.props.showToast(result.data.message, "success");
        } else {
          this.props.showToast(result.data.message, "error");
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.showToast(err.message, "error");
      });
  };

  unassignTask = (event, index) => {
    if (this.state.employeeSelected) {
      var taskToUnAssign = this.state.assignedTasks[index];
      var assignedTasks = this.state.assignedTasks;
      assignedTasks.splice(index, 1);
      var unassignedTasks = this.state.unassignedTasks;
      unassignedTasks.push(taskToUnAssign);
      var updates = this.state.updates;
      for (var i = 0; i < updates.length; i++) {
        if (updates[i]["employeeId"] == this.state.employeeSelected) {
          updates[i]["tasks"] = updates[i]["tasks"]
            ? updates[i]["tasks"].filter((task) => task != taskToUnAssign["Id"])
            : [];
          if (!updates[i]["tasks"].length) updates = updates.splice(i, 1);
        }
      }
      this.setState({
        updates: updates,
        assignedTasks: assignedTasks,
        unassignedTasks: unassignedTasks,
      });
    } else {
      this.props.showToast("Select an employee to assign!", "error");
    }
  };

  render() {
    const btnAlign = {
      justifyContent: "center",
      marginTop: "2rem",
    };
    const tablePicker = {
      display: "block",
      maxHeight: "250px",
      overflowY: "auto",
      width: "100%",
      padding: "1rem",
    };
    const borderBox = {
      borderColor: "lightGrey",
      borderRadius: "5px",
      borderStyle: "solid",
      margin: "1rem",
    };
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="task_dialog"
          data-backdrop="static"
          data-keyboard="false"
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
                      <div className="col-8">
                        <h3 className="mb-0">Add employees to project</h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body text-left">
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
                    <section className="container-fluid">
                      <div className="row">
                        <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="dropdown">
                            <div class="form-group">
                              <label
                                className="form-control-label"
                                htmlFor="linkedEmployee"
                              >
                                Select Employee
                              </label>
                              <select
                                className="form-control input-group input-group-alternative"
                                name="linkedEmployee"
                                id="linkedEmployee"
                                value={this.state.employeeSelected}
                                onChange={(e) =>
                                  this.handleDropdown(e, "linkedEmployee")
                                }
                              >
                                <option value=""></option>
                                {this.props.employeeList
                                  ? this.props.employeeList.map(
                                      (emp, index) => (
                                        <React.Fragment>
                                          <option
                                            value={emp.id}
                                            key={`emp${index}`}
                                          >
                                            {emp.displayName}
                                          </option>
                                        </React.Fragment>
                                      )
                                    )
                                  : ""}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="column col-lg-5 col-md-5 col-sm-12 col-xs-12"
                          style={borderBox}
                        >
                          <h3>Tasks Available</h3>
                          <table style={tablePicker}>
                            <tbody>
                              {this.state.unassignedTasks &&
                              this.state.unassignedTasks.length
                                ? this.state.unassignedTasks.map(
                                    (unasgTask, index) => (
                                      <tr>
                                        <td className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <div>
                                            <label>
                                              {unasgTask["FullyQualifiedName"]}
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <div
                                            className="pointer col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                            onClick={(event) =>
                                              this.assignTask(event, index)
                                            }
                                          >
                                            <Icon
                                              path={mdiPlusBox}
                                              color="blue"
                                              title="Add"
                                              size={1}
                                              horizontal
                                              vertical
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )
                                : ""}
                            </tbody>
                          </table>
                        </div>
                        <div
                          className="column col-lg-5 col-md-5 col-sm-12 col-xs-12"
                          style={borderBox}
                        >
                          <h3>Tasks Assigned</h3>
                          <table style={tablePicker}>
                            <tbody>
                              {this.state.assignedTasks &&
                              this.state.assignedTasks.length
                                ? this.state.assignedTasks.map(
                                    (assgnTasks, index) => (
                                      <tr>
                                        <td className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <div>
                                            <label>
                                              {assgnTasks["FullyQualifiedName"]}
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <div
                                            className="pointer col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                            onClick={(event) =>
                                              this.unassignTask(event, index)
                                            }
                                          >
                                            <Icon
                                              path={mdiMinusBox}
                                              color="red"
                                              title="Remove"
                                              size={1}
                                              horizontal
                                              vertical
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )
                                : ""}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="row" style={btnAlign}>
                        <div className="column m-1">
                          <button
                            onClick={this.props.handleCloseDialog}
                            className="btn btn-secondary"
                          >
                            Close
                          </button>
                        </div>
                        <div className="column m-1">
                          <button
                            onClick={this.save}
                            className="btn btn-primary"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ManageTeam;
