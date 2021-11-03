import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../shared/inputs/TextField";
import TextArea from "../../shared/inputs/TextArea";
import { httpClient } from "../../UtilService";
import ReactLoading from "react-loading";

class AddCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: this.props.data ? this.props.data : {
        DisplayName: "",
        parentId: "",
        Notes: ""
      },
      subClients: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.getCustomerList();
  }

  getCustomerList = async () => {
    var self = this;

    this.setState({ isLoading: true });
    let result = await httpClient("client/listAll", "POST", {});

    if (result.success) {
      self.setState({
        subClients: result.data,
        isLoading: false
      });
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting my sub clients", "error");
    }
  };
  showToast = (msg, type) => {
    this.props.showToast(msg, type)
  };

  handleCloseDialog = data => {
    this.props.handleCloseDialog(data);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && (
          <div className="centered">
            <ReactLoading
              type="spin"
              color="#2B70A0"
              height={"64px"}
              width={"64px"}
            />
          </div>
        )}
        <div
          className="modal fade"
          id="add_customer_modal"
          data-backdrop="static"
          data-keyboard="false"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-form"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal- modal-dialog-centered modal-md"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="card bg-secondary shadow">
                  <div className="card-header bg-white border-0">
                    <div className="row align-items-center">
                      <div className="col-8">
                        <h3 className="mb-0">Customer Info</h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body text-left">
                    <Formik
                      initialValues={this.state.initialValues}
                      validate={values => {
                        let errors = {};
                        if (!values.DisplayName) {
                          errors.DisplayName = "Enter customer/project name";
                        }
                        return errors;
                      }}
                      onSubmit={async values => {
                        let data = {
                          DisplayName: values.DisplayName,
                          parentId: values.parentId,
                          Notes: values.Notes
                        }
                        this.setState({ isLoading: true });
                        let result;
                        if (values._id) {
                          data = { ...this.props.data, ...data };
                          result = await httpClient("client/update", "PATCH", data);
                        } else {
                          result = await httpClient("client/add", "POST", data);
                        }

                        if (result.success) {
                          this.showToast(`Details ${values._id ? 'updated' : 'added'} successfully`, "success");
                          this.handleCloseDialog(result.data)
                        } else {
                          this.showToast("Error while getting my expenses", "error");
                        }
                        this.setState({ isLoading: false });
                        // this.handleCloseDialog({
                        //   DisplayName: values.DisplayName,
                        //   parentId: values.parentId,
                        //   Notes: values.Notes
                        // });
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        resetForm
                        /* and other goodies */
                      }) => (
                          <form onSubmit={handleSubmit}>
                            <div className="pl-lg-4">
                              <TextField
                                label="Customer/Project"
                                type="text"
                                placeholder="Customer/Project"
                                name="DisplayName"
                                value={values.DisplayName}
                                onChange={handleChange}
                                showError={
                                  errors.DisplayName && touched.DisplayName
                                    ? true
                                    : false
                                }
                                error={errors.DisplayName}
                              />
                              <div className="form-group">
                                <label className="form-control-label">
                                  Sub Project Of
                              </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  label="Sub Project Of"
                                  type="text"
                                  placeholder="Sub Project Of"
                                  name="parentId"
                                  value={values.parentId}
                                  onChange={handleChange}
                                >
                                  <option value=""></option>
                                  {this.state.subClients.map(
                                    (subClient, index) => (
                                      <option value={subClient._id} key={index}>
                                        {subClient.DisplayName}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              <TextArea
                                label="Description"
                                type="text"
                                placeholder="Description"
                                name="Notes"
                                value={values.Notes}
                                onChange={handleChange}
                                showError={
                                  errors.Notes && touched.Notes
                                    ? true
                                    : false
                                }
                                error={errors.Notes}
                                required
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => this.handleCloseDialog(undefined)}
                              >
                                Close
                            </button>
                              <button type="submit" className="btn btn-primary">
                                Save
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
      </React.Fragment >
    );
  }
}

export default AddCustomerModal;
