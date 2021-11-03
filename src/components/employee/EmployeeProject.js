import React from "react";
import * as Constants from "../Constant";
import axios from "axios";
import moment from "moment";
import ReactLoading from "react-loading";

class EmployeeProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: [],
      tasks: {},
      beginDates: {},
    };
  }
  showContent(event) {
    document
      .getElementById(event.target.getAttribute("name"))
      .classList.toggle("removeContent");
    var element = event.target;
    element.classList.toggle("active");
  }
  componentDidMount() {
    var payLoad = {
      token: localStorage.getItem("token"),
      empId: this.props.employeeId,
    };
    var url1 = Constants.BASE_URL + "client/retriveClientForEmployee";
    var url2 = Constants.BASE_URL + "task/list";
    const promises = Promise.all([
      axios.post(url1, payLoad),
      axios.post(url2, payLoad),
    ]);
    promises.then(([res1, res2]) => {
      if (res1.data.success) {
        var clients = res1.data.data;
        var tasks = {};
        var beginDates = [];
        if (clients && clients.length) {
          clients.forEach((cli) => {
            var taskEmp =
              cli["employees"] && cli["employees"].length
                ? cli["employees"].filter(
                    (emp) => emp["employeeId"] == this.props.employeeId
                  )
                : [];
            if (taskEmp.length) {
              var task = [];
              if (
                res2.data.success &&
                taskEmp[0]["tasks"] &&
                taskEmp[0]["tasks"].length
              ) {
                task = res2.data.data.filter(
                  (task) => taskEmp[0]["tasks"].indexOf(task["Id"]) != -1
                );
              }
              //var task = taskEmp[0]["tasks"];
              var beginDate = taskEmp[0]["beginDate"];
              tasks[cli["Id"]] = task;
              beginDates.push({ [cli["Id"]]: beginDate });
            }
          });
          this.setState({
            projectData: res1.data.data,
            tasks: tasks,
            beginDates: beginDates,
          });
        }
      } else {
        this.props.showToast(res1.data.message, "error");
      }
    });
  }

  render() {
    return (
      <React.Fragment>
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
        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                <th></th>
                <th scope="col">Name</th>
                <th scope="col">Begin Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.projectData && this.state.projectData.length
                ? this.state.projectData.map((cli, index) => (
                    <React.Fragment>
                      <tr className="thead-light" key={index}>
                        <td>
                          <div className="form-group mt-4">
                            <span
                              name={"client_" + cli.Id}
                              onClick={(event) => this.showContent(event)}
                              className="accordion"
                            ></span>
                          </div>
                        </td>{" "}
                        <td>
                          <p>{cli.DisplayName}</p>
                        </td>
                        <td>
                          <p>
                            {moment(this.state.beginDates[cli.Id]).format(
                              "Do MMM dddd YYYY"
                            )}
                          </p>
                        </td>
                        <td>
                          <button
                            className="btn btn-info"
                            name={"client_" + cli.Id}
                          >
                            edit
                          </button>
                        </td>
                      </tr>
                      <tr className="removeContent" id={"client_" + cli.Id}>
                        <td></td>
                        <td>
                          <h3>Tasks Assigned</h3>
                          {this.state.tasks && this.state.tasks[cli.Id] ? (
                            this.state.tasks[cli.Id].map((task, index) => (
                              <p>{task.FullyQualifiedName}</p>
                            ))
                          ) : (
                            <p>No Active tasks!</p>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn text-uppercase mb-4"
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

export default EmployeeProject;
