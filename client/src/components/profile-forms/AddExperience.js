import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience, history }) => {
    const [formData, setFormData] = useState({
        company: "",
        title: "",
        location: "",
        from: "",
        to: "",
        current: false,
        description: "",
    });

    const {
        company,
        title,
        location,
        from,
        to,
        current,
        description,
    } = formData;

    // for email -> {prevData, email: value}
    // for password -> {prevData, password: value}
    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value });

    const onSubmit = (event) => {
        event.preventDefault();

        addExperience(formData, history);
    };

    return (
        <Fragment>
            <Link className="btn btn-light mb" to="/dashboard">
                Go Back
            </Link>
            <h1 className="large text-primary">Add Experience</h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any
                developer/programming positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Job Title"
                        name="title"
                        value={title}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Company"
                        name="company"
                        value={company}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
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
                            onChange={() => {
                                setFormData({ ...formData, current: !current });
                            }}
                        />{" "}
                        &nbsp;Current Job
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
                        placeholder="Job Description"
                        value={description}
                        onChange={(e) => onChange(e)}
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
            </form>
        </Fragment>
    );
};

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addExperience })(withRouter(AddExperience));
