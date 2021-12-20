import React, { Component } from "react";
import "./admin-timesheets.css";
import "../../../css/Employees.css";
import moment from "moment";
import { APPROVAL_STATUS, TIMESHEET_STATUS } from "../../Constant";
// import ReactExport from "react-export-excel";
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import * as Constants from "../../Constant";
import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


class TimeSheetActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailList:[],
    };
  }
  componentDidMount() {
    this.getEmployeeDetails();
    
    // this.sendApproval(this.state.timesheets,0);
  }
  getEmployeeDetails = () =>{
    var url = Constants.BASE_URL + "employee/listDetails";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          console.log("Empl link");
          console.log(response.data.data);
          self.setState({detailList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }
  deleteConfirm = () => {
    const self = this;
    if (
      window.confirm(
        "By proceeding you will be deleting the record permanently!"
      )
    ) {
      self.props.changeStatusTimesheets("Delete");
    }
  };
  DownloadTimesheet = (event,apiData,fileName) =>{
    const self = this;
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    console.log("Inside function");
    console.log(apiData);
    let apiDatamoneySuper = [];
    let apiDatamoneyrate = [];
    for(let i =0;i<apiData.length;i++){
      apiData[i].EmployeeRef = apiData[i].EmployeeRef.value;
      apiData[i].CustomerRef = apiData[i].CustomerRef.value;
      apiData[i].ItemRef = apiData[i].ItemRef.value;
      let flag =0;
      for(let j =0;j<self.state.detailList.length;j++){
        if(self.state.detailList[j].mongoid==apiData[i].EmployeeRef){
          // apiData.super[i] = self.state.detailList.superPercentage;
          console.log("Super");
          console.log(self.state.detailList[j].superPercentage);
          apiData[i].superPercentage = self.state.detailList[j].superPercentage;
          apiData[i].hourlyRate = self.state.detailList[j].rate;
          
          flag = 1;
        }
      }
      if(flag != 0){
        apiData[i].superPercentage = 1;
        apiData[i].hourlyRate = 1;
      }
      apiData[i].totalAmount = parseInt(apiData[i].Hours)*parseInt(apiData[i].hourlyRate);
      apiData[i].totalSuper = parseInt(apiData[i].totalAmount)*parseInt(apiData[i].superPercentage)/100;
      apiData[i].finalDescription = apiData[i].StartTime + self.state.detailList[i].superBase + self.state.detailList[i].superPayable;
      
    }
  
    // apiData = apiData + apiDatamoneySuper + apiDatamoneyrate;
    // console.log(apiData[0].EmployeeRef.value);
    // apiData.EmployeeRef = apiData.EmployeeRef.value;
    // const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
  
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
   
    
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  render() {
    return (
      
      <React.Fragment>
        {console.log("Timehett")}
        {console.log(this.props)};
        <div className="tab-content">
          <div className="container-fluid">
            <div className="row">
              {this.props.selectedStatus === "Approved" ? (
                <div className="col-xl-3 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={this.props.timesheetData ? false : true}
                        onClick={this.props.sendToQuickBook}
                      >
                        Send To Quickbook

                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus === "Approved" || this.props.selectedStatus === "WithApprover" ? (
                <div className="col-xl-3 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        
                        onClick={(event) => this.DownloadTimesheet(event,this.props.timesheetData,"demo")}
                        // disabled={this.props.timesheetData ? false : true}
                      >
                        Download Timesheet
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={this.props.sendRemainder}
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Send Remainder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          this.props.changeStatusTimesheets(
                            APPROVAL_STATUS.APPROVED
                          )
                        }
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "WithApprover" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={this.props.sendRemainder}
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Send Remainder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "Approved" ||
              this.props.selectedStatus == "WithEmployee" ? (
                <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                  <div className="align-items-center d-flex">
                    <div className="flex-column d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() =>
                          this.props.changeStatusTimesheets(
                            APPROVAL_STATUS.ARCHIVED
                          )
                        }
                        disabled={this.props.timesheetData ? false : true}
                      >
                        Move to Archive
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.selectedStatus == "Archived" ? (
                <React.Fragment>
                  <div className="col-xl-2 col-lg-4 col-md-7 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={this.props.timesheetData ? false : true}
                        >
                          Download Again
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-xs-12 marginBottom">
                    <div className="align-items-center d-flex">
                      <div className="flex-column d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={this.deleteConfirm}
                          disabled={this.props.timesheetData ? false : true}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TimeSheetActions;
