import React, { Component } from "react";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from "react-toasts";
import { httpClient } from "../../../UtilService";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import AddExpenseListModal from "./AddExpenseListModal";
import ReactLoading from "react-loading";
import { withConfirmDialogContext } from "../../common/ConfirmDialogProvide";
class ExpenseListMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            allExpenseList: [],
            expenseList: [],
            search: {
                from: 0,
                size: 10,
                status: ""
            },
            hasMoreResults: false,
            addExpenseDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                expenses: []
            }
        };
    }

    componentDidMount = async () => {
        await this.getExpenseList();
    }


    getExpenseList = async () => {
        this.setState({ isLoading: true });
        let searchObj = { ...this.state.search }
        let result = await httpClient("list/expense-item-list", "POST", searchObj);
        if (result.success) {
            let allExpenseList = [...result.data];
            let expenseList = [...result.data];
            this.setState({
                allExpenseList: allExpenseList,
                expenseList: expenseList,
                hasMoreResults: result.data.length === this.state.search.size,
                isLoading: false
            });
        } else {
            this.setState({ isLoading: false })
            this.showToast("Error while getting expense list", "error")
        }
    }

    getExpenseListFrom = (from) => {
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                from: from,
            },
        }), this.getExpenseList)
    }

    showToast = (msg, type) => {
        if (type === "success") {
            ToastsStore.success(msg)
        } else {
            ToastsStore.error(msg)
        }
    }

    handleOpenExpenseDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#list_expense_add_dialog").modal("hide");
        }
        let expenses = [...this.state.allExpenseList];
        if (editIndex !== undefined) {
            let expenseObj = this.state.expenseList[editIndex];
            let index = expenses.findIndex(x => x._id === expenseObj._id);
            expenses.splice(index, 1);
        }
        this.setState({
            addExpenseDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.expenseList[editIndex] } : undefined,
                editIndex: editIndex,
                expenses: expenses,
            }
        }, () => {
            if (isOpen) {
                window.$("#list_expense_add_dialog").modal("show");
            }
        })
    }

    handleCloseDialog = (data) => {
        window.$("#list_expense_add_dialog").modal("hide");
        this.setState({
            addExpenseDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                expenses: []
            }
        }, () => {
            if (data) {
                this.getExpenseListFrom(0)
            }
        })
    }

    handleDelete = (index) => {
        this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
            this.setState({ isLoading: true })

            let result = await httpClient(`list/expense-item/${this.state.expenseList[index]._id}`, "DELETE");
            if (result.success) {
                this.showToast("Expense list deleted successfully", "success");
                let expenseList = [...this.state.expenseList];
                expenseList.splice(index, 1);
                this.setState({
                    expenseList: expenseList,
                    isLoading: false
                })
            } else {
                this.setState({ isLoading: false })
                this.showToast("Error while getting deleting expense list", "error")
            }
        })
    }

    handleStatusChange = (event) => {
        let eve = { ...event };
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                [eve.target.name]: eve.target.value,
                from: 0
            },
        }), this.getExpenseList)
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
                <ToastsContainer
                    store={ToastsStore}
                    position={ToastsContainerPosition.TOP_RIGHT}
                />
                <div className="text-right">
                    <select name="status" className="mr-1" value={this.state.search.status} onChange={this.handleStatusChange}>
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="not-active">Not Active</option>
                    </select>
                    <button
                        className="btn btn-sm btn-icon btn-3 btn-primary text-right"
                        type="button"
                        onClick={() => this.handleOpenExpenseDialog(true)}
                    >
                        <span className="btn-inner--icon">
                            <Icon
                                path={mdiPlus}
                                title="Dashboard"
                                size={1}
                                horizontal
                                vertical
                                rotate={180}
                                color="#ffffff"
                            />
                        </span>

                        <span className="btn-inner--text">Add</span>
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table align-items-center table-flush mt-2">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Account</th>
                                <th>Account type</th>
                                <th scope="col">Allow expense</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.expenseList.map((expense, index) => (
                                <tr key={index}>
                                    <td>
                                        <span >
                                            {expense.account}
                                        </span>
                                    </td>
                                    <td>{expense.accountType}</td>
                                    <td>{expense.isAllowExpense ? "Active" : "Not Active"}</td>
                                    <td>
                                        <button type="button" onClick={() => this.handleOpenExpenseDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                        <button type="button" onClick={() => this.handleDelete(index)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {this.state.expenseList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">No expenses found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpenseListFrom(this.state.search.from - this.state.search.size)} disabled={this.state.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpenseListFrom(this.state.search.from + this.state.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div>
                {this.state.addExpenseDialog.isOpen && (
                    <AddExpenseListModal expenses={this.state.addExpenseDialog.expenses} data={this.state.addExpenseDialog.data} showToast={this.showToast} handleCloseDialog={this.handleCloseDialog} />
                )}
            </React.Fragment>
        );
    }
}

export default withConfirmDialogContext(ExpenseListMain);
