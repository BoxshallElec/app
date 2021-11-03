import React, { Component } from 'react';
import TextField from '../../shared/inputs/TextField';
class AddCostRateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            rate: ""
        }
    }
    handleChange = (event) => {
        let eve = { ...event };
        this.setState({
            [eve.target.name]: eve.target.value
        })
    }
    handleCloseDialog = (isSave) => {
        let canClose = true;
        let data = undefined;
        if (isSave) {
            if (!this.state.date) {
                canClose = false;
                this.props.showToast("Please select date", "error");
            }
            if (!this.state.rate) {
                canClose = false;
                this.props.showToast("Please add cost rate", "error");
            }
            if (canClose) {
                data = { date: this.state.date, rate: this.state.rate }
            }
        }
        if (canClose) {
            this.props.handleCloseDialog(data)
        }
    }
    render() {
        return (
            <React.Fragment>
                <div
                    className="modal fade"
                    id="cost_rate_dialog"
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
                                                <h3 className="mb-0">Cost Rate</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body text-left">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-12">
                                                    <TextField label="Date"
                                                        type="date"
                                                        placeholder="Date"
                                                        name="date"
                                                        value={this.state.date}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-12">
                                                    <TextField label="Cost Rate/Hr"
                                                        type="number"
                                                        placeholder="Cost Rate/Hr"
                                                        name="rate"
                                                        value={this.state.rate}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            className="btn  text-uppercase mb-4"
                                                            type="button"
                                                            onClick={() => this.handleCloseDialog(false)}
                                                        >
                                                            Cancel
                                                                     </button>
                                                        <button
                                                            className="btn btn-primary text-uppercase mb-4"
                                                            type="button" onClick={() => this.handleCloseDialog(true)}
                                                        >
                                                            Create
                                             </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AddCostRateDialog;