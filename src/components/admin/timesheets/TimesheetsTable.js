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
import {Accordion} from 'react-bootstrap';
import Select from 'react-select';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

const options = [
  { value: 'Employees', label: 'Employees' },
  { value: 'Date', label: 'Date' },
  ]
class TimesheetsTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isToggle:true,
        clientList:[],
        employeeList:[],
        select_val:"",
        timesheet:[],
        tsheetstatus:[],
        dayaccord:[],
        tsdate:[],
        employeeId:"",
        loading:false,
        selectedStatus:"",
      };
    }
    componentDidMount(){
        this.getClients();
        this.getEmployees();
    }
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.selectedStatus !== this.state.selectedStatus) {
        this.setState({
          loading:true,
        });
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
    };
    getEmployees = () => {
      var self = this;
      var payload = {
          token:localStorage.getItem("token"),
      };
      var url = Constants.BASE_URL + "employee/list";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Response");
            console.log(response.data.data);
              self.setState({
                  employeeList:response.data.data,
              });
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    getTimesheetofEmployee = (event,employees) =>{
      console.log(employees._id);
      var self = this;
      var payload = {
          token:localStorage.getItem("token"),
          _id:employees._id,
          status:self.state.selectedStatus,
      };
      var url = Constants.BASE_URL + "timesheet/listByEmployee";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
              self.setState({
                  timesheet:response.data.data,
              });
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    checkAll = (event,index) =>{
      document.getElementsByTagName("INPUT").checked = true;
    };
    selectedOption = (event) => {
      var self = this;
      self.setState({
        select_val:event.value,
      });
      if(event.value=='Date'){
        
        var payload = {
            token:localStorage.getItem("token"),
            status:self.state.selectedStatus,
        };
        var url = Constants.BASE_URL + "timesheet/listByStatus";
        axios
        .post(url,payload)
        .then(function(response){
            if(response.data.success){
              console.log("ResponseE");
              console.log(response.data.data);
                self.setState({
                    tsheetstatus:response.data.data,
                    // dayaccord:response.data.data.StartTime,
                });
                console.log(self.state.tsheetstatus);
              let daytemp = [];
              for(let i =0; i < self.state.tsheetstatus.length; i++){
                daytemp[i] = self.state.tsheetstatus[i].StartTime;
              }
              daytemp = daytemp.sort();
              let dayaccordtemp = [...new Set(daytemp)];
              console.log(dayaccordtemp);
              self.setState({
                  dayaccord:dayaccordtemp,
              });
            }
        })
        .catch(function(error){
            console.log(error)
        });
        
      }
    };
    getTimesheetfromTime = (event,day) => {
      var self = this;
      let tsheetCopy = [];
      let j =0;
      for(let i =0;i<self.state.tsheetstatus.length;i++){
        console.log(self.state.tsheetstatus[i]);
        if(self.state.tsheetstatus[i].StartTime == day){
          tsheetCopy[j] = self.state.tsheetstatus[i];
          j++;
        }
      }
      self.setState({
        tsdate:tsheetCopy,
      });
      // console.log(self.state.tsheetstatus);
    };
    render(){
        return (
         
          <div> Sort By:
            <Select options={options} onChange={this.selectedOption} value={this.state.select_val}/>
            
            {this.state.select_val=='Date' ?
             (
              //  <Accordion id ="accordian">
              //     {this.state.tsheetstatus.map((employees,index) => (
              //       <Accordion.Item eventKey={index}>
              //       </Accordian.Item>
              //     ))}
              //  </Accordion>
              
               <Accordion id ="accordian">
                  {console.log(this.state.dayaccord)}
                  {this.state.dayaccord.map((day,index) => (
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header onClick={(e) => this.getTimesheetfromTime(e,day)} >
                        <input type="checkbox" id={"namecheck"+index} className={"namecheck"+index} onChange={(e) => this.checkAll(e,index)}></input>
                          &nbsp;&nbsp;{new Date(day).toLocaleDateString('en-GB',{day: 'numeric', month: 'short', year: 'numeric'})}
                      </Accordion.Header>
                      {this.state.tsdate.map((dateentry,ind) => (
                        // <Accordion.Item eventKey={ind}>
                        <Accordion.Body>
                          <Accordion>
                            <Accordion.Item eventKey={ind}> 
                              <Accordion.Header>
                                {dateentry.EmployeeRef.value}
                              </Accordion.Header>
                              
                              <Accordion.Body>
                              <MDBTable>
                                <thead>
                                  <tr>
                                    <th><input type="checkbox" id={"insidecheck"+index} class={"insidecheck"+index} name={"insidecheck"+index} value="head"></input>&nbsp;&nbsp;CLIENT</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>HOURS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>TASKS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>BILLABLE STATUS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>DATE UPDATED</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{dateentry.CustomerRef.value}</td>
                                  {/* </tr> */}
                                  {/* <tr> */}
                                    <td>{dateentry.Hours}</td>
                                  {/* </tr>
                                  <tr>
                                     */}
                                    <td>{dateentry.ItemRef.value}</td>
                                  {/* </tr>
                                  <tr>
                                     */}
                                    <td>{dateentry.BillableStatus}</td>
                                  {/* </tr>
                                  <tr> */}
                                    
                                    <td>{dateentry.StartTime}</td>
                                  </tr>
                                </tbody>
                              
                              </MDBTable>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                          

                      </Accordion.Body>
                      // </Accordion.Item>
                        // <Accordion activeKey={ind}>
                        //   <Accordion.Item eventKey={ind}> 
                        //     <Accordion.Header>
                        //       Demo
                        //     </Accordion.Header>
                        //     <Accordion.Body>
                        //       Ahhan
                        //     </Accordion.Body>
                        //   </Accordion.Item>
                        // </Accordion>
                       ))}
                    
                  </Accordion.Item>
                  ))}
                  
                </Accordion> 
             )
             :(
               <Accordion id ="accordian">
                  {this.state.employeeList.map((employees,index) => (
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header onClick={(e) => this.getTimesheetofEmployee(e,employees)} >
                        <input type="checkbox" id={"namecheck"+index} className={"namecheck"+index} onChange={(e) => this.checkAll(e,index)}></input>
                          &nbsp;&nbsp;{employees.DisplayName}
                      </Accordion.Header>
                      {this.state.timesheet.map((employeetime,ind) => (
                        <Accordion.Body>
                          <MDBTable>
                                <thead>
                                  <tr>
                                    <th><input type="checkbox" id={"insidecheck"+index} class={"insidecheck"+index} name={"insidecheck"+index} value="head"></input>&nbsp;&nbsp;CLIENT</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>HOURS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>TASKS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>BILLABLE STATUS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>DATE UPDATED</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{employeetime.CustomerRef.value}</td>
                                  {/* </tr> */}
                                  {/* <tr> */}
                                    <td>{employeetime.Hours}</td>
                                  {/* </tr>
                                  <tr>
                                     */}
                                    <td>{employeetime.ItemRef.value}</td>
                                  {/* </tr>
                                  <tr>
                                     */}
                                    <td>{employeetime.BillableStatus}</td>
                                  {/* </tr>
                                  <tr> */}
                                    
                                    <td>{employeetime.StartTime}</td>
                                  </tr>
                                </tbody>
                              
                              </MDBTable>
                          {/* <table>
                            <tr>
                              <th><input type="checkbox" id={"insidecheck"+index} class={"insidecheck"+index} name={"insidecheck"+index} value="head"></input>&nbsp;&nbsp;CLIENT</th>
                              <td>{employeetime.CustomerRef.value}</td>
                            </tr>
                            <tr>
                              <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HOURS</th>
                              <td>{employeetime.Hours}</td>
                            </tr>
                            <tr>
                              <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TASKS</th>
                              <td>{employeetime.ItemRef.value}</td>
                            </tr>
                            <tr>
                              <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BILLABLE STATUS</th>
                              <td>{employeetime.BillableStatus}</td>
                            </tr>
                            <tr>
                              <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATE UPDATED</th>
                              <td>{employeetime.StartTime}</td>
                            </tr>
                          </table> */}

                      </Accordion.Body>
                      ))}
                    
                  </Accordion.Item>
                  ))}
                  
                </Accordion> 
             )}
                     
          </div>
        );
    }
}
export default TimesheetsTable;
