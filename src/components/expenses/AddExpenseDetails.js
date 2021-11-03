import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../shared/inputs/TextField";
import DateField from "../../shared/inputs/Date";
import moment from "moment";
class AddExpenseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseMain: {
        reportDate: this.props.reportDate || moment().toDate(),
        reason: this.props.reason || "New Expense"
      }
    };
    console.log(this.props);
  }
  handleCloseDialog = data => {
    this.props.handleCloseDialog(data);
  };
  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="my_expense_main_modal"
          data-backdrop="static"
          data-keyboard="false"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-form"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal- modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="card bg-secondary shadow">
                  <div className="card-header bg-white border-0">
                    <div className="row align-items-center">
                      <div className="col-8">
                        <h3 className="mb-0">Expense Envelope</h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body text-left">
                    <Formik
                      initialValues={this.state.expenseMain}
                      validate={() => {
                        let errors = {};
                        return errors;
                      }}
                      onSubmit={values => {
                        this.handleCloseDialog({
                          reportDate: values.reportDate,
                          reason: values.reason
                        });
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        setFieldValue
                        /* and other goodies */
                      }) => (
                          <form onSubmit={handleSubmit}>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-lg-6">
                                  <DateField
                                    label="Report Date"
                                    selected={values.reportDate}
                                    onChange={date => {
                                      setFieldValue("reportDate", date);
                                    }}
                                    showError={
                                      errors.reportDate && touched.reportDate
                                        ? true
                                        : false
                                    }
                                    error={errors.reportDate}
                                  />
                                </div>
                                <div className="col-lg-6">
                                  <TextField
                                    label="Reason for expense"
                                    type="text"
                                    placeholder="Reason"
                                    name="reason"
                                    value={values.reason}
                                    onChange={handleChange}
                                    showError={
                                      errors.reason && touched.reason
                                        ? true
                                        : false
                                    }
                                    error={errors.reason}
                                  />
                                </div>{" "}
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => this.handleCloseDialog()}
                              >
                                Close
                            </button>
                              <button type="submit" className="btn btn-primary">
                                Continue
                            </button>
                            </div>
                          </form>
                        )}
                    </Formik>
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

export default AddExpenseDetails;
