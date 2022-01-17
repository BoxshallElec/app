import React, { Component } from "react";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from "react-toasts";
import { httpClient } from "../../../UtilService";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import AddVendorModal from "./AddVendorModal";
import ReactLoading from "react-loading";
import { withConfirmDialogContext } from "../../common/ConfirmDialogProvide";
class VendorsMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            allVendorsList: [],
            vendorsList: [],
            search: {
                from: 0, size: 10,
                status: ""
            },
            hasMoreResults: false,
            addVendorDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                vendors: []
            }
        };
    }

    componentDidMount = async () => {
        await this.getVendorsList();
    }


    getVendorsList = async () => {
        var self = this;
    const from = 0;

    this.setState({ isLoading: true });
    let result = await httpClient("vendor/list", "POST", {
      from: from,
    });

    if (result.success) {
      console.log("Vendor");
      console.log(result);
      self.setState({
        vendorsList: result.data.QueryResponse.Vendor,
        isLoading: false,
        totalCount: Math.ceil(result.totalCount / 10),
      });
    } else {
      this.setState({ isLoading: false });
      this.showToast("Error while getting customers", "error");
    }
    }

    getVendorListFrom = (from) => {
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                from: from,
            },
        }), this.getVendorsList)
    }

    showToast = (msg, type) => {
        if (type === "success") {
            ToastsStore.success(msg)
        } else {
            ToastsStore.error(msg)
        }
    }

    handleOpenVendorDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#list_vendor_add_dialog").modal("hide");
        }
        let vendors = [...this.state.allVendorsList];
        if (editIndex !== undefined) {
            let vendorObj = this.state.vendorsList[editIndex];
            let index = vendors.findIndex(x => x._id === vendorObj._id);
            vendors.splice(index, 1);
        }
        this.setState({
            addVendorDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.vendorsList[editIndex] } : undefined,
                editIndex: editIndex,
                vendors: vendors,
            }
        }, () => {
            if (isOpen) {
                window.$("#list_vendor_add_dialog").modal("show");
            }
        })
    }

    handleCloseDialog = (data) => {
        window.$("#list_vendor_add_dialog").modal("hide");
        this.setState({
            addVendorDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                vendors: []
            }
        }, () => {
            if (data) {
                this.getVendorListFrom(0)
            }
        })
    }

    handleDelete = (index) => {
        this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
            this.setState({ isLoading: true })

            let result = await httpClient(`vendor/${this.state.vendorsList[index]._id}`, "DELETE");

            if (result.success) {
                this.showToast("Vendor deleted successfully", "success");
                let vendorsList = [...this.state.vendorsList];
                vendorsList.splice(index, 1);
                this.setState({
                    vendorsList: vendorsList,
                    isLoading: false
                })
            } else {
                this.setState({ isLoading: false })
                this.showToast("Error while getting deleting vendor", "error")
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
        }), this.getVendorsList)
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
                        onClick={() => this.handleOpenVendorDialog(true)}
                    >
                        <span className="btn-inner--icon">
                            <Icon
                                path={mdiPlus}
                                title="Add"
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
                                <th scope="col">Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.vendorsList.map((vendor, index) => (
                                <tr key={index}>
                                    <td>
                                        <span >
                                            {vendor.DisplayName}
                                        </span>
                                    </td>
                                    <td>{vendor.Active ? "Active" : "Not Active"}</td>
                                    <td>
                                        <button type="button" onClick={() => this.handleOpenVendorDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                        <button type="button" onClick={() => this.handleDelete(index)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {this.state.vendorsList.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center">No Vendors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getVendorListFrom(this.state.search.from - this.state.search.size)} disabled={this.state.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getVendorListFrom(this.state.search.from + this.state.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div>
                {this.state.addVendorDialog.isOpen && (
                    <AddVendorModal expenses={this.state.addVendorDialog.vendors} data={this.state.addVendorDialog.data} showToast={this.showToast} handleCloseDialog={this.handleCloseDialog} />
                )}
            </React.Fragment>
        );
    }
}

export default withConfirmDialogContext(VendorsMain);
