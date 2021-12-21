import React, { Component } from "react";
import AddCostRateDialog from "./AddCostRateDialog";
import axios from "axios";
import * as Constants from "../Constant";
import moment from "moment";
let flag =0;
let demo = [];
let vendor = [];
let superVal = [];
let tax = [];

let rate_val
class UserRatesMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hourlyRates: [],
      costRateDialog: {
        isOpen: false,
        data: undefined,
        editIndex: -1,
      },
      billRateDialog: {
        isOpen: false,
        data: undefined,
        editIndex: -1,
      },
      employeeList: [],
      suppliersList: [],
      accountList: [],
      isSuper:false,
      taxList: [
        { value: "TaxExcluded", key: "Tax Excluded" },
        { value: "TaxInclusive", key: "Tax Inclusive" },
        { value: "NotApplicable", key: "Not Applicable" },
      ],
      approver: "",
      linkedEmployee: "",
      linkedSupplier: "",
      quickBookSyncEmployee: false,
      superBaseAccount: "",
      superPayableAccount: "",
      GSTApplicable: false,
      quickBookSyncSupplier: false,
      hourlyRateSupplier: 0,
      superAnnuationRequired: false,
      superAnuationPercentage: 0,
      voidSupplierBill: false,
      taxTypeApplicable: "",
    };
  }
  componentDidMount() {
    this.getValues();
    var self = this;
    var payLoad = {
      token: localStorage.getItem("token"),
    };
    var userSelected = this.props.userList
      ? this.props.userList.filter((user) => user._id == this.props.employeeId)
      : [];
    userSelected = userSelected && userSelected.length ? userSelected[0] : {};
    if (userSelected["linkedEmployee"])
      this.setState({ linkedEmployee: userSelected["linkedEmployee"] });
    if (
      userSelected["linkedEmployeeSettings"] &&
      userSelected["linkedEmployeeSettings"]["importTimesheetsToQB"]
    )
      this.setState({
        quickBookSyncEmployee:
          userSelected["linkedEmployeeSettings"]["importTimesheetsToQB"],
      });
    if (userSelected["hourlyRate"])
      this.setState({ hourlyRates: userSelected["hourlyRate"] });
    if (userSelected["linkedSupplier"])
      this.setState({ linkedSupplier: userSelected["linkedSupplier"] });
    if (userSelected["linkedSupplierSettings"]) {
      if (userSelected["linkedSupplierSettings"]["superPayableAccount"])
        this.setState({
          superPayableAccount:
            userSelected["linkedSupplierSettings"]["superPayableAccount"],
        });
      if (userSelected["linkedSupplierSettings"]["hourlyRate"])
        this.setState({
          hourlyRateSupplier:
            userSelected["linkedSupplierSettings"]["hourlyRate"],
        });
      if (userSelected["linkedSupplierSettings"]["superBaseAccount"])
        this.setState({
          superBaseAccount:
            userSelected["linkedSupplierSettings"]["superBaseAccount"],
        });
      if (userSelected["linkedSupplierSettings"]["superPercentage"])
        this.setState({
          superAnuationPercentage:
            userSelected["linkedSupplierSettings"]["superPercentage"],
        });
      if (userSelected["linkedSupplierSettings"]["superRequired"])
        this.setState({
          superAnnuationRequired:
            userSelected["linkedSupplierSettings"]["superRequired"],
        });
      if (userSelected["linkedSupplierSettings"]["quickBookSyncRequired"])
        this.setState({
          quickBookSyncSupplier:
            userSelected["linkedSupplierSettings"]["quickBookSyncRequired"],
        });
      if (userSelected["linkedSupplierSettings"]["voidSupplierBill"])
        this.setState({
          voidSupplierBill:
            userSelected["linkedSupplierSettings"]["voidSupplierBill"],
        });
      if (userSelected["linkedSupplierSettings"]["gstApplicable"])
        this.setState({
          GSTApplicable:
            userSelected["linkedSupplierSettings"]["gstApplicable"],
        });
      if (userSelected["linkedSupplierSettings"]["taxType"])
        this.setState({
          taxTypeApplicable: userSelected["linkedSupplierSettings"]["taxType"],
        });
    }
    // var url1 = Constants.BASE_URL + "employee/getAllEmployeesQBO";
    // var url2 = Constants.BASE_URL + "vendor/list";
    // // var url3 = Constants.BASE_URL + "account/list";
    // const promises = Promise.all([
    //   axios.post(url1, payLoad),
    //   // axios.post(url2, payLoad),
    //   // axios.post(url3, payLoad),
    // ]);
    // promises
    //   .then(([res1]) => {
    //     self.setState({
    //       employeeList: res1.data.data,
    //       // suppliersList: res2.data.data,
    //       // accountList: res3.data.data,
    //     });
    //     console.log("Employees");
    //     console.log(self.state.employeeList);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.props.showToast(error.message, "error");
    //   });
  }
  getValues = () => {
    var url = Constants.BASE_URL + "employee/getAllEmployeesQBO";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          demo = response.data.data.QueryResponse.Employee;
          console.log(response.data.data);
          self.setState({employeeList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
      flag = 1;
    var url = Constants.BASE_URL + "vendor/list";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          vendor = response.data.data.QueryResponse.Vendor;
          console.log(response.data.data);
          self.setState({suppliersList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
    var url = Constants.BASE_URL + "employee/getTaxQBO";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          tax = response.data.data.QueryResponse;
          console.log("TAX");
          console.log(tax);
          tax = tax.TaxCode;
          console.log("Tax");
          console.log(response.data.data);
          self.setState({suppliersList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
      var url = Constants.BASE_URL + "employee/getSuperQBO";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          superVal = response.data.data.QueryResponse;
          superVal = superVal.Account;
          console.log("Super");
          console.log(superVal[0].FullyQualifiedName);
          // self.setState({suppliersList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log("Super didnt work");
        console.log(error);
      });
  }

  handleOpenCostRateDialog = (isOpen, editIndex) => {
    if (!isOpen) {
      window.$("#cost_rate_dialog").modal("hide");
    }
    let costRates = [...this.state.hourlyRates];
    if (editIndex !== undefined) {
      costRates.splice(editIndex, 1);
    }
    this.setState(
      {
        costRateDialog: {
          isOpen: isOpen,
          data:
            editIndex !== undefined
              ? { ...this.state.hourlyRates[editIndex] }
              : undefined,
          editIndex: editIndex,
          costRates,
        },
      },
      () => {
        if (isOpen) {
          window.$("#cost_rate_dialog").modal("show");
        }
      }
    );
  };

  handleCloseCostRateDialog = (data) => {
    console.log("cost rate data ", data);
    window.$("#cost_rate_dialog").modal("hide");
    var hourlyrates = this.state.hourlyRates;
    hourlyrates.push(data);
    this.setState({
      costRateDialog: {
        isOpen: false,
        data: undefined,
        editIndex: -1,
      },
      hourlyRates: hourlyrates,
    });
  };

  handleDeleteCostRate = (index) => {
    var hourlyRate = this.state.hourlyRates;
    hourlyRate.splice(index, 1);
    this.setState({ hourlyRates: hourlyRate });
  };

  handleOpenBillRateDialog = (isOpen, editIndex) => {
    if (!isOpen) {
      window.$("#bill_rate_dialog").modal("hide");
    }
    let billRates = [...this.state.billRates];
    if (editIndex !== undefined) {
      billRates.splice(editIndex, 1);
    }
    this.setState(
      {
        billRateDialog: {
          isOpen: isOpen,
          data:
            editIndex !== undefined
              ? { ...this.state.billRates[editIndex] }
              : undefined,
          editIndex: editIndex,
          billRates,
        },
      },
      () => {
        if (isOpen) {
          window.$("#bill_rate_dialog").modal("show");
        }
      }
    );
  };

  // handleLinkedEmployee = (event) => {
  //   this.setState({ linkedEmployee: event.target.value });
  // };

  // handletaxTypeApplicable = (event) => {
  //   this.setState({ taxTypeApplicable: event.target.value });
  // };

  handleDropdown = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  handleCheckbox = (event, field) => {
    this.setState({ [field]: event.target.checked });
    if (event.target.name == "superAnnuationRequired")
      this.setState({isSuper: !this.state.isSuper});
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSave = (type) => {
    var url = Constants.BASE_URL + "employee/linkEmployee";
    if (
      (type == "employee" &&
        this.state.linkedEmployee &&
        this.state.hourlyRates &&
        this.state.hourlyRates.length) ||
      (type == "supplier" &&
        this.state.hourlyRateSupplier &&
        (!this.state.GSTApplicable ||
          (this.state.GSTApplicable && this.state.taxTypeApplicable)) &&
        (!this.state.superAnnuationRequired ||
          (this.state.superAnnuationRequired &&
            this.state.superAnuationPercentage &&
            this.state.superBaseAccount &&
            this.state.superPayableAccount)))
    ) {
      console.log("Employee");
        console.log(this.state.hourlyRates.rate);
      var payload;
      if (type == "employee")
        
        payload = {
          linkEmployeeId: this.state.linkedEmployee,
          linkUserId: this.props.employeeId,
          token: localStorage.getItem("token"),
          hourlyRate: rate_val,
          quickBookSync: this.state.quickBookSyncEmployee,
          taxRequired: this.state.GSTApplicable,
          taxType: this.state.taxTypeApplicable,
          superRequired: this.state.superAnnuationRequired,
          superPercentage: this.state.superAnuationPercentage,
          superBase: this.state.superBaseAccount,
          superPayable: this.state.superPayableAccount,
          linkSupplierId:this.state.linkedSupplier,
          supplierBillVoid:this.state.voidSupplierBill,
          type: "Employee",
        };
      else
        payload = {
          linkSupplierId: this.state.linkedSupplier,
          linkUserId: this.props.employeeId,
          token: localStorage.getItem("token"),
          hourlyRate: this.state.hourlyRateSupplier,
          quickBookSync: this.state.quickBookSyncSupplier,
          taxRequired: this.state.GSTApplicable,
          taxType: this.state.taxTypeApplicable,
          superRequired: this.state.superAnnuationRequired,
          superPercentage: this.state.superAnuationPercentage,
          superBase: this.state.superBaseAccount,
          superPayable: this.state.superPayableAccount,
          supplierBillVoid: this.state.voidSupplierBill,
          type: "Supplier",
        };
      axios
        .post(url, payload)
        .then((response) => {
          if (response.data.success) {
            this.props.showToast(response.data.message, "success");
          } else {
            this.props.showToast(response.data.message, "error");
          }
        })
        .catch((error) => {
          this.props.showToast(error.message, "error");
        });
    } else this.props.showToast("Fill all the required details", "error");
  };

  handleQuickbook = (event) => {
    this.setState({ quickBookSyncEmployee: event.target.checked });
  };

  render() {
    return (
      <section className="container-fluid">
        <hr className="my-4" />
        <h6 className="heading-small text-muted mb-4">Link Employee</h6>
        <div className="pl-lg-4">
          <div className="row">
            <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div class="dropdown">
              {flag
                      ? 
                <div class="form-group">
                  <label
                    className="form-control-label"
                    htmlFor="linkedEmployee"
                  >
                    Select Employee to link
                    {/* {console.log(demo)} */}
                  </label>
                  <select
                    className="form-control input-group input-group-alternative"
                    name="linkedEmployee"
                    id="linkedEmployee"
                    value={this.state.linkedEmployee}
                    onChange={(e) => this.handleDropdown(e, "linkedEmployee")}
                  >                    
                    <option value=""></option>
                   {demo.map((emp, index) => (
                          <React.Fragment>
                            <option value={emp.id} key={`emp${index}`}>
                              {emp.DisplayName}
                            </option>
                   
                          </React.Fragment>
                        ))
                   }
                   {/* {console.log(demo)} */}
                  </select>
                </div>
                : ""}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="custom-control custom-control-alternative custom-checkbox">
              <div class="form-group">
                <input
                  className="custom-control-input"
                  id="employee_timeSheets"
                  type="checkbox"
                  name="employee_timeSheets"
                  checked={this.state.quickBookSyncEmployee}
                  onChange={(event) =>
                    this.handleCheckbox(event, "quickBookSyncEmployee")
                  }
                />
                <label
                  className="custom-control-label"
                  htmlFor="employee_timeSheets"
                >
                  Import timesheets of employee to Quickbook
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="d-flex justify-content-between">
                <h5>Cost Rate/Hr</h5>
                <button
                  onClick={() => this.handleOpenCostRateDialog(true)}
                  className="btn btn-sm btn-primary"
                >
                  Add
                </button>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush mt-2">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Begin Date</th>
                      <th scope="col">Rate/hr</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.hourlyRates.map((costRate, index) => (
                      <tr key={`costRate${index}`}>
                        <td>
                          {moment(costRate.beginDate).format("Do MMM YYYY")}
                        </td>
                        {rate_val = costRate.rate}
                        <td>{costRate.rate}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              this.handleOpenCostRateDialog(true, index)
                            }
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => this.handleDeleteCostRate(index)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <button
              className="btn btn-primary text-uppercase mb-4"
              type="button"
              onClick={() => this.handleSave("employee")}
            >
              Save
            </button>
          </div>
        </div>
        <hr className="my-4" />
        <h6 className="heading-small text-muted mb-4">Link Supplier</h6>
        <div className="pl-lg-4">
          <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div className="row">
              <div class="dropdown">
                <div class="form-group">
                  <label className="form-control-label" htmlFor="supplier">
                    Select Supplier to link
                  </label>
                  <select
                    className="form-control input-group input-group-alternative"
                    name="supplier"
                    id="supplier"
                    value={this.state.linkedSupplier}
                    onChange={(e) => this.handleDropdown(e, "linkedSupplier")}
                  >
                    <option value=""></option>
                    {vendor
                      ? vendor.map((sup, index) =>
                          sup["Active"] ? (
                            <React.Fragment>
                              <option value={sup.Id} key={`emp${index}`}>
                                {sup.CompanyName || sup.DisplayName}
                              </option>
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )
                      : ""}
                      {/* {console.log(vendor)} */}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <div class="form-group">
                  <input
                    className="custom-control-input"
                    id="supplier_qblink"
                    type="checkbox"
                    name="supplier_qblink"
                    checked={this.state.quickBookSyncSupplier}
                    onChange={(event) =>
                      this.handleCheckbox(event, "quickBookSyncSupplier")
                    }
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="supplier_qblink"
                  >
                    Import Supplier bill to Quickbook
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label className="form-control-label" for="hourlyRateSupplier">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  id="hourlyRateSupplier"
                  className="form-control form-control-alternative"
                  placeholder="Hourly rate"
                  name="hourlyRateSupplier"
                  value={this.state.hourlyRateSupplier}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <div class="form-group">
                  <input
                    className="custom-control-input"
                    id="supplier_billvoid"
                    type="checkbox"
                    name="supplier_billvoid"
                    checked={this.state.voidSupplierBill}
                    onChange={(event) =>
                      this.handleCheckbox(event, "voidSupplierBill")
                    }
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="supplier_billvoid"
                  >
                    Void Supplier bill
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="custom-control custom-control-alternative custom-checkbox">
                {/* <div class="form-group">
                  <input
                    className="custom-control-input"
                    id="supplier_gst"
                    type="checkbox"
                    name="supplier_gst"
                    checked={this.state.GSTApplicable}
                    onChange={(event) =>
                      this.handleCheckbox(event, "GSTApplicable")
                    }
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="supplier_gst"
                  >
                    GST/Tax
                  </label>
                </div> */}
              </div>
            </div>
            <div className="row">
              <div class="dropdown">
                <div class="form-group">
                  <label className="form-control-label" htmlFor="gst_type">
                    Select tax type
                  </label>
                  <select
                    className="form-control input-group input-group-alternative"
                    name="gst_type"
                    id="gst_type"
                    value={this.state.value}
                    onChange={(e) =>
                      this.handleDropdown(e, "taxTypeApplicable")
                    }
                    required={this.state.GSTApplicable}
                  >
                    <option value={this.state.value}></option>
                    {/* {tax
                      ? tax.map((tax1, index) =>
                          tax1["key"] ? (
                            <React.Fragment>
                              <option value={tax1.value} key={`emp${index}`}>
                                {tax1.key}
                              </option>
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )
                      : ""} */}
                      {/* {console} */}
                      {/* {
                        tax
                        ? tax.map((sup, index) =>
                            
                              <React.Fragment>
                                <option value={sup.FullyQualifiedName} key={`emp${index}`}>
                                  {sup.FullyQualifiedName}
                                </option>
                              </React.Fragment>
                            
                          )
                        : ""
                      } */}
                       {
                        tax
                        ? tax.map((sup, index) =>
                            
                              <React.Fragment>
                                <option value={sup.Name} key={`emp${index}`}>
                                  {sup.Name}
                                </option>
                              </React.Fragment>
                            
                          )
                        : ""
                      }
                  </select>
                </div>
              </div>
            </div>
          <div className="condition">
          <div className="row">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <div class="form-group">
                  <input
                    className="custom-control-input"
                    id="superAnnuationRequired"
                    type="checkbox"
                    name="superAnnuationRequired"
                    checked={this.state.superAnnuationRequired}
                    onChange={(event) =>
                      this.handleCheckbox(event, "superAnnuationRequired")
                    }
                  />
                  
                  <label
                    className="custom-control-label"
                    htmlFor="superAnnuationRequired"
                  >
                    Superanuation
                  </label>
                </div>
              </div>
            </div>
            {this.state.isSuper ?(
            <div>
            <div className="row">
              <div className="form-group">
                <label
                  className="form-control-label"
                  for="superAnuationPercentage"
                >
                  Superannuation Percentage (%)
                </label>
                <input
                  type="number"
                  id="superAnuationPercentage"
                  className="form-control form-control-alternative"
                  placeholder="Superanuation %"
                  name="superAnuationPercentage"
                  value={this.state.superAnuationPercentage}
                  onChange={this.handleChange}
                  required={this.state.superAnnuationRequired}
                />
              </div>
            </div>
            <div className="row">
              <div class="dropdown">
                <div class="form-group">
                  <label
                    className="form-control-label"
                    htmlFor="supplier_superbase"
                  >
                    Superannuation Account
                  </label>
                  <select
                    className="form-control input-group input-group-alternative"
                    name="supplier_superbase"
                    id="supplier_superbase"
                    value={this.state.value}
                    onChange={(e) => this.handleDropdown(e, "superBaseAccount")}
                    required={this.state.superAnnuationRequired}
                  >
                    {console.log("SUpppper")}
                    {console.log(superVal[0].Name)}
                    <option value={this.state.value}></option>
                    {
                        superVal
                        
                        ? superVal.map((sup, index) =>
                            
                              <React.Fragment>
                                <option value={sup.Name}>
                                  {String(sup.Name)}
                                  {console.log(sup.Name)}
                                </option>
                              </React.Fragment>
                            
                          )
                        : ""
                      }
                    
                    {this.state.superBaseAccount=this.state.value}
                    {/* {this.state.accountList
                      ? this.state.accountList.map((account, index) =>
                          account["Id"] ? (
                            <React.Fragment>
                              <option value={account.Id} key={`emp${index}`}>
                                {account.FullyQualifiedName}
                              </option>
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )
                      : ""} */}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div class="dropdown">
                <div class="form-group">
                  <label
                    className="form-control-label"
                    htmlFor="supplier_superbase"
                  >
                    Superannuation Payable Account
                  </label>
                  <select
                    className="form-control input-group input-group-alternative"
                    name="supplier_superPayable"
                    id="supplier_superPayable"
                    value={this.state.value}
                    onChange={(e) =>
                      this.handleDropdown(e, "superPayableAccount")
                    }
                    required={this.state.superAnnuationRequired}
                  >
                    <option value={this.state.value}></option>
                    {
                        superVal
                        ? superVal.map((sup, index) =>
                            
                              <React.Fragment>
                                <option value={sup.FullyQualifiedName} key={`emp${index}`}>
                                  {sup.FullyQualifiedName}
                                </option>
                              </React.Fragment>
                            
                          )
                        : ""
                      }
                    
                    {this.state.superPayableAccount=this.state.value}
                    {/* {this.state.accountList
                      ? this.state.accountList.map((account, index) =>
                          account["Id"] ? (
                            <React.Fragment>
                              <option value={account.Id} key={`emp${index}`}>
                                {account.FullyQualifiedName}
                              </option>
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )
                      : ""} */}
                  </select>
                </div>
              </div>
            </div>
            </div>
            ):""}
            </div>

            <div className="row">
              <button
                className="btn btn-primary text-uppercase mb-4"
                type="button"
                onClick={() => this.handleSave("employee")}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="d-flex justify-content-end">
          <button
            className="btn  text-uppercase mb-4"
            type="button"
            onClick={() => this.props.handleCloseDialog()}
          >
            Close
          </button>
          {/* <button
            className="btn btn-primary text-uppercase mb-4"
            type="button"
            onClick={() => this.handleSave()}
          >
            Save
          </button> */}
        </div>
        {this.state.costRateDialog.isOpen && (
          <AddCostRateDialog
            showToast={this.props.showToast}
            handleCloseDialog={this.handleCloseCostRateDialog}
          />
        )}
      </section>
    );
  }
}

export default UserRatesMain;
