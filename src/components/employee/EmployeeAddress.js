import React, { Component } from 'react';
import TextField from '../../shared/inputs/TextField';
import { Formik } from "formik";
class EmployeeAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {
                home: {
                    address: "",
                    city: "",
                    state: "",
                    country: ""
                },
                office: {
                    address: "",
                    city: "",
                    state: "",
                    country: ""
                }
            }
        }
    }
    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={this.state.address}
                    validate={values => {
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={async values => {
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        resetForm
                        /* and other goodies */
                    }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="Home Address"
                                                    type="text"
                                                    placeholder="Home Address"
                                                    name="home.address"
                                                    value={values.home.address}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.home && errors.home.address && touched.home && touched.home.address ? true : false}
                                                    error={errors.home && errors.home.address ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="City"
                                                    type="text"
                                                    placeholder="City"
                                                    name="home.city"
                                                    value={values.home.city}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.home && errors.home.city && touched.home && touched.home.city ? true : false}
                                                    error={errors.home && errors.home.city ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="State"
                                                    type="text"
                                                    placeholder="State"
                                                    name="home.state"
                                                    value={values.home.state}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.home && errors.home.state && touched.home && touched.home.state ? true : false}
                                                    error={errors.home && errors.home.state ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="Country"
                                                    type="text"
                                                    placeholder="Country"
                                                    name="home.country"
                                                    value={values.home.country}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.home && errors.home.country && touched.home && touched.home.country ? true : false}
                                                    error={errors.home && errors.home.country ? true : false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">



                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="Office Address"
                                                    type="text"
                                                    placeholder="Office Address"
                                                    name="office.address"
                                                    value={values.office.address}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.office && errors.office.address && touched.office && touched.office.address ? true : false}
                                                    error={errors.office && errors.office.address ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="City"
                                                    type="text"
                                                    placeholder="City"
                                                    name="office.city"
                                                    value={values.office.city}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.office && errors.office.city && touched.office && touched.office.city ? true : false}
                                                    error={errors.office && errors.office.city ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="State"
                                                    type="text"
                                                    placeholder="State"
                                                    name="office.state"
                                                    value={values.office.state}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.office && errors.office.state && touched.office && touched.office.state ? true : false}
                                                    error={errors.office && errors.office.state ? true : false}
                                                />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <TextField label="Country"
                                                    type="text"
                                                    placeholder="Country"
                                                    name="office.country"
                                                    value={values.office.country}
                                                    onChange={(event) => {
                                                        setFieldValue("Name", event.target.value)
                                                    }}
                                                    showError={errors.office && errors.office.country && touched.office && touched.office.country ? true : false}
                                                    error={errors.office && errors.office.country ? true : false}
                                                />
                                            </div>
                                        </div>









                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="d-flex justify-content-end">

                                            <button
                                                type="button"
                                                className="btn btn-link "
                                                onClick={() => this.props.handleCloseDialog()}
                                            >
                                                Close
                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save
                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                </Formik>
            </React.Fragment>
        );
    }
}

export default EmployeeAddress;