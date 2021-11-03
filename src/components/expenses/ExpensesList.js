import React, { Component } from 'react';
import { getExpenseStatus } from '../../UtilService';
import moment from 'moment';
class ExpensesList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        console.log("props", this.props.selectedStatus)
        return (
            <React.Fragment>
                <div className="table-responsive">
                    <table className="table align-items-center table-flush mt-2">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Reason</th>
                                <th scope="col">Date</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Due</th>
                                {this.props.canUpdate !== false && (
                                    <th scope="col">Status</th>
                                )}
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.expenses.map((expense, index) => (
                                <tr key={index} onClick={() => this.props.handleAddMyExpenseDialog(true, index)}>
                                    <td>
                                        <span >
                                            {expense.reason}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <span>{moment(expense.reportDate).format("LL")}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span >
                                            {expense.amount}
                                        </span>
                                    </td>
                                    <td>
                                        <span >
                                            {expense.due}
                                        </span>
                                    </td>
                                    {this.props.canUpdate !== false && (
                                        <td>
                                            <span >
                                                {getExpenseStatus(expense.status)}
                                            </span>
                                        </td>
                                    )}
                                    <td className="text-right">
                                        {/* <div className="dropdown">
                                            <a
                                                className="btn btn-sm btn-icon-only text-light"
                                                href="/"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                >
                                                <Icon
                                                path={mdiDotsVertical}
                                                title="Dashboard"
                                                size={1}
                                                horizontal
                                                vertical
                                                rotate={180}
                                                color="#000000"
                                                />
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                                <a className="dropdown-item" href="/">
                                                Action
                                                </a>
                                                </div>
                                            </div> */}
                                    </td>
                                </tr>
                            ))}
                            {this.props.expenses.length === 0 && (
                                <tr>
                                    <td colSpan="5">No Expenses Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default ExpensesList;