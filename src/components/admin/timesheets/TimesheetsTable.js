import React, { Component } from "react";
import "./admin-timesheets.css";
import "../../../css/Employees.css";
import "../../../css/Timesheet.css"
import * as Constants from "../../Constant";
import moment from "moment";
import { css, StyleSheet } from "aphrodite/no-important";
import ImgsViewer from "react-images-viewer";
import { getTimesheetStatus } from "../../../UtilService";
import axios from "axios";
import { setDefaultLocale } from "react-datepicker";
class TimesheetsTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isToggle:true,
        clientList:[],
        employeeId:"",
        clientWork:[],
        temp:[],
        selectedStatus:"",
      };
    }
    componentDidMount(){
        this.getClients();
    }
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.selectedStatus !== this.state.selectedStatus) {
        this.setState({ clientWork: [], isToggle:true, });
        var inputs = document.querySelectorAll("input[type='checkbox']");
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].checked = false;
        }
      }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.selectedStatus !== prevState.selectedStatus) {
        return {
          selectedStatus: nextProps.selectedStatus,
        };
      }
      return null;
    }
    // Make getEmployees instead of clients
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
                    clientList:response.data.data,
                    temp:response.data.data[0],
                });
            }
        })
        .catch(function(error){
            console.log(error)
        });
    }
    toggleClientDisplay = (CompanyName,index) =>{
      // var self = this;  
      // if(self.state.isToggle){
      //   self.setState({
      //         isToggle : false,
      //     })
      //   }
      // else{
      //   self.setState({
      //     isToggle: true,
      //   })
      // }
      
      var node = document.getElementById("td"+index);
      document.getElementById("i"+index).className = "fas fa-minus";
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
      
      var self = this;
      if(self.state.isToggle){
        self.setState({
          isToggle : false,
        })
        // document.getElementById("td"+index).style.display="block";
        // document.getElementById("td"+index).style.columnSpan="all";
        var payload ={
          token:localStorage.getItem("token"),
          customerref: CompanyName,
          statusVal: this.props.selectedStatus,
        };
        var url = Constants.BASE_URL + "timesheet/listByCompany";
        axios
        .post(url,payload)
        .then(function(response){
          if(response.data.success){
            self.setState({
              clientWork:response.data.data});
            console.log("Works:"); 
            for(let i =0;i<self.state.clientWork.length;i++){
              // document.getElementById("div"+index).innerHTML =             
              var child_node = document.createElement("label");
              var text = document.createTextNode("Employee: "+self.state.clientWork[i].Hours);
              child_node.appendChild(text);
              document.getElementById("td"+index).appendChild(child_node);
  
              var child_node = document.createElement("label");
              var text = document.createTextNode("HOURS: "+self.state.clientWork[i].Hours);
              child_node.appendChild(text);
              document.getElementById("td"+index).appendChild(child_node);
             
              var child_node = document.createElement("label");
              var text = document.createTextNode("Billable Status: "+self.state.clientWork[i].BillableStatus);
              child_node.appendChild(text);
              document.getElementById("td"+index).appendChild(child_node);
              var h2 = document.createElement("h2");
              document.getElementById("td"+index).appendChild(h2);
            }
            // document.getElementById("l"+index+"in"+ind).innerHTML = self.state.clientWork[0].Hours;
          }
        })
        .catch(function(error){
          console.log("ERROR");
        });
      }else{
        self.setState({
          isToggle : true,
        })
        document.getElementById("i"+index).className = "fas fa-plus";
        var node = document.getElementById("td"+index);
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
      }

    }
    
    render(){
        return (
          <div>{this.state.clientList.map((clients,index) => (
            <table className="clientTable">
              <tr >
              <td>{clients.CompanyName}</td>
              {/* {!this.state.isToggle ? 
                <button className="btn" onClick={this.toggleClientDisplay(clients.CompanyName)}><i class="fas fa-plus"></i></button>
                :
                <button className="btn" onClick={this.toggleClientDispla(clients.CompanyName)}><i class="fas fa-minus"></i></button>
              } */}
              {/* <button className="btn" onClick={this.toggleClientDisplay} ><i class="fas fa-plus" id="btn1"></i></button> */}
              <td>
              <button
                          className="btn"
                          // type="button"
                          // data-toggle="modal"
                          onClick={() => this.toggleClientDisplay(clients.CompanyName,index)}
                        >
                          <i className="fas fa-plus" id={"i"+index}></i>
                        </button>
              </td>
              
              </tr>
              <tr >
                <td id={"td"+index} colspan="2" className="tdDisplay">
                  {/* {this.state.clientWork.map((work,ind) => (
                    <label id={"l"+index+"in"+ind}>{work.Hours}</label>
                  )
                  )}
                  <label></label> */}
                </td>
              </tr>
              {/* <div>{this.state.clientWork.map((work,index1) => (
                <div id={"div"+index}>{work.Hours}</div>
              )

              )}</div> */}
            </table>
          )
          )}
            
          </div>
        );
    }
}
export default TimesheetsTable;
