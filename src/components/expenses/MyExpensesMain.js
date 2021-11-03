import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import ReactLoading from "react-loading";
import { ToastsStore, ToastsContainerPosition, ToastsContainer } from "react-toasts";
import AddMyExpenseModal from "./AddMyExpenseModal";
import AddExpenseDetails from "./AddExpenseDetails";
import { httpClient } from "../../UtilService";
import "./expense.css"
import ExpensesList from "./ExpensesList";
import moment from "moment";
class MyExpensesMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            expenses: {
                data: [],
                search: {
                    from: 0,
                    size: 10
                }
            },
            hasMoreResults: false,
            expenseDialog: {
                isOpen: false,
                data: undefined
            },
            expenseMainDialog: {
                isOpen: false,
                reportDate: undefined,
                reason: ""
            }
        };
    }

    componentDidMount() {
        this.getExpensesList();
    }

    getExpensesList = async () => {
        var self = this;
        this.setState({ isLoading: true })
        let result = await httpClient("expenses/list", "POST", { ...this.state.expenses.search });
        console.log(result)
        if (result.success) {
            result.data = result.data.map(x => {
                let status = "submitted";
                let data = x.expensesList.reduce((acc, ele) => {
                    acc.amount += Number(ele.amount);
                    if (ele.isBillable) {
                        acc.due += Number(ele.amount);
                    }
                    if (ele.status === "on-hold") {
                        status = "on-hold"
                    }
                    if (ele.isBillable) {
                        acc.billable += Number(ele.amount);
                    }
                    return acc
                }, {
                    amount: 0,
                    due: 0,
                    billable: 0
                });
                x.amount = data.amount;
                x.due = data.due;
                x.status = status;
                return x;
            })
            self.setState(prevState => ({
                expenses: {
                    ...prevState.expenses,
                    data: result.data
                },
                hasMoreResults: result.data.length === this.state.expenses.search.size,
                isLoading: false
            }));
        } else {
            this.setState({ isLoading: false })
            this.showToast("Error while getting my expenses", "error")
        }
    }

    getExpensesFrom = from => {
        this.setState(prevState => ({
            expenses: {
                ...prevState.expenses,
                search: {
                    ...prevState.expenses.search,
                    from: from,
                }
            },
        }), this.getExpensesList);
    }

    showToast = (msg, type) => {
        if (type === "success") {
            ToastsStore.success(msg)
        } else {
            ToastsStore.error(msg)
        }
    }

    handleAddMyExpenseDialog = (isOpen, index) => {
        let expense = undefined;
        let expenseMainDialog = { ...this.state.expenseMainDialog }
        if (index !== undefined) {
            expense = this.state.expenses.data[index];
            expenseMainDialog.reportDate = moment(expense.reportDate).toDate();
            expenseMainDialog.reason = expense.reason
        }
        this.setState({
            expenseDialog: {
                isOpen: true,
                data: expense
            },
            expenseMainDialog: { ...expenseMainDialog }
        }, () => {
            console.log("data");
            window.$("#my_expense_modal").modal("show")
        })
    }

    handleOpenMyExpenseDetailsDialog = (isOpen, data) => {
        if (!isOpen) {
            window.$("#my_expense_main_modal").modal("hide");
        }
        this.setState({
            expenseMainDialog: {
                isOpen: isOpen,
                reportDate: data ? data.reportDate : undefined,
                reason: data ? data.reason : "",
            }
        }, () => {
            if (isOpen) {
                window.$("#my_expense_main_modal").modal("show");
            }
            if (isOpen === false && data) {
                this.handleAddMyExpenseDialog(true)
            }
        })
    }

    handleCloseDialog = (data) => {
        window.$("#my_expense_modal").modal("hide");
        this.setState({
            expenseDialog: {
                isOpen: false,
                data: undefined
            }
        }, () => {
            if (data) {
                this.getExpensesFrom(0)
            }
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
                <ToastsContainer
                    store={ToastsStore}
                    position={ToastsContainerPosition.TOP_RIGHT}
                />
                <div className="text-right">
                    <button
                        className="btn btn-icon btn-3 btn-primary text-right"
                        type="button"
                        onClick={() => this.handleOpenMyExpenseDetailsDialog(true)}
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
                <ExpensesList expenses={this.state.expenses.data} handleAddMyExpenseDialog={this.handleAddMyExpenseDialog}></ExpensesList>
                <br />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpensesFrom(this.state.expenses.search.from - this.state.expenses.search.size)} disabled={this.state.expenses.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpensesFrom(this.state.expenses.search.from + this.state.expenses.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div>
                {this.state.expenseDialog.isOpen && <AddMyExpenseModal showToast={this.showToast}
                    getExpensesFrom={this.getExpensesFrom}
                    reportDate={this.state.expenseMainDialog.reportDate}
                    canUpdate={true}
                    reason={this.state.expenseMainDialog.reason}
                    data={this.state.expenseDialog.data}
                    handleCloseDialog={this.handleCloseDialog} />}
                {this.state.expenseMainDialog.isOpen && <AddExpenseDetails handleCloseDialog={(data) => this.handleOpenMyExpenseDetailsDialog(false, data)} />}
            </React.Fragment>
        );
    }
}

export default MyExpensesMain;
