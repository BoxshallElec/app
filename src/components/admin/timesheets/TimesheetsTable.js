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
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { WeeklyCalendar } from 'react-week-picker';
// import '../../../../node_modules/react-week-picker/src/lib/calendar.css';
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
        employeeLinkedList:[],
        select_val:"",
        selectedWeek:"",
        startDate:"",
        endDate:"",
        timesheet:[],
        tsheetstatus:[],
        remainderSheet:[],
        remainderSheetName:[],
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
      url = Constants.BASE_URL + "employee/listlnk";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Response Linked");
            console.log(response.data.data);
              self.setState({
                  employeeLinkedList:response.data.data,
              });
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    getTimesheetofEmployee = (event,employees) =>{
      console.log(employees._id);
      console.log("SS");
      let status = this.props.selectedStatus;
      console.log(this.props.selectedStatus);
      // if(self.state.selectedStatus == ""){
        if(this.props.selectedStatus == "pendingApproval")
          status = "WithApprover";
      //   else
      //     status = "";
      // }
      var self = this;
      var payload = {
          token:localStorage.getItem("token"),
          _id:employees._id,
          status:status,
          startDate:self.state.startDate,
          endDate:self.state.endDate,
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
      // document.getElementsByTagName("INPUT").checked = true;
      
      console.log(this.state.timesheet.length);
      for(let i =0;i<this.state.timesheet.length;i++){
        if(event.target.checked==true){
          document.getElementById("insidecheck"+index).checked = true;
          
        }else{
          document.getElementById("insidecheck"+index).checked = false;
        }
        
      }
    };
    addChecked = (event,index)=>{
      if(event.target.checked){
        console.log("Checked entry");
      }
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
    selectWeek = (event) =>{
      var self = this;
      console.log("Selected Week");
      console.log(event.value);
      self.setState({
        selectedWeek:event.value,
      });
    }
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
    // sendRemainder = (event) =>{
    //   var self = this;
    //   for(let i =0; i<self.state.employeeList.length;i++){
    //     if(document.getElementById("namecheck"+i).checked){
    //       console.log("Selected");
    //       console.log(self.state.timesheet);
    //       let id = self.state.employeeList[i]._id;
    //       for(let j =0;j<self.state.timesheet.length;j++){
    //         console.log("Inside For");
            
    //         if(self.state.timesheet[j].EmployeeRef.value == id){
    //           console.log("Inside if");
    //           self.state.remainderSheet = self.state.remainderSheet + self.state.timesheet[j];
    //         }
            
    //       }
          
    //     }
    //   }
    //   console.log("Remaindersheet");
    //   console.log(self.state.remainderSheet.length);
    //   var payload = {
    //     token:localStorage.getItem("token"),
    //     remainderSheet:self.state.remainderSheet,
    //   };
    //   var url = Constants.BASE_URL + "employee/sendEmail";
    //   axios
    //   .post(url,payload)
    //   .then(function(response){
    //       if(response.data.success){
    //         console.log("Email Sent");
    //       }
    //   })
    //   .catch(function(error){
    //       console.log(error)
    //   });
    // };
    sendRemainder = (event) =>{
      var self = this;
      for(let i =0; i<self.state.employeeList.length;i++){
        if(document.getElementById("namecheck"+i).checked){
          console.log("Selected");
          console.log(self.state.employeeList);
          let id = self.state.employeeList[i]._id;
          for(let j =0;j<self.state.timesheet.length;j++){
            console.log("Inside For");
            
            if(self.state.timesheet[j].EmployeeRef.value == id){
              console.log("Inside if");
              self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
              self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
            }
            
          }
          
        }
      }
      console.log("Remaindersheet");
      console.log(self.state.remainderSheet);
      var payload = {
        token:localStorage.getItem("token"),
        remainderSheet:self.state.remainderSheet,
        name:self.state.remainderSheetName,
      };
      var url = Constants.BASE_URL + "employee/sendEmail";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Email Sent");
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    sendQBO = (event) =>{
      var self = this;
      let datatosend = [];
      for(let i =0; i<self.state.employeeList.length;i++){
        if(document.getElementById("namecheck"+i).checked){
          console.log("Selected");
          console.log(self.state.employeeList);
          let id = self.state.employeeList[i]._id;
          for(let j =0;j<self.state.timesheet.length;j++){
            console.log("Inside For");
            
            if(self.state.timesheet[j].EmployeeRef.value == id){
              console.log("Inside if");
              datatosend = self.state.timesheet;
              break;
              // self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
              // self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
            }
            
          }
          
        }
      }
      console.log("Data to be sent");
      console.log(datatosend);
      var payload = {
        token:localStorage.getItem("token"),
        datatosend : datatosend
      };
      var url = Constants.BASE_URL + "employee/createQBOTime";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Time Activity successfully added to Quicbook");
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    sendInvoiceQBO = (event) =>{
      var self = this;
      let datatosend = [];
      let totalprice = 0;
      let name = "";
      for(let i =0; i<self.state.employeeList.length;i++){
        if(document.getElementById("namecheck"+i).checked){
          console.log("Selected");
          console.log(self.state.employeeList);
          let id = self.state.employeeList[i]._id;
          name = self.state.employeeList[i].DisplayName;
          for(let j =0;j<self.state.timesheet.length;j++){
            console.log("Inside For");
            
            if(self.state.timesheet[j].EmployeeRef.value == id){
              console.log("Inside if");
              datatosend = self.state.timesheet;
              // totalprice = datatosend[i]
              break;
              // self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
              // self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
            }
            
          }
          
        }
      }
      for(let i =0;i<datatosend.length;i++){
        totalprice = totalprice + datatosend[i].Hours;
      }
      console.log("Data to be sent");
      console.log(datatosend);
      var payload = {
        token:localStorage.getItem("token"),
        totalprice : totalprice,
        datatosend : datatosend,
        name : name
      };
      var url = Constants.BASE_URL + "employee/createQBOInvoice";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Invoice successfully added to Quicbook");
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    makePaymentQBO = (event) =>{
      var self = this;
      let datatosend = [];
      let totalprice = 0;
      let name = "";
      let id ="";
      for(let i =0; i<self.state.employeeList.length;i++){
        if(document.getElementById("namecheck"+i).checked){
          console.log("Selected");
          console.log(self.state.employeeList);
          id = self.state.employeeList[i]._id;
          name = self.state.employeeList[i].DisplayName;
          for(let j =0;j<self.state.timesheet.length;j++){
            console.log("Inside For");
            
            if(self.state.timesheet[j].EmployeeRef.value == id){
              console.log("Inside if");
              datatosend = self.state.timesheet;
              // totalprice = datatosend[i]
              break;
              // self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
              // self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
            }
            
          }
          
        }
      }
      for(let i =0;i<datatosend.length;i++){
        totalprice = totalprice + datatosend[i].Hours;
      }
      console.log("Data to be sent");
      console.log(datatosend);
      var payload = {
        token:localStorage.getItem("token"),
        totalprice : totalprice,
        datatosend : datatosend,
        id : id
      };
      var url = Constants.BASE_URL + "employee/createQBOPayments";
      axios
      .post(url,payload)
      .then(function(response){
          if(response.data.success){
            console.log("Payment successfully added to Quicbook");
          }
      })
      .catch(function(error){
          console.log(error)
      });
    };
    downloadTimeSheets = (event) => {
      const self = this;
      const fileName = "demo";
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    console.log("Inside function");
    // console.log(apiData);
    let apiDatamoneySuper = [];
    let apiDatamoneyrate = [];
    let datatodownload = [];
    let name = "";
    let linkeddata = [];
    for(let i =0; i<self.state.employeeList.length;i++){
      if(document.getElementById("namecheck"+i).checked){
        console.log("Selected");
        console.log(self.state.employeeList);
        let id = self.state.employeeList[i]._id;
        name = self.state.employeeList[i].DisplayName;
        for(let j =0;j<self.state.timesheet.length;j++){
          console.log("Inside For");
          
          if(self.state.timesheet[j].EmployeeRef.value == id){
            console.log("Inside if");
            datatodownload = self.state.timesheet;
            break;
            // self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
            // self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
          }
          
          
        }
        
        for(let j =0;j<self.state.employeeLinkedList.length;j++){
          if(self.state.employeeLinkedList[j].monogoid == id){
            console.log("Inside if mongo");
            linkeddata = self.state.employeeLinkedList[j];
            break;
            // self.state.remainderSheet = self.state.remainderSheet + self.state.employeeList[i].email;
            // self.state.remainderSheetName = self.state.remainderSheetName + self.state.employeeList[i].DisplayName;
          }
        }
        
      }
    }
    console.log(datatodownload);
    let output = [];
    for(let i =0 ;i<datatodownload.length;i++){
      output[i] =  {
        Supplier: name,
        BillNo: "1",
        BillDate :datatodownload[i].StartTime,
        DueDate : datatodownload[i].StartTime,
        Product_Service : name,
        Product_ServiceDescription : name + datatodownload[i].StartTime + datatodownload[i].Description,
        Product_ServiceQuantity : datatodownload[i].Hours,
        Product_ServiceRate : linkeddata.rate,
        Product_ServiceBillableStatus : datatodownload[i].BillableStatus,
        Product_ServiceTaxCode : datatodownload[i].StartTime, 
        Product_ServiceMarkupPercent : datatodownload[i].StartTime,
        Billable_CustomerProduct_Service : datatodownload[i].CustomerRef.value,
        Product_Class : datatodownload[i].ItemRef.value,
        Category : "super",
        Category_Description : name + datatodownload[i].StartTime + datatodownload[i].Description,
        Category_Amount : (parseInt(datatodownload[i].Hours) * parseInt(linkeddata.rate) /10).toString(),
        Category_TaxCode : datatodownload[i].Hours,
        Category_Billable : datatodownload[i].BillableStatus,
        Catagoy_MarkupPercent : datatodownload[i].Hours,
        Category_Billablecustomer : datatodownload[i].CustomerRef.value,
        Category_Class : datatodownload[i].ItemRef.value,
      }
    }
    
    console.log(output[0]);
    const ws = XLSX.utils.json_to_sheet(output);
  
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
   
    
    FileSaver.saveAs(data, fileName + fileExtension);
    }
    handleJumpToCurrentWeek = (currenDate) => {
      console.log(`current date: ${currenDate}`);
    }
  
    handleWeekPick = (startDate, endDate) => {
      console.log(typeof(startDate));
      const dateArray = startDate.split(" ");
      console.log(dateArray[0]);
      let mon = (new Date(Date.parse(dateArray[1] +" 1, 2012")).getMonth()+1);
      if(mon<10)
        mon = "" + new Date(Date.parse(dateArray[1] +" 1, 2012")).getMonth()+1;
      else
        mon = new Date(Date.parse(dateArray[1] +" 1, 2012")).getMonth()+1;
      // let mon = "Feb";
      startDate = dateArray[2]+"-"+mon+"-"+dateArray[0];
      // startDate = new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
      // startDate = 
      const dateArrayed = endDate.split(" ");
      console.log(dateArrayed[0]);
      let month = (new Date(Date.parse(dateArrayed[1] +" 1, 2012")).getMonth()+1);
      if(month<10)
        month = "" + new Date(Date.parse(dateArrayed[1] +" 1, 2012")).getMonth()+1;
      else
        month = new Date(Date.parse(dateArray[1] +" 1, 2012")).getMonth()+1;
      // let mon = "Feb";
      endDate = dateArrayed[2]+"-"+month+"-"+dateArrayed[0];
      console.log(`${startDate} to ${endDate}`);
      var self = this;
      self.setState({
        startDate:startDate,
        endDate:endDate,
    });
      
    }
    render(){
        return (
          
          <div> 
            {console.log("Props TSSSSS")}
            {console.log(this.props)}
            {this.props.selectedStatus=='WithEmployee' ?
                <button
                // className="dropdown-item"
                className="btn btn-icon btn-3 btn-primary text-right"
                type="button"
                data-toggle="modal"
                onClick={(event) => this.sendRemainder(event)}
              >
              Send Remainder 
              </button>
              :
              <div></div>
            }
            {this.props.selectedStatus=='pendingApproval' ?
                <button
                // className="dropdown-item"
                className="btn btn-icon btn-3 btn-primary text-right"
                type="button"
                data-toggle="modal"
                onClick={(event) => this.sendRemainder(event)}
              >
              Approve 
              </button>
              :
              <div></div>
            }
            {this.props.selectedStatus=='WithApprover' ?
            <div>
            <button
            // className="dropdown-item"
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
            data-toggle="modal"
            onClick={(event) => this.sendQBO(event)}
          >
          Send To QuickBooks 
          </button>
          <button
          // className="dropdown-item"
          className="btn btn-icon btn-3 btn-primary text-right"
          type="button"
          data-toggle="modal"
          onClick={(event) => this.downloadTimeSheets(event)}
        >
        Download Data 
        </button>
        <button
            // className="dropdown-item"
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
            data-toggle="modal"
            onClick={(event) => this.sendInvoiceQBO(event)}
          >
          Generate Invoice
          </button>
          <button
            // className="dropdown-item"
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
            data-toggle="modal"
            onClick={(event) => this.makePaymentQBO(event)}
          >
          Make Payment
          </button>
        </div>
          :
          <div></div>
            }
            <br></br>
            <WeeklyCalendar value = {this.state.selectedWeek} onWeekPick={this.handleWeekPick} jumpToCurrentWeekRequired={true} onJumpToCurrentWeek={this.handleJumpToCurrentWeek}/>
            {/* Sort By: */}
            {/* <Select options={options} onChange={this.selectedOption} value={this.state.select_val}/> */}
            
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
                        <input type="checkbox" id={"namecheck"+index} className={"namecheck"+index} onClick={(e) =>this.checkAll(e,index)}></input> 
                        {/* onChange={(e) => this.checkAll(e,index)}  */}
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
                              {/* {console.log("DEEEEMOOOTSS")} */}
                              <MDBTable autoWidth>
                                <thead>
                                  <tr>
                                    
                                  {/* {console.log("insidecheck"+index)} */}
                                    <th><input type="checkbox" id={"ind"+"insidecheck"+ind} class={"ind"+"insidecheck"+ind} name={"ind"+"insidecheck"+ind} value="head" onChange={(e) => this.addChecked(e,index)}></input>&nbsp;&nbsp;CLIENT</th>
                                   
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
                      <Accordion.Body>
                      <MDBTable autoWidth>
                                <thead>
                                  <tr>
                                    <th><input type="checkbox" id={"insidecheck"+index} class={"insidecheck"+index} name={"insidecheck"+index} value="head"></input>&nbsp;&nbsp;CLIENT</th>
                                  {/* </tr>
                                  <tr> */}
                                    
                                  {/* </tr>
                                  <tr> */}
                                    <th>TASKS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>BILLABLE STATUS</th>
                                  {/* </tr>
                                  <tr> */}
                                    <th>DATE UPDATED</th>
                                    <th>HOURS</th>
                                  </tr>
                                </thead>
                                </MDBTable>
                      {this.state.timesheet.map((employeetime,ind) => (
                        // <Accordion.Body>
                          <MDBTable autoWidth responsive>
                                <tbody>
                                  <tr>
                                    <td>{employeetime.CustomerRef.value}</td>
                                  {/* </tr> */}
                                  {/* <tr> */}
                                    
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
                                    <td>{employeetime.Hours}</td>
                                  </tr>
                                </tbody>
                              
                              </MDBTable>
                        

                     
                      ))}
                     </Accordion.Body>
                  </Accordion.Item>
                  ))}
                  
                </Accordion> 
             )}
                     
          </div>
        );
    }
}
export default TimesheetsTable;
