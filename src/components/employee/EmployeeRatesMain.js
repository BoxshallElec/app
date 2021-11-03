import React, { Component } from 'react';
import { httpClient } from '../../UtilService';
import AddBillRateDialog from './AddBillRateDialog';
import AddCostRateDialog from './AddCostRateDialog';
class EmployeeRatesMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            costRates: [{
                date: "01/12/2020",
                rate: 12
            }],
            billRates: [{
                date: "02/1/2020",
                rate: 10
            }],
            costRateDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
            },
            billRateDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
            }
        }
    }
    componentDidMount() {
        this.getCostRates();
        this.getBillRates();
    }

    getCostRates = () => {

    }

    getBillRates = () => {

    }


    handleOpenCostRateDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#cost_rate_dialog").modal("hide");
        }
        let costRates = [...this.state.costRates];
        if (editIndex !== undefined) {
            costRates.splice(editIndex, 1);
        }
        this.setState({
            costRateDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.costRates[editIndex] } : undefined,
                editIndex: editIndex,
                costRates
            }
        }, () => {
            if (isOpen) {
                window.$("#cost_rate_dialog").modal("show");
            }
        })
    }

    handleCloseCostRateDialog = (data) => {
        console.log("cost rate data ", data)
        window.$("#cost_rate_dialog").modal("hide");
        this.setState({
            costRateDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
            }
        }, () => {
            if (data) {
                this.getCostRates(0)
            }
        })
    }

    handleDeleteCostRate = (index) => {
        this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
            this.setState({ isLoading: true })
            let result = await httpClient(`cost-rates/${this.state.costRates[index]._id}`, "DELETE");
            if (result.success) {
                this.showToast("Cost rate deleted successfully", "success");
                let costRates = [...this.state.costRates];
                costRates.splice(index, 1);
                this.setState({
                    costRates: costRates,
                    isLoading: false
                })
            } else {
                this.setState({ isLoading: false })
                this.showToast("Error while getting deleting cost rate", "error")
            }
        })
    }




    handleOpenBillRateDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#bill_rate_dialog").modal("hide");
        }
        let billRates = [...this.state.billRates];
        if (editIndex !== undefined) {
            billRates.splice(editIndex, 1);
        }
        this.setState({
            billRateDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.billRates[editIndex] } : undefined,
                editIndex: editIndex,
                billRates
            }
        }, () => {
            if (isOpen) {
                window.$("#bill_rate_dialog").modal("show");
            }
        })
    }

    handleCloseBillRateDialog = (data) => {
        console.log("bill rate data ", data)
        window.$("#bill_rate_dialog").modal("hide");
        this.setState({
            billRateDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
            }
        }, () => {
            if (data) {
                this.getBillRates(0)
            }
        })
    }

    handleDeleteBillRate = (index) => {
        this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
            this.setState({ isLoading: true })
            let result = await httpClient(`bill-rates/${this.state.billRates[index]._id}`, "DELETE");
            if (result.success) {
                this.showToast("bill deleted successfully", "success");
                let billRates = [...this.state.billRates];
                billRates.splice(index, 1);
                this.setState({
                    billRates: billRates,
                    isLoading: false
                })
            } else {
                this.setState({ isLoading: false })
                this.showToast("Error while getting deleting bill rate", "error")
            }
        })
    }





















    render() {
        return (
            <section className="container-fluid">
                <div className="row">
                    <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-between">
                            <h5>Cost Rate/Hr</h5>
                            <button onClick={() => this.handleOpenCostRateDialog(true)} className="btn btn-sm btn-primary">
                                Add
                        </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush mt-2">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Begin Date</th>
                                        <th scope="col">Rate/hr</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.costRates.map((costRate, index) => (
                                        <tr key={`costRate${index}`}>
                                            <td>{costRate.date}</td>
                                            <td>{costRate.rate}</td>
                                            <td>
                                                <button type="button" onClick={() => this.handleOpenCostRateDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                                <button type="button" onClick={() => this.handleDeleteCostRate(index)} className="btn btn-sm btn-danger">Delete</button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>




                    <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-between">
                            <h5>Bill Rate/Hr</h5>
                            <button onClick={() => this.handleOpenBillRateDialog(true)} className="btn btn-sm btn-primary">
                                Add
                        </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush mt-2">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Begin Date</th>
                                        <th scope="col">Rate/hr</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.billRates.map((billRate, index) => (
                                        <tr key={`billRate${index}`}>
                                            <td>{billRate.date}</td>
                                            <td>{billRate.rate}</td>
                                            <td>
                                                <button type="button" onClick={() => this.handleOpenBillRateDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                                <button type="button" onClick={() => this.handleDeleteBillRate(index)} className="btn btn-sm btn-danger">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <br />
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn  text-uppercase mb-4"
                                type="button"
                                onClick={() => this.props.handleCloseDialog()}
                            >
                                Close
                            </button>
                        </div>
                    </div>



                </div>
                {this.state.billRateDialog.isOpen &&
                    <AddBillRateDialog showToast={this.props.showToast} handleCloseDialog={this.handleCloseBillRateDialog} />}

                {this.state.costRateDialog.isOpen && <AddCostRateDialog showToast={this.props.showToast} handleCloseDialog={this.handleCloseCostRateDialog} />}
            </section>
        );
    }
}

export default EmployeeRatesMain;