import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../../shared/inputs/TextField";

import ReactLoading from "react-loading";
import { TASk_ACCOUNT_TYPES } from "../../Constant";
import { httpClient } from "../../../UtilService";

class AddClassListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: this.props.data ? this.props.data : {
                Active: false,
                Name: "",
                ParentRef: "",
                addressLine1: "",
                addressLine2: "",
                state: "",
                zipCode: "",
            },
            subClients: [],
            isLoading: false
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
                    id="list_classes_add_dialog"
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
                                                if (!values.Name) {
                                                    errors.Name = "Required";
                                                }
                                                return errors;
                                            }}
                                            onSubmit={async values => {
                                                this.setState({ isLoading: true });
                                                let result;
                                                if (values._id) {
                                                    result = await httpClient("class/update", "PATCH", values);
                                                } else {
                                                    result = await httpClient("class/add", "POST", values);
                                                }

                                                if (result.success) {
                                                    this.showToast(`Class ${values._id ? 'updated' : 'added'} successfully`, "success");
                                                    this.handleCloseDialog(result.data)
                                                } else {
                                                    this.setState({ isLoading: false });
                                                    this.showToast(`Error while ${values._id ? 'updating' : 'adding'} class`, "error");
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
                                                                    <TextField label="Class"
                                                                        type="text"
                                                                        placeholder="Class"
                                                                        name="Name"
                                                                        value={values.Name}
                                                                        onChange={(event) => {
                                                                            setFieldValue("Name", event.target.value)
                                                                        }}
                                                                        showError={errors.Name && touched.Name ? true : false}
                                                                        error={errors.Name}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <label
                                                                            className="form-control-label"
                                                                            htmlFor="sub_class"
                                                                        >
                                                                            Sub Class
                                                                        </label>
                                                                        <select
                                                                            className="form-control input-group input-group-alternative"
                                                                            name="ParentRef"
                                                                            id="sub_class"
                                                                            value={values.ParentRef}
                                                                            onChange={handleChange}
                                                                        >
                                                                            <option value=""></option>
                                                                            {(this.props.classes || []).map((classObj, index) => (
                                                                                <option value={classObj._id} key={index}>
                                                                                    {classObj.Name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        {errors.ParentRef && touched.ParentRef && (
                                                                            <div>
                                                                                <small className="text-danger">
                                                                                    {errors.ParentRef}
                                                                                </small>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <TextField label="Address Line 1"
                                                                        type="text"
                                                                        placeholder="Address Line 1"
                                                                        name="addressLine1"
                                                                        value={values.addressLine1}
                                                                        onChange={(event) => {
                                                                            setFieldValue("addressLine1", event.target.value)
                                                                        }}
                                                                        showError={errors.addressLine1 && touched.addressLine1 ? true : false}
                                                                        error={errors.addressLine1}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <TextField label="Address Line 2"
                                                                        type="text"
                                                                        placeholder="Address Line 2"
                                                                        name="addressLine2"
                                                                        value={values.addressLine2}
                                                                        onChange={(event) => {
                                                                            setFieldValue("addressLine2", event.target.value)
                                                                        }}
                                                                        showError={errors.addressLine2 && touched.addressLine2 ? true : false}
                                                                        error={errors.addressLine2}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="State"
                                                                        type="text"
                                                                        placeholder="State"
                                                                        name="state"
                                                                        value={values.state}
                                                                        onChange={(event) => {
                                                                            setFieldValue("state", event.target.value)
                                                                        }}
                                                                        showError={errors.state && touched.state ? true : false}
                                                                        error={errors.state}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Zip Code"
                                                                        type="number"
                                                                        placeholder="Zip Code"
                                                                        name="zipCode"
                                                                        value={values.zipCode}
                                                                        onChange={(event) => {
                                                                            setFieldValue("zipCode", event.target.value)
                                                                        }}
                                                                        showError={errors.zipCode && touched.zipCode ? true : false}
                                                                        error={errors.zipCode}
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

export default AddClassListModal;
