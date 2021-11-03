import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../../shared/inputs/TextField";

import ReactLoading from "react-loading";
import { httpClient } from "../../../UtilService";

class AddVendorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: this.props.data ? this.props.data : {
                Active: false,
                DisplayName: "",
                group: "",
                Title: "",
                Fax: "",
                firstName: "",
                GivenName: "",
                FamilyName: "",
                FreeFormNumber: "",
                PrimaryEmailAddr: "",
                extension: "",
                CompanyName: "",
                WebAddr: "",
                BillRate: "",
            },
            isLoading: false,
        };
    }
    showToast = (msg, type) => {
        this.props.showToast(msg, type)
    };

    handleCloseDialog = data => {
        this.props.handleCloseDialog(data);
    };

    render() {
        return (
            <React.Fragment>
                <div
                    className="modal fade"
                    id="list_vendor_add_dialog"
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
                                                <h3 className="mb-0">Class</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body text-left">
                                        {this.state.isLoading && (
                                            <div className="centered loading-dialog">
                                                <ReactLoading
                                                    type="spin"
                                                    color="#2B70A0"
                                                    height={"64px"}
                                                    width={"64px"}
                                                />
                                            </div>
                                        )}
                                        <Formik
                                            initialValues={this.state.initialValues}
                                            validate={values => {
                                                let errors = {};
                                                if (!values.DisplayName) {
                                                    errors.DisplayName = "Required";
                                                }
                                                return errors;
                                            }}
                                            onSubmit={async values => {
                                                this.setState({ isLoading: true });
                                                let result;
                                                if (values._id) {
                                                    result = await httpClient("vendor/update", "Patch", values);
                                                } else {
                                                    result = await httpClient("vendor/add", "POST", values);
                                                }

                                                if (result.success) {
                                                    this.showToast(`Vendor ${values._id ? 'updated' : 'added'} successfully`, "success");
                                                    this.handleCloseDialog(result.data)
                                                } else {
                                                    this.setState({ isLoading: false });
                                                    this.showToast(`Error while ${values._id ? 'updating' : 'adding'} vendor`, "error");
                                                }
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
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customActive"
                                                                                type="checkbox"
                                                                                value={values.Active}
                                                                                checked={values.Active ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("Active", !values.Active)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customActive"
                                                                            >
                                                                                <span>Active?</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Name"
                                                                        type="text"
                                                                        placeholder="Name"
                                                                        name="DisplayName"
                                                                        value={values.DisplayName}
                                                                        onChange={(event) => {
                                                                            setFieldValue("DisplayName", event.target.value)
                                                                        }}
                                                                        showError={errors.DisplayName && touched.DisplayName ? true : false}
                                                                        error={errors.DisplayName}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Group"
                                                                        type="text"
                                                                        placeholder="Group"
                                                                        name="group"
                                                                        value={values.group}
                                                                        onChange={(event) => {
                                                                            setFieldValue("group", event.target.value)
                                                                        }}
                                                                        showError={errors.group && touched.group ? true : false}
                                                                        error={errors.group}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Title"
                                                                        type="text"
                                                                        placeholder="Title"
                                                                        name="Title"
                                                                        value={values.Title}
                                                                        onChange={(event) => {
                                                                            setFieldValue("Title", event.target.value)
                                                                        }}
                                                                        showError={errors.Title && touched.Title ? true : false}
                                                                        error={errors.Title}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Fax No."
                                                                        type="text"
                                                                        placeholder="Fax No."
                                                                        name="Fax"
                                                                        value={values.Fax}
                                                                        onChange={(event) => {
                                                                            setFieldValue("Fax", event.target.value)
                                                                        }}
                                                                        showError={errors.Fax && touched.Fax ? true : false}
                                                                        error={errors.Fax}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="First Name"
                                                                        type="text"
                                                                        placeholder="First Name"
                                                                        name="firstName"
                                                                        value={values.firstName}
                                                                        onChange={(event) => {
                                                                            setFieldValue("firstName", event.target.value)
                                                                        }}
                                                                        showError={errors.firstName && touched.firstName ? true : false}
                                                                        error={errors.firstName}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Contact Name"
                                                                        type="text"
                                                                        placeholder="Contact Name"
                                                                        name="GivenName"
                                                                        value={values.GivenName}
                                                                        onChange={(event) => {
                                                                            setFieldValue("GivenName", event.target.value)
                                                                        }}
                                                                        showError={errors.GivenName && touched.GivenName ? true : false}
                                                                        error={errors.GivenName}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Last Name"
                                                                        type="text"
                                                                        placeholder="Last Name"
                                                                        name="FamilyName"
                                                                        value={values.FamilyName}
                                                                        onChange={(event) => {
                                                                            setFieldValue("FamilyName", event.target.value)
                                                                        }}
                                                                        showError={errors.FamilyName && touched.FamilyName ? true : false}
                                                                        error={errors.FamilyName}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Cell Phone"
                                                                        type="text"
                                                                        placeholder="Cell Phone"
                                                                        name="FreeFormNumber"
                                                                        value={values.FreeFormNumber}
                                                                        onChange={(event) => {
                                                                            setFieldValue("FreeFormNumber", event.target.value)
                                                                        }}
                                                                        showError={errors.FreeFormNumber && touched.FreeFormNumber ? true : false}
                                                                        error={errors.FreeFormNumber}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Email"
                                                                        type="text"
                                                                        placeholder="Email"
                                                                        name="emPrimaryEmailAddrail"
                                                                        value={values.PrimaryEmailAddr}
                                                                        onChange={(event) => {
                                                                            setFieldValue("PrimaryEmailAddr", event.target.value)
                                                                        }}
                                                                        showError={errors.PrimaryEmailAddr && touched.PrimaryEmailAddr ? true : false}
                                                                        error={errors.PrimaryEmailAddr}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Extension"
                                                                        type="text"
                                                                        placeholder="Extension"
                                                                        name="extension"
                                                                        value={values.extension}
                                                                        onChange={(event) => {
                                                                            setFieldValue("extension", event.target.value)
                                                                        }}
                                                                        showError={errors.extension && touched.extension ? true : false}
                                                                        error={errors.extension}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Company Name"
                                                                        type="text"
                                                                        placeholder="Company Name"
                                                                        name="CompanyName"
                                                                        value={values.CompanyName}
                                                                        onChange={(event) => {
                                                                            setFieldValue("CompanyName", event.target.value)
                                                                        }}
                                                                        showError={errors.CompanyName && touched.CompanyName ? true : false}
                                                                        error={errors.CompanyName}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Website"
                                                                        type="text"
                                                                        placeholder="Website"
                                                                        name="WebAddr"
                                                                        value={values.WebAddr}
                                                                        onChange={(event) => {
                                                                            setFieldValue("WebAddr", event.target.value)
                                                                        }}
                                                                        showError={errors.WebAddr && touched.WebAddr ? true : false}
                                                                        error={errors.WebAddr}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Hourly Rate"
                                                                        type="number"
                                                                        placeholder="Hourly Rate"
                                                                        name="BillRate"
                                                                        value={values.BillRate}
                                                                        onChange={(event) => {
                                                                            setFieldValue("BillRate", event.target.value)
                                                                        }}
                                                                        showError={errors.BillRate && touched.BillRate ? true : false}
                                                                        error={errors.BillRate}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-link "
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

export default AddVendorModal;
