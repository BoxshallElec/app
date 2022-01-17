import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import ReactLoading from "react-loading";
import {
  ToastsStore,
  ToastsContainerPosition,
  ToastsContainer,
} from "react-toasts";
import AddCustomerModal from "./AddCustomerModal";
import { httpClient } from "../../UtilService";
import ReactPaginate from "react-paginate";
import EditCustomerDialog from "./EditCustomerDialog";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      customers: [],
      totalCount: 0,
      customerDialog: {
        isOpen: false,
        editIndex: -1,
        data: undefined,
      },
    };
  }

  componentDidMount() {
    this.getCustomerList({ selected: 0 });
  }

  updateCustomers = (data) => {
    this.setState({ customers: data });
  };

  getCustomerList = async (data) => {
    var self = this;
    const from = data.selected * 10;

    this.setState({ isLoading: true });
    let result = await httpClient("client/list", "POST", {
      from: from,
    });

    if (result.success) {
      console.log("Customer");
      console.log(result);
      self.setState({
        customers: result.data.QueryResponse.Customer,
        isLoading: false,
        totalCount: Math.ceil(result.totalCount / 10),
      });
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting customers", "error");
    }
  };

  showToast = (msg, type) => {
    if (type === "success") {
      ToastsStore.success(msg);
    } else {
      ToastsStore.error(msg);
    }
  };

  handleAddCustomer = () => {
    this.setState(
      {
        customerDialog: {
          isOpen: true,
          editIndex: -1,
          data: undefined,
        },
      },
      () => {
        window.$("#add_customer_modal").modal("show");
      }
    );
  };

  handleEditCustomer = (index) => {
    this.setState(
      {
        customerDialog: {
          isOpen: true,
          editIndex: index,
          data: this.state.customers[index],
        },
      },
      () => {
        window.$("#customer_edit_dialog").modal("show");
      }
    );
  };

  handleCloseDialog = async (data) => {
    window.$("#customer_edit_dialog").modal("hide");
    window.$("#add_customer_modal").modal("hide");
    this.setState(
      {
        customerDialog: {
          isOpen: false,
          editIndex: -1,
          data: undefined,
        },
      },
      () => {
        if (data) {
          const self = this;
          self.getCustomerList({ selected: 0 });
        }
      }
    );
  };

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
            onClick={() => this.handleAddCustomer()}
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
                <th scope="col">Customer:Project</th>
                <th scope="col">Team</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((customer, index) => (
                <tr key={index}>
                  <td>
                    <span>{customer.FullyQualifiedName}</span>
                  </td>
                  <td>
                    <span>{customer.employees ? "All Employees" : "N/A"}</span>
                  </td>
                  <td>
                    <td>
                      <button
                        type="button"
                        onClick={() => this.handleEditCustomer(index)}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      {/* <button type="button" onClick={() => this.handleDelete(index)} className="btn btn-sm btn-danger">Delete</button> */}
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.totalCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.getCustomerList}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            containerClassName={"pagination justify-content-center"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
        {this.state.customerDialog.isOpen && (
          <React.Fragment>
            {this.state.customerDialog.editIndex === -1 ? (
              <AddCustomerModal
                data={this.state.customerDialog.data}
                showToast={this.showToast}
                handleCloseDialog={this.handleCloseDialog}
              />
            ) : (
              <EditCustomerDialog
                data={this.state.customerDialog.data}
                showToast={this.showToast}
                handleCloseDialog={this.handleCloseDialog}
                updateCustomers={this.updateCustomers}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Customers;
