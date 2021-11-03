import React, { Component } from 'react';
import Icon from "@mdi/react";
import DatePicker from "react-datepicker";
import { mdiCalendar } from "@mdi/js";
class DateField extends Component {
    state = {}
    render() {
        return (
            <div className="form-group">
                <label
                    className="form-control-label"
                    htmlFor="input-country"
                >
                    {this.props.label}
                </label>
                <div className="input-group input-group-alternative">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <Icon
                                path={mdiCalendar}
                                title="calendar"
                                size={0.9}
                                horizontal
                                vertical
                                rotate={180}
                                color="#5e72e4"
                                className="mr-2"
                            />
                        </span>
                    </div>
                    <DatePicker
                        className="form-control datepicker"
                        selected={this.props.selected}
                        onChange={this.props.onChange}
                    />
                </div>
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

export default DateField;