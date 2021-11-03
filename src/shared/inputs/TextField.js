import React, { Component } from 'react';
class TextField extends Component {
    state = {}
    render() {
        return (
            <div className="form-group">
                <label
                    className="form-control-label"
                >
                    {this.props.label}
                </label>
                <input
                    className={`form-control form-control-alternative ${this.props.showError ? 'is-invalid' : ''}`}
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                {this.props.showError && (
                    <div>
                        <small className="text-danger">
                            {this.props.error}
                        </small>
                    </div>
                )}
            </div>
        );
    }
}

export default TextField;