import React, { Component } from 'react';
import { Formik } from 'formik';
import TextField from '../../shared/inputs/TextField';
class EditCustomerGeneralDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleCloseDialog = data => {
        this.props.handleCloseDialog(data);
    };
    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={this.state.initialValues}
                    validate={values => {
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={async values => {
                        this.setState({ isLoading: true });
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
                                <div className="pl-lg-4">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <div className='row'>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Project"
                                                        type="text"
                                                        placeholder="Project"
                                                        name="project"
                                                        value={values.project}
                                                        onChange={(event) => {
                                                            setFieldValue("project", event.target.value)
                                                        }}
                                                        showError={errors.project && touched.project ? true : false}
                                                        error={errors.project}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Sub Project of"
                                                        type="text"
                                                        placeholder="Sub Project of"
                                                        name="subProjectOf"
                                                        value={values.subProjectOf}
                                                        onChange={(event) => {
                                                            setFieldValue("subProjectOf", event.target.value)
                                                        }}
                                                        showError={errors.subProjectOf && touched.subProjectOf ? true : false}
                                                        error={errors.subProjectOf}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Project Code"
                                                        type="text"
                                                        placeholder="Project Code"
                                                        name="projectCode"
                                                        value={values.projectCode}
                                                        onChange={(event) => {
                                                            setFieldValue("projectCode", event.target.value)
                                                        }}
                                                        showError={errors.projectCode && touched.projectCode ? true : false}
                                                        error={errors.projectCode}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Approver"
                                                        type="text"
                                                        placeholder="Approver"
                                                        name="approver"
                                                        value={values.approver}
                                                        onChange={(event) => {
                                                            setFieldValue("approver", event.target.value)
                                                        }}
                                                        showError={errors.approver && touched.approver ? true : false}
                                                        error={errors.approver}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Class"
                                                        type="text"
                                                        placeholder="Class"
                                                        name="class"
                                                        value={values.class}
                                                        onChange={(event) => {
                                                            setFieldValue("class", event.target.value)
                                                        }}
                                                        showError={errors.class && touched.class ? true : false}
                                                        error={errors.class}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Phone"
                                                        type="text"
                                                        placeholder="Phone"
                                                        name="phone"
                                                        value={values.phone}
                                                        onChange={(event) => {
                                                            setFieldValue("phone", event.target.value)
                                                        }}
                                                        showError={errors.phone && touched.phone ? true : false}
                                                        error={errors.phone}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Fax"
                                                        type="text"
                                                        placeholder="Fax"
                                                        name="fax"
                                                        value={values.fax}
                                                        onChange={(event) => {
                                                            setFieldValue("fax", event.target.value)
                                                        }}
                                                        showError={errors.fax && touched.fax ? true : false}
                                                        error={errors.fax}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="description"
                                                        type="text"
                                                        placeholder="description"
                                                        name="description"
                                                        value={values.description}
                                                        onChange={(event) => {
                                                            setFieldValue("description", event.target.value)
                                                        }}
                                                        showError={errors.description && touched.description ? true : false}
                                                        error={errors.description}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Address"
                                                        type="text"
                                                        placeholder="Address"
                                                        name="address"
                                                        value={values.address}
                                                        onChange={(event) => {
                                                            setFieldValue("address", event.target.value)
                                                        }}
                                                        showError={errors.address && touched.address ? true : false}
                                                        error={errors.address}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="City"
                                                        type="text"
                                                        placeholder="City"
                                                        name="city"
                                                        value={values.city}
                                                        onChange={(event) => {
                                                            setFieldValue("city", event.target.value)
                                                        }}
                                                        showError={errors.city && touched.city ? true : false}
                                                        error={errors.city}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="State"
                                                        type="text"
                                                        placeholder="State"
                                                        name="state"
                                                        value={values.state}
                                                        onChange={(event) => {
                                                            setFieldValue("state", event.target.value)
                                                        }}
                                                        showError={errors.state && touched.state ? true : false}
                                                        error={errors.state}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="ZipCode"
                                                        type="text"
                                                        placeholder="ZipCode"
                                                        name="zipCode"
                                                        value={values.zipCode}
                                                        onChange={(event) => {
                                                            setFieldValue("zipCode", event.target.value)
                                                        }}
                                                        showError={errors.zipCode && touched.zipCode ? true : false}
                                                        error={errors.zipCode}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Country"
                                                        type="text"
                                                        placeholder="Country"
                                                        name="country"
                                                        value={values.country}
                                                        onChange={(event) => {
                                                            setFieldValue("country", event.target.value)
                                                        }}
                                                        showError={errors.country && touched.country ? true : false}
                                                        error={errors.country}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="form-group mt-4 h-52px">
                                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                                            <input
                                                                className="custom-control-input"
                                                                id=" customStatus"
                                                                type="checkbox"
                                                                value={values.Status}
                                                                checked={values.Status ? true : false}
                                                                onChange={() => {
                                                                    setFieldValue("Status", !values.Status)
                                                                }}
                                                            />
                                                            <label
                                                                className="custom-control-label"
                                                                htmlFor=" customStatus"
                                                            >
                                                                <span>Status?</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Manager"
                                                        type="text"
                                                        placeholder="Manager"
                                                        name="manager"
                                                        value={values.manager}
                                                        onChange={(event) => {
                                                            setFieldValue("manager", event.target.value)
                                                        }}
                                                        showError={errors.manager && touched.manager ? true : false}
                                                        error={errors.manager}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Sales Rep"
                                                        type="text"
                                                        placeholder="Sales Rep"
                                                        name="salesRep"
                                                        value={values.salesRep}
                                                        onChange={(event) => {
                                                            setFieldValue("salesRep", event.target.value)
                                                        }}
                                                        showError={errors.salesRep && touched.salesRep ? true : false}
                                                        error={errors.salesRep}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Email"
                                                        type="text"
                                                        placeholder="Email"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={(event) => {
                                                            setFieldValue("email", event.target.value)
                                                        }}
                                                        showError={errors.email && touched.email ? true : false}
                                                        error={errors.email}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Group"
                                                        type="text"
                                                        placeholder="Group"
                                                        name="group"
                                                        value={values.group}
                                                        onChange={(event) => {
                                                            setFieldValue("group", event.target.value)
                                                        }}
                                                        showError={errors.group && touched.group ? true : false}
                                                        error={errors.group}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="Begin Date"
                                                        type="date"
                                                        placeholder="Begin Date"
                                                        name="beginDate"
                                                        value={values.beginDate}
                                                        onChange={(event) => {
                                                            setFieldValue("beginDate", event.target.value)
                                                        }}
                                                        showError={errors.beginDate && touched.beginDate ? true : false}
                                                        error={errors.beginDate}
                                                    />
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <TextField label="End Date"
                                                        type="date"
                                                        placeholder="End Date"
                                                        name="endDate"
                                                        value={values.endDate}
                                                        onChange={(event) => {
                                                            setFieldValue("endDate", event.target.value)
                                                        }}
                                                        showError={errors.endDate && touched.endDate ? true : false}
                                                        error={errors.endDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-link "
                                                    onClick={() => this.handleCloseDialog()}
                                                >
                                                    Close
                                                            </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Save
                                                            </button>
                                            </div>
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

export default EditCustomerGeneralDetails;