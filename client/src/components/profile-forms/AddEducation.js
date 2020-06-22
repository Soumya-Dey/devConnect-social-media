import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation, history }) => {
    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldofstudy: "",
        from: "",
        to: "",
        current: false,
        description: "",
    });

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description,
        current,
    } = formData;

    // for email -> {prevData, email: value}
    // for password -> {prevData, password: value}
    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value });

    const onSubmit = (event) => {
        event.preventDefault();

        addEducation(formData, history);
    };

    return (
        <Fragment>
            <Link className="btn btn-light mb" to="/dashboard">
                Go Back
            </Link>
            <h1 className="large text-primary">Add Education</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any school or bootcamp
                that you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* School or Bootcamp"
                        name="school"
                        value={school}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Degree or Certificate"
                        name="degree"
                        value={degree}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Field of Study"
                        name="fieldofstudy"
                        value={fieldofstudy}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input
                        type="date"
                        name="from"
                        value={from}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            checked={current}
                            value={current}
                            onChange={() =>
                                setFormData({
                                    ...formData,
                                    current: !current,
                                })
                            }
                        />{" "}
                        &nbsp;Current School
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input
                        type="date"
                        name="to"
                        value={to}
                        onChange={(e) => onChange(e)}
                        disabled={current}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Program Description"
                        value={description}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary my-1" />
            </form>
        </Fragment>
    );
};

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
