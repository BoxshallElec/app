import React, { Component } from "react";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { httpClient } from "../../../UtilService";
import "./admin-expenses.css";
import { EXPENSE_STATUS } from "../../Constant";

class ExpenseStatusMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expensesCountDetails: {},
    };
  }

  componentDidMount = async () => {
    await this.getExpensesCount();
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isUpdateCount !== prevState.isUpdateCount) {
      return {
        isUpdateCount: nextProps.isUpdateCount,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isUpdateCount !== this.state.isUpdateCount) {
      this.setState(
        (prevState) => ({
          isUpdateCount: this.props.isUpdateCount,
        }),
        this.getExpensesCount
      );
    }
  }

  getExpensesCount = async () => {
    this.setState({ isLoading: true });
    let result = await httpClient("expenses/admin-expenses-count", "GET");
    if (result.success) {
      let expensesCountDetails = result.data.reduce((acc, ele) => {
        acc[ele.status] = ele;
        return acc;
      }, {});
      this.setState({
        expensesCountDetails: expensesCountDetails,
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting my expenses", "error");
    }
  };

  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <div className="row">
          {EXPENSE_STATUS.map((status) => (
            <div
              key={status.value}
              className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"
              onClick={() => this.props.onStatusSelected(status.value)}
            >
              <div
                className={`align-items-center d-flex status-card  ${
                  status.value
                } ${
                  status.value === this.props.selectedStatus ? "selected" : ""
                }`}
              >
                <div className="align-items-center d-flex justify-content-center status-count">
                  {this.state.expensesCountDetails[status.value]
                    ? this.state.expensesCountDetails[status.value].count
                    : 0}
                </div>
                <div className="flex-column d-flex justify-content-center">
                  <label>{status.label}</label>
                  <span>
                    {this.state.expensesCountDetails[status.value]
                      ? this.state.expensesCountDetails[status.value]
                          .totalAmount
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default ExpenseStatusMain;
