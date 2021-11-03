import React, { Component } from "react";
import EditCustomerGeneralDetails from "./EditCustomerGeneralDetails";
import CustomerTeam from "./CustomerTeam";
import CustomerBilling from "./CustomerBilling";
class EditCustomerDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }
  handleCloseDialog = (data) => {
    this.props.handleCloseDialog(data);
  };
  setActiveIndex = (index) => {
    this.setState({
      selectedTabIndex: index,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="customer_edit_dialog"
          data-backdrop="static"
          data-keyboard="false"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-form"
          aria-hidden="true"
        >
          <div
            /*className="modal-dialog modal- modal-dialog-centered modal-lg full-page-dialog"*/
            className="modal-dialog modal- full-page-dialog"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="card bg-secondary shadow">
                  <div className="card-header bg-white border-0">
                    <div className="row align-items-center">
                      <div className="col-8">
                        <h3 className="mb-0">Task</h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body text-left">
                    <ul className="nav nav-pills">
                      <li
                        className="nav-item"
                        onClick={() => this.setActiveIndex(0)}
                      >
                        <a
                          className={`nav-link ${
                            this.state.selectedTabIndex === 0 ? "active" : ""
                          }`}
                          href="#"
                        >
                          General
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => this.setActiveIndex(1)}
                      >
                        <a
                          className={`nav-link ${
                            this.state.selectedTabIndex === 1 ? "active" : ""
                          }`}
                          href="#"
                        >
                          Team
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => this.setActiveIndex(2)}
                      >
                        <a
                          className={`nav-link ${
                            this.state.selectedTabIndex === 2 ? "active" : ""
                          }`}
                          href="#"
                        >
                          Billing
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => this.setActiveIndex(3)}
                      >
                        <a
                          className={`nav-link ${
                            this.state.selectedTabIndex === 3 ? "active" : ""
                          }`}
                          href="#"
                        >
                          Transactions
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => this.setActiveIndex(4)}
                      >
                        <a
                          className={`nav-link ${
                            this.state.selectedTabIndex === 4 ? "active" : ""
                          }`}
                          href="#"
                        >
                          Invoice Pref.
                        </a>
                      </li>
                    </ul>
                    <br />
                    {this.state.selectedTabIndex === 0 && (
                      <EditCustomerGeneralDetails
                        handleCloseDialog={this.handleCloseDialog}
                      />
                    )}
                    {this.state.selectedTabIndex === 1 && (
                      <CustomerTeam
                        handleCloseDialog={this.handleCloseDialog}
                        showToast={this.props.showToast}
                        data={this.props.data}
                        updateCustomers={this.props.updateCustomers}
                      />
                    )}
                    {this.state.selectedTabIndex === 2 && (
                      <CustomerBilling
                        handleCloseDialog={this.handleCloseDialog}
                      />
                    )}
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

export default EditCustomerDialog;
