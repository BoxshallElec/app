import React, { Component } from 'react';
class CustomerBilling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            billRates: [{
                date: "01/12/2020",
                rate: 12
            }],
        }
    }
    handleOpenBillRateDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#bill_rate_dialog").modal("hide");
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
                window.$("#bill_rate_dialog").modal("show");
            }
        })
    }

    handleCloseBillRateDialog = (data) => {
        console.log("cost rate data ", data)
        window.$("#bill_rate_dialog").modal("hide");
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
    render() {
        return (
            <React.Fragment>
                <section className="container-fluid">
                    <div className="row">
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
                                            {/* <th scope="col">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.billRates.map((costRate, index) => (
                                            <tr key={`costRate${index}`}>
                                                <td>{costRate.date}</td>
                                                <td>{costRate.rate}</td>
                                                {/* <td>
                                                    <button type="button" onClick={() => this.handleOpenCostRateDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                                    <button type="button" onClick={() => this.handleDeleteCostRate(index)} className="btn btn-sm btn-danger">Delete</button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default CustomerBilling;