import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import { ToastsStore, ToastsContainerPosition, ToastsContainer } from "react-toasts";
import AddMyExpenseModal from "../../expenses/AddMyExpenseModal";
import { httpClient } from "../../../UtilService";
import moment from 'moment';
import "../../expenses/expense.css"
import ExpensesList from "../../expenses/ExpensesList";
class AdminExpensesMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            expensesCountDetails: {},
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
            selectedStatus: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedStatus !== prevState.selectedStatus) {
            return {
                selectedStatus: nextProps.selectedStatus
            }
        }
        return null
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedStatus !== this.state.selectedStatus) {
            console.log("status updated");
            this.setState(prevState => ({
                selectedStatus: this.props.selectedStatus,
                expenses: {
                    ...prevState.expenses,
                    search: {
                        ...prevState.expenses.search,
                        from: 0
                    }
                }
            }), this.getExpensesList)
        }
    }

    getExpensesList = async () => {
        var self = this;
        this.setState({ isLoading: true })
        let result = await httpClient("expenses/admin-list", "POST", { ...this.state.expenses.search, status: this.state.selectedStatus });
        console.log(result)
        if (result.success) {
            result.data = result.data.map(x => {
                let status = "submitted";
                let data = x.expensesList.reduce((acc, ele) => {
                    if (ele.status === this.state.selectedStatus) {
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
                hasMoreResults: this.state.expenses.search.size === result.data.length,
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

    handleCloseDialog = (data) => {
        window.$("#my_expense_modal").modal("hide");
        this.setState({
            expenseDialog: {
                isOpen: false,
                data: undefined
            }
        }, () => {
            if (data) {
                this.props.updateExpenseCount()
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
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6">

                    </div>
                </div>
                <ToastsContainer
                    store={ToastsStore}
                    position={ToastsContainerPosition.TOP_RIGHT}
                />

                <ExpensesList selectedStatus={this.state.selectedStatus} canUpdate={false} expenses={this.state.expenses.data} handleAddMyExpenseDialog={this.handleAddMyExpenseDialog}></ExpensesList>
                <br />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpensesFrom(this.state.expenses.search.from - this.state.expenses.search.size)} disabled={this.state.expenses.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getExpensesFrom(this.state.expenses.search.from + this.state.expenses.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div>
                {this.state.expenseDialog.isOpen && <AddMyExpenseModal showToast={this.showToast}
                    getExpensesFrom={this.getExpensesFrom}
                    reportDate={this.state.expenseMainDialog.reportDate}
                    canUpdate={false}
                    selectedStatus={this.state.selectedStatus}
                    reason={this.state.expenseMainDialog.reason}
                    data={this.state.expenseDialog.data}
                    handleCloseDialog={this.handleCloseDialog} />}
            </React.Fragment>
        );
    }
}

export default AdminExpensesMain;
