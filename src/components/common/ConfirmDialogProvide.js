import React, { Component } from "react";

const ConfirmDialogContext = React.createContext();
export class ConfirmDialogProvider extends Component {
    state = {
        open: false,
        options: {},
        yesText: "",
        isHideCancel: false,
        show: (heading, body, successHandler, yesText, isHideCancel) => {
            this.setState({ open: !this.state.open, heading, body, successHandler, yesText, isHideCancel }, () => {
                window.$("#confirm_dialog").modal("show");
            });
        }
    };
    handleCloseDialog = () => {
        this.setState({ open: false }, () => {
            window.$("#confirm_dialog").modal("hide");
        });
    }
    render() {
        return (
            <ConfirmDialogContext.Provider
                value={{
                    ...this.state
                }}
            >
                <>

                    <div
                        className="modal fade"
                        id="confirm_dialog"
                        data-backdrop="static"
                        data-keyboard="false"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="modal-form"
                        aria-hidden="true"
                    >
                        <div
                            className="modal-dialog modal- modal-dialog-centered modal-md"
                            role="document"
                        >
                            <div className="modal-content">
                                <div className="modal-body p-0">
                                    <div className="card bg-secondary shadow">
                                        <div className="card-header bg-white border-0">
                                            <div className="row align-items-center">
                                                <div className="col-8">
                                                    <h3 className="mb-0">{this.state.heading}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body text-left">
                                            {this.state.body}
                                        </div>
                                        <div className="modal-footer">
                                            {!this.state.isHideCancel && (

                                                <button
                                                    type="button"
                                                    className="btn btn-link  ml-auto"
                                                    onClick={this.handleCloseDialog}
                                                >
                                                    Cancel
                            </button>
                                            )}
                                            <button onClick={() => {
                                                this.state.successHandler();
                                                this.handleCloseDialog()
                                            }} className="btn btn-primary">
                                                {this.state.yesText || "Yes"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.props.children}
                </>
            </ConfirmDialogContext.Provider>
        );
    }
}
export const withConfirmDialogContext = ChildComponent => props => (
    <ConfirmDialogContext.Consumer>
        {context => <ChildComponent {...props} confirmDialog={context} />}
    </ConfirmDialogContext.Consumer>
);
