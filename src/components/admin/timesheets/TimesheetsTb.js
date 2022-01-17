import React, { Component } from "react";
import "./admin-timesheets.css";
import "../../../css/Employees.css";
import * as Constants from "../../Constant";
import moment from "moment";
import { css, StyleSheet } from "aphrodite/no-important";
import ImgsViewer from "react-images-viewer";
import { getTimesheetStatus } from "../../../UtilService";
import axios from "axios";
class TimesheetsTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        clientList:[],
        employeeId:"",
      };
    }
    componentDidMount(){
        this.getClients();
    }
    getClients = () => {
        var self = this;
        var payload = {
            token:localStorage.getItem("token"),
        };
        var url = Constants.BASE_URL + "client/list";
        axios
        .post(url,payload)
        .then(function(response){
            if(response.data.success){
                self.setState({
                    clientList:response.data,
                });
            }
        })
        .catch(function(error){
            console.log(error)
        });
    }
    render(){
        return <div>{this.state.clientList}</div>
    }
}
export default TimesheetsTable;
