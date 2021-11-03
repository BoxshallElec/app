import React from "react";
import * as Constants from "../Constant";
import axios from "axios";
import ManageTeam from "./ManageTeam";
import moment from "moment";
import ReactLoading from "react-loading";
class CustomerTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      employeeList: [],
      taskList: [],
      teamDetails: [],
      editPopUpOpen: false,
      selectedId: "",
      data: [],
      loading: false,
    };
  }
  handleCloseDialog = (data) => {
    this.props.handleCloseDialog(data);
  };
  showContent(event) {
    document
      .getElementById(event.target.getAttribute("name"))
      .classList.toggle("removeContent");
    var element = event.target;
    element.classList.toggle("active");
  }
  openEditPopUp = (event, index) => {
    var selectedId = event.target.name
      ? event.target.name.split("_")[1]
      : undefined;
    this.setState(
      {
        selectedId: selectedId,
        editPopUpOpen: true,
      },
      () => {
        window.$("#task_dialog").modal("show");
      }
    );
  };
  closeEditPopUp = (event, index) => {
    this.setState({
      editPopUpOpen: false,
      loading: true,
    });
    window.$("#task_dialog").modal("hide");
    var url = Constants.BASE_URL + "client/list";
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios.post(url, payload).then((result) => {
      if (result.data.success) {
        var data = result.data.data.filter(
          (emp) => emp["Id"] == this.props.data["Id"]
        );
        this.setState({
          teams: data[0]["teamDetails"],
          teamDetails: data[0]["employees"],
          data: data[0],
          loading: false,
        });
        this.props.updateCustomers(result.data.data);
      }
    });
  };
  componentDidMount() {
    const self = this;
    var url1 = Constants.BASE_URL + "employee/getAllEmployees";
    var url2 = Constants.BASE_URL + "task/list";
    this.setState({ loading: true });
    var payLoad = {
      token: localStorage.getItem("token"),
    };
    const promises = Promise.all([
      axios.post(url1, payLoad),
      axios.post(url2, payLoad),
    ]);
    promises.then(([res1, res2]) => {
      self.setState({
        teams: this.props.data["teamDetails"],
        employeeList: res1.data.data,
        taskList: res2.data.data,
        teamDetails: this.props.data ? this.props.data["employees"] : [],
        data: this.props.data,
        loading: false,
      });
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
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-link "
            onClick={(event) => this.openEditPopUp(event)}
          >
            Add New Assignment
          </button>
        </div>
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
              {this.state.teams && this.state.teams.length
                ? this.state.teams.map((team, index) => (
                    <React.Fragment>
                      <tr className="thead-light" key={index}>
                        <td>
                          {" "}
                          <div>
                            <div className="form-group mt-4">
                              <span
                                name={"team_" + team.employee.Id}
                                onClick={(event) => this.showContent(event)}
                                className="accordion"
                              ></span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p>{team.employee.DisplayName}</p>
                        </td>
                        <td>
                          {team.beginDate ? (
                            <p>
                              {moment(team.beginDate).format(
                                "Do MMM dddd YYYY"
                              )}
                            </p>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-info"
                            name={"button_" + team.employee.Id}
                            onClick={(event) =>
                              this.openEditPopUp(event, index)
                            }
                          >
                            edit
                          </button>
                        </td>
                      </tr>
                      <tr
                        className="removeContent"
                        id={"team_" + team.employee.Id}
                      >
                        <td></td>
                        <td>
                          <h3>Tasks Assigned</h3>
                          {team["tasks"] ? (
                            team["tasks"].map((task, index) => (
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
            type="button"
            className="btn btn-secondary"
            onClick={() => this.handleCloseDialog()}
          >
            Close
          </button>
        </div>
        {this.state.editPopUpOpen && (
          <ManageTeam
            showToast={this.props.showToast}
            handleCloseDialog={this.closeEditPopUp}
            teamDetails={this.state.teamDetails}
            selectedId={this.state.selectedId}
            taskList={this.state.taskList}
            employeeList={this.state.employeeList}
            data={this.state.data}
          />
        )}
      </React.Fragment>
    );
  }
}

export default CustomerTeam;
