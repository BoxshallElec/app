import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../../shared/inputs/TextField";

import ReactLoading from "react-loading";
import { TASk_ACCOUNT_TYPES } from "../../Constant";
import { httpClient } from "../../../UtilService";

class AddTaskListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: this.props.data ? this.props.data : {
                "Active": false,
                "Name": "",
                "ParentRef": "",
                "Type": "Service Item",
                "ExpenseAccountRef": "",
                "Description": "",
                "PurchaseTaxIncluded": false,
                "ClassRef": "",
                "Taxable": false,
                "PurchaseCost": "",
                "UnitPrice": ""
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
                    id="list_task_add_dialog"
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
                                                <h3 className="mb-0">Task</h3>
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
                                                // if (!values.subItem) {
                                                //     errors.subItem = "Required";
                                                // }
                                                return errors;
                                            }}
                                            onSubmit={async values => {
                                                this.setState({ isLoading: true });
                                                let result;
                                                if (values._id) {
                                                    result = await httpClient("task/update", "PATCH", values);
                                                } else {
                                                    result = await httpClient("task/add", "POST", values);
                                                }

                                                if (result.success) {
                                                    this.showToast(`Task ${values._id ? 'updated' : 'added'} successfully`, "success");
                                                    this.handleCloseDialog(result.data)
                                                } else {
                                                    this.setState({ isLoading: false });
                                                    this.showToast("Error while getting task", "error");
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
                                                                    <TextField label="Task"
                                                                        type="text"
                                                                        placeholder="Task"
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
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="sub_Item"
                                                                            >
                                                                                Sub Items of
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="ParentRef"
                                                                                id="sub_Item"
                                                                                value={values.ParentRef}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {(this.props.subItems || []).map((subItem, index) => (
                                                                                    <option value={subItem._id} key={index}>
                                                                                        {subItem.task}
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
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Task Type"
                                                                        type="text"
                                                                        placeholder="Task Type"
                                                                        name="Type"
                                                                        value={values.Type}
                                                                        onChange={(event) => {
                                                                            setFieldValue("Type", event.target.value)
                                                                        }}
                                                                        showError={errors.Type && touched.Type ? true : false}
                                                                        error={errors.Type}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="ExpenseAccountRef"
                                                                            >
                                                                                Account
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="ExpenseAccountRef"
                                                                                id="ExpenseAccountRef"
                                                                                value={values.ExpenseAccountRef}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {TASk_ACCOUNT_TYPES.map((taskType, index) => (
                                                                                    <option value={taskType} key={index}>
                                                                                        {taskType}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.ExpenseAccountRef && touched.ExpenseAccountRef && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.ExpenseAccountRef}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Description"
                                                                        type="text"
                                                                        placeholder="Description"
                                                                        name="Description"
                                                                        value={values.Description}
                                                                        onChange={(event) => {
                                                                            setFieldValue("Description", event.target.value)
                                                                        }}
                                                                        showError={errors.Description && touched.Description ? true : false}
                                                                        error={errors.Description}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customBillable"
                                                                                type="checkbox"
                                                                                value={values.PurchaseTaxIncluded}
                                                                                checked={values.PurchaseTaxIncluded ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("PurchaseTaxIncluded", !values.PurchaseTaxIncluded)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customBillable"
                                                                            >
                                                                                <span>Billable?</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Class"
                                                                        type="text"
                                                                        placeholder="Class"
                                                                        name="ClassRef"
                                                                        value={values.ClassRef}
                                                                        onChange={(event) => {
                                                                            setFieldValue("ClassRef", event.target.value)
                                                                        }}
                                                                        showError={errors.ClassRef && touched.ClassRef ? true : false}
                                                                        error={errors.ClassRef}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customTaxable"
                                                                                type="checkbox"
                                                                                value={values.Taxable}
                                                                                checked={values.Taxable ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("Taxable", !values.Taxable)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customTaxable"
                                                                            >
                                                                                <span>Taxable?</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Cost Rate"
                                                                        type="text"
                                                                        placeholder="Cost Rate"
                                                                        name="PurchaseCost"
                                                                        value={values.PurchaseCost}
                                                                        onChange={(event) => {
                                                                            setFieldValue("PurchaseCost", event.target.value)
                                                                        }}
                                                                        showError={errors.PurchaseCost && touched.PurchaseCost ? true : false}
                                                                        error={errors.PurchaseCost}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Bill Rate"
                                                                        type="text"
                                                                        placeholder="Bill Rate"
                                                                        name="UnitPrice"
                                                                        value={values.UnitPrice}
                                                                        onChange={(event) => {
                                                                            setFieldValue("UnitPrice", event.target.value)
                                                                        }}
                                                                        showError={errors.UnitPrice && touched.UnitPrice ? true : false}
                                                                        error={errors.UnitPrice}
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

export default AddTaskListModal;
