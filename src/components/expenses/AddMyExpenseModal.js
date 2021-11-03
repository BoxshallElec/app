import React, { Component } from 'react';
import Icon from "@mdi/react";
import { mdiPencil } from "@mdi/js";
import { Formik } from 'formik';
import TextField from '../../shared/inputs/TextField';
import DateField from '../../shared/inputs/Date';
import { EXPENSE_TYPES, AWS_URL } from '../Constant';
import moment from 'moment';
import AddExpenseDetails from './AddExpenseDetails';
import { httpClient, getExpenseStatus, parseJwt } from '../../UtilService';
import ReactLoading from "react-loading";
class AddMyExpenseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            expenseMain: {
                reportDate: this.props.reportDate || moment().toDate(),
                reason: this.props.reason || "New Expense",
                expensesList: this.props.data ? [...this.props.data.expensesList] : []
            },
            expenseMainDialog: {
                isOpen: false,
                reportDate: this.props.reportDate || moment().toDate(),
                reason: this.props.reason || "New Expense",
            },
            editIndex: -1,
            expense: {
                reportDate: "",
                type: "",
                isBillable: false,
                reason: "",
                expenseDate: "",
                customerProject: "",
                amount: "",
                paidBy: "me",
                merchant: "",
                creditCard: "",
                details: "",
                status: "on-hold",
                file: "",
                fileUrl: ""
            }
        }
    }
    handleCloseDialog = (data) => {
        this.props.handleCloseDialog(data)
    }
    handleOpenMyExpenseDetailsDialog = (isOpen, data) => {
        console.log(data)
        if (!isOpen) {
            window.$("#my_expense_main_modal").modal("hide");
        }
        let expenseMain = { ...this.state.expenseMain }
        if (isOpen === false && data) {
            expenseMain = {
                ...expenseMain,
                reportDate: data.reportDate,
                reason: data.reason
            }
        }
        this.setState({
            expenseMainDialog: {
                isOpen: isOpen,
                reportDate: data ? data.reportDate : "",
                reason: data ? data.reason : "",
            },
            expenseMain,
        }, () => {
            if (isOpen) {
                window.$("#my_expense_main_modal").modal("show");
            }
        })
    }
    saveExpense = async (isHideModal) => {
        let data = { ...this.state.expenseMain }
        let result;
        this.setState({
            isLoading: true
        });
        if (this.props.data && this.props.data._id) {
            data._id = this.props.data._id;
            result = await httpClient("expenses/update", "PATCH", { data });
        } else {
            result = await httpClient("expenses/add", "PUT", data);
        }
        if (result.success) {
            this.props.showToast(`Expense ${this.props.data && this.props.data._id ? 'update' : 'added'} successfully`, "success");
            if (isHideModal) {
                this.handleCloseDialog(result.data)
            }
        } else {
            this.props.showToast("Error while saving", "error")
        }
    }
    changeStatus = async (index, status) => {
        let data = { ...this.state.expenseMain }
        data.expensesList[index].status = status;
        data._id = this.props.data._id;
        this.setState({
            isLoading: true
        })
        let result = await httpClient("expenses/update", "PATCH", { data });
        if (result.success) {
            this.props.showToast("Expense updated successfully", "success");
            this.setState({
                expenseMain: data,
                isLoading: false
            });
            this.handleCloseDialog(result.data)
        } else {
            this.setState({
                isLoading: false
            })
            this.props.showToast("Error while submitting expense", "error")
        }
    }
    handleDeleteExpense = (index) => {
        let data = { ...this.state.expenseMain };
        data.expensesList.splice(index, 1);
        this.setState({
            expenseMain: data
        })
    }
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
                    id="my_expense_modal"
                    tabIndex="-1"
                    role="dialog"
                    data-backdrop="static" data-keyboard="false"
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
                                            <div className="col-12 d-flex">
                                                <div className="mr-2">
                                                    <h3 className="mb-0">{this.state.expenseMain.reason}</h3>
                                                    <strong>{moment(this.state.expenseMain.reportDate).format("DD MMM YYYY")}</strong>
                                                </div>
                                                {this.props.canUpdate !== false && (
                                                    <div className="pointer" onClick={() => { this.handleOpenMyExpenseDetailsDialog(true, this.state.expenseMainDialog) }}>
                                                        <Icon
                                                            path={mdiPencil}
                                                            title="Edit"
                                                            size={1}
                                                            horizontal
                                                            vertical
                                                            rotate={180}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body text-left modal-height">
                                        <Formik
                                            initialValues={this.state.expense}
                                            // enableReinitialize={true}
                                            validate={values => {
                                                let errors = {};
                                                if (!values.reportDate) {
                                                    errors.reportDate = "Please select date"
                                                }
                                                if (!values.expenseDate) {
                                                    errors.expenseDate = "Please select date"
                                                }
                                                if (!values.type) {
                                                    errors.type = "Please select expense type"
                                                }
                                                if (!values.amount) {
                                                    errors.amount = "Please add amount"
                                                }
                                                console.log(errors)
                                                return errors;
                                            }}
                                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                let expenseMain = { ...this.state.expenseMain };
                                                let obj = { ...values };
                                                if (obj.file) {
                                                    let images = [];

                                                    if (obj.fileUrl) {
                                                        images.push(obj.fileUrl)
                                                    } else {
                                                        let tokenData = parseJwt();
                                                        let userId = tokenData.userid;
                                                        let selectedFiles = { ...obj.file }
                                                        if (Object.keys(selectedFiles).length > 0) {
                                                            Object.values(selectedFiles).forEach(file => {
                                                                images.push(
                                                                    `expenses/${userId}/${new Date().getTime()}-${file.name.replace(
                                                                        /&/g,
                                                                        ""
                                                                    )}`
                                                                );
                                                            });
                                                        }
                                                    }
                                                    var self = this;
                                                    self.setState({ loading: true });
                                                    let result = await httpClient("upload/generate-signed-urls", "POST", { imageNames: images });
                                                    if (result.success) {
                                                        for (var i = 0; i < result.data.length; i++) {
                                                            let directObj = result.data[i];
                                                            const formData = new FormData();
                                                            formData.append("key", directObj.params.key);
                                                            formData.append("acl", directObj.params.acl);
                                                            formData.append(
                                                                "x-amz-credential",
                                                                directObj.params["x-amz-credential"]
                                                            );
                                                            formData.append(
                                                                "x-amz-algorithm",
                                                                directObj.params["x-amz-algorithm"]
                                                            );
                                                            formData.append("x-amz-date", directObj.params["x-amz-date"]);
                                                            formData.append("policy", directObj.params["policy"]);
                                                            formData.append(
                                                                "x-amz-signature",
                                                                directObj.params["x-amz-signature"]
                                                            );
                                                            formData.append("file", obj.file[0]);
                                                            await fetch(directObj.form_url, {
                                                                method: "POST",
                                                                body: formData
                                                            });
                                                            obj.fileUrl = images[0];
                                                            obj.file = undefined;
                                                        }
                                                    } else {
                                                        this.props.showToast("Error while uploading file", "error");
                                                        return
                                                    }

                                                }
                                                if (this.state.editIndex > -1) {
                                                    expenseMain.expensesList[this.state.editIndex] = obj;
                                                } else {
                                                    expenseMain.expensesList.push(obj);
                                                }
                                                this.setState({
                                                    editIndex: -1,
                                                    expenseMain,
                                                }, () => {
                                                    resetForm({
                                                        reportDate: "",
                                                        type: "",
                                                        isBillable: false,
                                                        reason: "",
                                                        expenseDate: "",
                                                        customerProject: "",
                                                        amount: "",
                                                        paidBy: "me",
                                                        merchant: "",
                                                        creditCard: "",
                                                        details: "",
                                                        status: "on-hold",
                                                        file: "",
                                                        fileUrl: ""
                                                    })
                                                })
                                            }
                                            }
                                        >
                                            {({
                                                values,
                                                errors,
                                                touched,
                                                handleReset,
                                                handleChange,
                                                handleSubmit,
                                                isSubmitting,
                                                resetForm,
                                                setFieldValue
                                                /* and other goodies */
                                            }) => (

                                                    <form onSubmit={handleSubmit}>
                                                        <div className="pl-lg-4">
                                                            {(this.props.canUpdate || this.state.editIndex > -1) && (

                                                                <div className="row">
                                                                    <div className="col-lg-6">
                                                                        <DateField label="Report Date"
                                                                            selected={values.reportDate}
                                                                            onChange={(date) => {
                                                                                setFieldValue("reportDate", date)
                                                                            }}
                                                                            showError={errors.reportDate && touched.reportDate ? true : false}
                                                                            error={errors.reportDate}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Reason for expense"
                                                                            type="text"
                                                                            placeholder="Reason"
                                                                            name="reason"
                                                                            value={values.reason}
                                                                            onChange={(event) => {
                                                                                setFieldValue("reason", event.target.value)
                                                                            }}
                                                                            showError={errors.reason && touched.reason ? true : false}
                                                                            error={errors.reason}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="expenseType"
                                                                            >
                                                                                Expense Type
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="type"
                                                                                id="expenseType"
                                                                                value={values.type}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {EXPENSE_TYPES.map((expenseType, index) => (
                                                                                    <option value={expenseType} key={index}>
                                                                                        {expenseType}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.type && touched.type && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.type}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <DateField label="Expense Date"
                                                                            selected={values.expenseDate}
                                                                            onChange={(date) => {
                                                                                setFieldValue("expenseDate", date)
                                                                            }}
                                                                            showError={errors.expenseDate && touched.expenseDate ? true : false}
                                                                            error={errors.expenseDate}
                                                                        />

                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <div className="form-group mt-4">
                                                                            <div className="custom-control custom-control-alternative custom-checkbox">
                                                                                <input
                                                                                    className="custom-control-input"
                                                                                    id=" customCheckLogin"
                                                                                    type="checkbox"
                                                                                    value={values.isBillable}
                                                                                    checked={values.isBillable ? true : false}
                                                                                    onChange={() => {
                                                                                        setFieldValue("isBillable", !values.isBillable)
                                                                                    }}
                                                                                />
                                                                                <label
                                                                                    className="custom-control-label"
                                                                                    htmlFor=" customCheckLogin"
                                                                                >
                                                                                    <span>Billable?</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Customer Project"
                                                                            type="text"
                                                                            placeholder="Project"
                                                                            name="customerProject"
                                                                            value={values.customerProject}
                                                                            onChange={(event) => {
                                                                                setFieldValue("customerProject", event.target.value)
                                                                            }}
                                                                            showError={errors.customerProject && touched.customerProject ? true : false}
                                                                            error={errors.customerProject}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Amount"
                                                                            type="number"
                                                                            placeholder="Amount"
                                                                            name="amount"
                                                                            value={values.amount}
                                                                            onChange={(event) => {
                                                                                setFieldValue("amount", Number(event.target.value))
                                                                            }}
                                                                            showError={errors.amount && touched.amount ? true : false}
                                                                            error={errors.amount}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Merchant"
                                                                            type="text"
                                                                            placeholder="Merchant"
                                                                            name="merchant"
                                                                            value={values.merchant}
                                                                            onChange={(event) => {
                                                                                setFieldValue("merchant", event.target.value)
                                                                            }}
                                                                            showError={errors.merchant && touched.merchant ? true : false}
                                                                            error={errors.merchant}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <div className="form-group mt-4">
                                                                            <div className="custom-control custom-control-alternative custom-checkbox">
                                                                                <input
                                                                                    className="custom-control-input"
                                                                                    id=" paid_by_me"
                                                                                    type="checkbox"
                                                                                    checked={values.paidBy === "me"}
                                                                                    onChange={() => {
                                                                                        setFieldValue("paidBy", "me")
                                                                                    }}
                                                                                />
                                                                                <label
                                                                                    className="custom-control-label"
                                                                                    htmlFor=" paid_by_me"
                                                                                >
                                                                                    <span>Paid by Me</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group mt-4">
                                                                            <div className="custom-control custom-control-alternative custom-checkbox">
                                                                                <input
                                                                                    className="custom-control-input"
                                                                                    id=" paid_by_company"
                                                                                    type="checkbox"
                                                                                    checked={values.paidBy === "company"}
                                                                                    onChange={() => {
                                                                                        setFieldValue("paidBy", "company")
                                                                                    }}
                                                                                />
                                                                                <label
                                                                                    className="custom-control-label"
                                                                                    htmlFor=" paid_by_company"
                                                                                >
                                                                                    <span>Paid by Company</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Credit Card"
                                                                            type="text"
                                                                            placeholder="Select Credit Card"
                                                                            name="creditCard"
                                                                            value={values.creditCard}
                                                                            onChange={(event) => {
                                                                                setFieldValue("creditCard", event.target.value)
                                                                            }}
                                                                            showError={errors.creditCard && touched.creditCard ? true : false}
                                                                            error={errors.creditCard}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <TextField label="Details"
                                                                            type="text"
                                                                            placeholder="Details"
                                                                            name="details"
                                                                            value={values.details}
                                                                            onChange={(event) => {
                                                                                setFieldValue("details", event.target.value)
                                                                            }}
                                                                            showError={errors.details && touched.details ? true : false}
                                                                            error={errors.details}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        {values.fileUrl ? (
                                                                            <div className="expense-img-container">
                                                                                <img src={`${AWS_URL}${values.fileUrl}`} className="expense-img" alt="expense" />
                                                                                <span className="ni ni-2x ni-fat-remove expense-remove-icon" onClick={async () => {
                                                                                    let obj = { ...values };
                                                                                    let result = await httpClient("upload/delete-images", "DELETE", { fileUrls: [values.fileUrl] });
                                                                                    if (result.success) {
                                                                                        if (this.props.data && this.props.data._id && this.state.editIndex > -1) {
                                                                                            obj.fileUrl = "";
                                                                                            let expensesList = [...this.state.expenseMain.expensesList];
                                                                                            expensesList[this.state.editIndex] = obj
                                                                                            resetForm({ ...obj })
                                                                                            this.setState(prevState => ({
                                                                                                expenseMain: {
                                                                                                    ...prevState.expenseMain,
                                                                                                    expensesList,
                                                                                                }
                                                                                            }), async () => {
                                                                                                await this.saveExpense()
                                                                                                await this.props.getExpensesFrom(0)
                                                                                            })
                                                                                        }
                                                                                    } else {
                                                                                        this.props.showToast("Error while deleting file")
                                                                                    }
                                                                                }}></span>
                                                                            </div>
                                                                        ) : (

                                                                                <TextField label="Image"
                                                                                    type="file"
                                                                                    name="file"
                                                                                    onChange={(event) => {
                                                                                        setFieldValue("file", event.target.files)
                                                                                    }}
                                                                                />
                                                                            )}
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="d-flex justify-content-end">
                                                                            {this.state.expenseMain.expensesList.length === 0 && (
                                                                                <div>

                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-link  ml-auto"
                                                                                        onClick={() => this.handleCloseDialog()}
                                                                                    >
                                                                                        Close
                                                                            </button>
                                                                                </div>
                                                                            )}
                                                                            <div>

                                                                                <button type="submit" className="btn btn-primary">
                                                                                    {this.state.editIndex === -1 ? "Add" : "Update"}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {this.state.expenseMain.expensesList.length > 0 && (
                                                                <div className="col-lg-12">
                                                                    <br />
                                                                    <div className="bt-table">
                                                                        <table className="table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Date</th>
                                                                                    <th>Customer:Project</th>
                                                                                    <th>Type</th>
                                                                                    <th>Details</th>
                                                                                    <th>Amount</th>
                                                                                    <th>Reimbursable</th>
                                                                                    <th>Billable</th>
                                                                                    <th>Status</th>
                                                                                    <th>Receipts</th>
                                                                                    <th>Attendees</th>
                                                                                    {this.props.data && this.props.data._id && (
                                                                                        <th>Actions</th>
                                                                                    )}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {this.state.expenseMain.expensesList.map((expense, index) => (
                                                                                    (!this.props.selectedStatus || this.props.selectedStatus === expense.status) && (
                                                                                        <tr key={index}>
                                                                                            <td>{moment(expense.expenseDate).format("DD MMM YYYY")}</td>
                                                                                            <td>{expense.customerProject}</td>
                                                                                            <td>{expense.type}</td>
                                                                                            <td>{expense.details}</td>
                                                                                            <td>{expense.amount}</td>
                                                                                            <td>{expense.paidBy === "company" ? "Yes" : "NO"}</td>
                                                                                            <td>{expense.isBillable ? "Yes" : "No"}</td>
                                                                                            <td>{getExpenseStatus(expense.status)}</td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            {this.props.data && this.props.data._id && (
                                                                                                <td>
                                                                                                    {this.props.canUpdate === false ? (
                                                                                                        <React.Fragment>
                                                                                                            <button type="button" onClick={() => {
                                                                                                                let expenseToEdit = { ...expense };
                                                                                                                expenseToEdit.reportDate = moment(expenseToEdit.reportDate).toDate();
                                                                                                                expenseToEdit.expenseDate = moment(expenseToEdit.expenseDate).toDate();
                                                                                                                this.setState({
                                                                                                                    editIndex: index
                                                                                                                }, () => {
                                                                                                                    resetForm(expenseToEdit)
                                                                                                                })
                                                                                                            }} className="btn btn-sm btn-primary">Edit</button>
                                                                                                            {expense.status === "submitted" && (
                                                                                                                <button type="button" onClick={() => this.changeStatus(index, "archived")} className="btn btn-sm btn-success">Archive</button>
                                                                                                            )}
                                                                                                            {expense.status === "archived" && (
                                                                                                                <button type="button" onClick={() => this.changeStatus(index, "submitted")} className="btn btn-sm btn-success">Submit</button>
                                                                                                            )}
                                                                                                        </React.Fragment>
                                                                                                    ) : (
                                                                                                            <React.Fragment>
                                                                                                                {expense.status !== "submitted" && (
                                                                                                                    <React.Fragment>
                                                                                                                        <button type="button" onClick={() => {
                                                                                                                            if (expense.status === "submitted") {
                                                                                                                                this.props.showToast("This expense has already been submitted to approver", "error")
                                                                                                                            } else {
                                                                                                                                let expenseToEdit = { ...expense };
                                                                                                                                expenseToEdit.reportDate = moment(expenseToEdit.reportDate).toDate();
                                                                                                                                expenseToEdit.expenseDate = moment(expenseToEdit.expenseDate).toDate();
                                                                                                                                this.setState({
                                                                                                                                    editIndex: index
                                                                                                                                }, () => {
                                                                                                                                    resetForm(expenseToEdit)
                                                                                                                                })
                                                                                                                            }
                                                                                                                        }} className="btn btn-sm btn-primary">Edit</button>
                                                                                                                        {this.state.expenseMain.expensesList.length > 1 && (
                                                                                                                            <button type="button" onClick={() => this.handleDeleteExpense(index)} className="btn btn-sm btn-danger">Delete</button>
                                                                                                                        )}
                                                                                                                        <button type="button" onClick={() => this.changeStatus(index, "submitted")} className="btn btn-sm btn-success">Submit</button>
                                                                                                                    </React.Fragment>
                                                                                                                )}
                                                                                                            </React.Fragment>
                                                                                                        )}

                                                                                                </td>
                                                                                            )}
                                                                                        </tr>
                                                                                    )
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <br />
                                                                    <div className="d-flex justify-content-end">
                                                                        <div>

                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-link  ml-auto"
                                                                                onClick={() => this.handleCloseDialog()}
                                                                            >
                                                                                Close
                                                                            </button>
                                                                        </div>
                                                                        <div>

                                                                            <button type="button" className="btn btn-primary" onClick={() => this.saveExpense(true)}>
                                                                                Save
                                                                                    </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
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
                {
                    this.state.expenseMainDialog.isOpen && <AddExpenseDetails reportDate={this.state.expenseMain.reportDate}
                        reason={this.state.expenseMain.reason} handleCloseDialog={(data) => this.handleOpenMyExpenseDetailsDialog(false, data)} />
                }
            </React.Fragment >
        );
    }
}

export default AddMyExpenseModal;