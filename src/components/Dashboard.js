import React, { Component } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import * as Constants from "./Constant";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data",
      fill: false,
      lineTension: 0.1,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data
    };
  }

  componentDidMount() {
    var payload = {
      token: localStorage.getItem("token")
    };

    var url = Constants.BASE_URL+"user/graphs";

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data.success) {
          var labels = [];
          var counts = [];
          console.log(response.data.data);
          const dict = response.data.data;
          for (var value in dict) {
            labels.push(dict[value].user.name);
            counts.push(dict[value].count);
          }

          // self.setState({ data: data });
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
          <div className="col-xl-8 mb-5 mb-xl-0">
            <div className="card bg-gradient-default shadow">
              <div className="card-header bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Survey by employees</h2>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart">
                  <Line data={this.state.data} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card shadow">
              <div className="card-header bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Survey by employees</h2>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart">
                  <Bar
                    data={this.state.data}
                    width={100}
                    height={50}
                    options={{
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
