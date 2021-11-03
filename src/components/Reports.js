import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import axios from "axios";
import Moment from "moment";
import "../interceptor.js";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import * as Constants from "./Constant";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: []
    };
  }

  componentDidMount() {
    Moment.locale("en");
    var self = this;

    var payload = {
      token: localStorage.getItem("token")
    };

    var url = Constants.BASE_URL+"report/list";

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data.success) {
          console.log(response.data.data);
          self.setState({
            reports: response.data.data
          });
        }
      })
      .catch(function(error) {
        ToastsStore.error(error.message);
      });
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                <th scope="col">Report</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Date</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.state.reports.map((report, index) => (
                <tr key={index}>
                  <th scope="row">
                    <div className="media align-items-center">
                      <a href="/" className="avatar rounded-circle mr-3">
                        <img src={report.evidence} alt={report.report} />
                      </a>
                      <div className="media-body">
                        <span
                          className="d-inline-block text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {report.report}
                        </span>
                      </div>
                    </div>
                  </th>
                  <td>
                    <span
                      className="d-inline-block text-truncate"
                      style={{ maxWidth: "100px" }}
                    >
                      {report.user.name}
                    </span>
                  </td>
                  <td>
                    <span
                      className="d-inline-block text-truncate"
                      style={{ maxWidth: "100px" }}
                    >
                      {report.user.email}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span> {Moment(report.reportedDate).format("LLL")}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="dropdown">
                      <a
                        className="btn btn-sm btn-icon-only text-light"
                        href="/"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <Icon
                          path={mdiDotsVertical}
                          title="Dashboard"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="#000000"
                        />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <a
                          className="dropdown-item"
                          href={"responses/" + report._id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Reports;
