import React, { Component } from "react";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import Icon from "@mdi/react";
import { mdiAccount, mdiNoteText, mdiForum, mdiPackage } from "@mdi/js";
import * as Constants from "./Constant";

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {
        userCount: 0,
        surveyCount: 0,
        responseCount: 0,
        productCount: 0
      }
    };
  }

  componentDidMount() {
    var self = this;

    var payload = {
      token: localStorage.getItem("token")
    };

    var url = Constants.BASE_URL + "user/reports";

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data.success) {
          console.log(response.data.data);
          self.setState({ reports: response.data.data });
        } else {
          // ToastsStore.error(response.data.message);
        }
      })
      .catch(function(error) {
        // ToastsStore.error(error.message);
      });
  }

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <div className="row">
          <div className="col-xl-3 col-lg-6">
            <div className="card card-stats mb-4 mb-xl-0">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Users
                    </h5>
                    <span className="h2 font-weight-bold mb-0">
                      {this.state.reports.userCount}
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                      <Icon
                        path={mdiAccount}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="card card-stats mb-4 mb-xl-0">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Surveys
                    </h5>
                    <span className="h2 font-weight-bold mb-0">0</span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <Icon
                        path={mdiNoteText}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="card card-stats mb-4 mb-xl-0">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Response
                    </h5>
                    <span className="h2 font-weight-bold mb-0">0</span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                      <Icon
                        path={mdiForum}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="card card-stats mb-4 mb-xl-0">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Products
                    </h5>
                    <span className="h2 font-weight-bold mb-0">0</span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <Icon
                        path={mdiPackage}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffffff"
                      />
                    </div>
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

export default Graphs;
