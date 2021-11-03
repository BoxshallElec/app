import React, { Component } from "react";
import { Formik } from "formik";
import TextField from "../../../shared/inputs/TextField";

import ReactLoading from "react-loading";
import { httpClient } from "../../../UtilService";
import { TASk_ACCOUNT_TYPES, EXPENSE_ACCOUNT_TYPES } from '../../Constant'

class AddExpenseListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: this.props.data ? this.props.data : {
                isActive: false,
                account: "",
                subAccountOf: "",
                accountType: "",
                accountNo: "",
                spendLimit: "",
                class: "",
                isPerDay: false,
                isAllowExpense: false,
                isMustEnterQnRate: false,
                defaultRate: "",
                vat: "",
                attendeesOption: "",
                trackNonBillable: "",
                trackBillable: ""
            },
            subClients: [],
            isLoading: false,
            classesList: [],
            classesDic: {}
        };
    }

    componentDidMount() {
        this.getClassesList();
    }

    getClassesList = async () => {
        this.setState({ isLoading: true })
        let result = await httpClient("class/list", "POST", {});
        if (result.success) {
            let classesDic = result.data.reduce((acc, ele) => {
                acc[ele._id] = ele.Name;
                return acc
            }, {})
            let classes = result.data.filter(x => x.Active === true);
            this.setState({
                classesList: classes,
                classesDic,
                isLoading: false
            })
        } else {
            this.setState({ isLoading: false })
            this.showToast("Error while getting my classes", "error")
        }
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
                    id="list_expense_add_dialog"
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
                                                if (!values.account) {
                                                    errors.account = "Required";
                                                }
                                                if (!values.accountType) {
                                                    errors.accountType = "Required";
                                                }
                                                return errors;
                                            }}
                                            onSubmit={async values => {
                                                this.setState({ isLoading: true });
                                                let result;
                                                if (values._id) {
                                                    result = await httpClient("list/expense-item", "PATCH", values);
                                                } else {
                                                    result = await httpClient("list/expense-item-add", "POST", values);
                                                }

                                                if (result.success) {
                                                    this.showToast(`Expense ${values._id ? 'updated' : 'added'} successfully`, "success");
                                                    this.handleCloseDialog(result.data)
                                                } else {
                                                    this.setState({ isLoading: false });
                                                    this.showToast(`Error while ${values._id ? 'updating' : 'adding'} expense`, "error");
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
                                                                                value={values.isActive}
                                                                                checked={values.isActive ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("isActive", !values.isActive)
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
                                                                    <TextField label="Account Name"
                                                                        type="text"
                                                                        placeholder="Account Name"
                                                                        name="account"
                                                                        value={values.account}
                                                                        onChange={(event) => {
                                                                            setFieldValue("account", event.target.value)
                                                                        }}
                                                                        showError={errors.account && touched.account ? true : false}
                                                                        error={errors.account}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="sub_account_of"
                                                                            >
                                                                                Sub Account of
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="subAccountOf"
                                                                                id="sub_account_of"
                                                                                value={values.subAccountOf}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {TASk_ACCOUNT_TYPES.map((task, index) => (
                                                                                    <option value={task} key={index}>
                                                                                        {task}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.subAccountOf && touched.subAccountOf && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.subAccountOf}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="account_type"
                                                                            >
                                                                                Account Type
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="accountType"
                                                                                id="account_type"
                                                                                value={values.accountType}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {EXPENSE_ACCOUNT_TYPES.map((accountType, index) => (
                                                                                    <option value={accountType} key={index}>
                                                                                        {accountType}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.accountType && touched.accountType && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.accountType}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                <div className="col-lg-6">
                                                                    <TextField label="Account No"
                                                                        type="text"
                                                                        placeholder="Account No"
                                                                        name="accountNo"
                                                                        value={values.accountNo}
                                                                        onChange={(event) => {
                                                                            setFieldValue("accountNo", event.target.value)
                                                                        }}
                                                                        showError={errors.accountNo && touched.accountNo ? true : false}
                                                                        error={errors.accountNo}
                                                                    />
                                                                </div>


                                                                <div className="col-lg-6">
                                                                    <TextField label="Spend Limit"
                                                                        type="number"
                                                                        placeholder="Spend Limit"
                                                                        name="spendLimit"
                                                                        value={values.spendLimit}
                                                                        onChange={(event) => {
                                                                            setFieldValue("spendLimit", event.target.value)
                                                                        }}
                                                                        showError={errors.spendLimit && touched.spendLimit ? true : false}
                                                                        error={errors.spendLimit}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="class"
                                                                            >
                                                                                Class
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="class"
                                                                                id="class"
                                                                                value={values.class}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {this.state.classesList.map((classObj, index) => (
                                                                                    <option value={classObj._id} key={index}>
                                                                                        {this.state.classesDic[classObj._id]}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.class && touched.class && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.class}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-4">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customIsPerDay"
                                                                                type="checkbox"
                                                                                value={values.isPerDay}
                                                                                checked={values.isPerDay ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("isPerDay", !values.isPerDay)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customIsPerDay"
                                                                            >
                                                                                <span>Per Day</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-4">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customAllowExpense"
                                                                                type="checkbox"
                                                                                value={values.isAllowExpense}
                                                                                checked={values.isAllowExpense ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("isAllowExpense", !values.isAllowExpense)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customAllowExpense"
                                                                            >
                                                                                <span>Allow Expense</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customMustEnter"
                                                                                type="checkbox"
                                                                                value={values.isMustEnterQnRate}
                                                                                checked={values.isMustEnterQnRate ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("isMustEnterQnRate", !values.isMustEnterQnRate)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customMustEnter"
                                                                            >
                                                                                <span>Must Enter Quantity and Rate</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                <div className="col-lg-6">
                                                                    <TextField label="Default Rate"
                                                                        type="number"
                                                                        placeholder="Default Rate"
                                                                        name="defaultRate"
                                                                        value={values.defaultRate}
                                                                        onChange={(event) => {
                                                                            setFieldValue("defaultRate", event.target.value)
                                                                        }}
                                                                        showError={errors.defaultRate && touched.defaultRate ? true : false}
                                                                        error={errors.defaultRate}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="form-group mt-4">
                                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                                            <input
                                                                                className="custom-control-input"
                                                                                id=" customLockRate"
                                                                                type="checkbox"
                                                                                value={values.isLockRate}
                                                                                checked={values.isLockRate ? true : false}
                                                                                onChange={() => {
                                                                                    setFieldValue("isLockRate", !values.isLockRate)
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="custom-control-label"
                                                                                htmlFor=" customLockRate"
                                                                            >
                                                                                <span>Lock Rate</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <TextField label="Vat"
                                                                        type="number"
                                                                        placeholder="Vat"
                                                                        name="vat"
                                                                        value={values.vat}
                                                                        onChange={(event) => {
                                                                            setFieldValue("vat", event.target.value)
                                                                        }}
                                                                        showError={errors.vat && touched.vat ? true : false}
                                                                        error={errors.vat}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <label>Attendees Option</label>
                                                                    <br />
                                                                    <div className="d-flex">
                                                                        <div class="radio">
                                                                            <label>
                                                                                <input type="radio" name="attendeesOption" checked={values.attendeesOption === "not-required"} onChange={() => setFieldValue("attendeesOption", "not-required")} />
                                                                                Not Required
                                                                        </label>
                                                                        </div> &nbsp;&nbsp;
                                                                        <div class="radio">
                                                                            <label>
                                                                                <input type="radio" name="attendeesOption" checked={values.attendeesOption === "required"} onChange={() => setFieldValue("attendeesOption", "required")} />
                                                                                Required
                                                                        </label>
                                                                        </div>&nbsp;&nbsp;
                                                                        <div class="radio">
                                                                            <label>
                                                                                <input type="radio" name="attendeesOption" checked={values.attendeesOption === "optional"} onChange={() => setFieldValue("attendeesOption", "optional")} />
                                                                                Optional
                                                                        </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <p className="mt-4">For non billable expense, track in Account</p>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="non_billable"
                                                                            >
                                                                                Non billable
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="trackNonBillable"
                                                                                id="non_billable"
                                                                                value={values.trackNonBillable}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {TASk_ACCOUNT_TYPES.map((taskType, index) => (
                                                                                    <option value={taskType} key={index}>
                                                                                        {taskType}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.trackNonBillable && touched.trackNonBillable && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.trackNonBillable}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <p className="mt-4">For billable expense, track in Account</p>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="form-group">
                                                                        <div className="form-group">
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="billable"
                                                                            >
                                                                                Billable
                                                                        </label>
                                                                            <select
                                                                                className="form-control input-group input-group-alternative"
                                                                                name="trackBillable"
                                                                                id="billable"
                                                                                value={values.trackBillable}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value=""></option>
                                                                                {TASk_ACCOUNT_TYPES.map((taskType, index) => (
                                                                                    <option value={taskType} key={index}>
                                                                                        {taskType}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.trackBillable && touched.trackBillable && (
                                                                                <div>
                                                                                    <small className="text-danger">
                                                                                        {errors.trackBillable}
                                                                                    </small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
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

export default AddExpenseListModal;
