import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setAlert } from "../../actions/alert";
import { resetPassword } from "../../actions/auth";

const Reset = ({ resetPassword, setAlert, match }) => {
    const [formData, setFormData] = useState({
        password: "",
        password2: "",
    });

    const { password, password2 } = formData;

    // for email -> {prevData, email: value}
    // for password -> {prevData, password: value}
    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value });

    const onSubmit = async (event) => {
        event.preventDefault();

        if (password !== password2) setAlert("Passwords dont match", "danger");
        else {
            resetPassword(password, match.params.resetPasswordId);
        }
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Reset Password</h1>
            <p className="lead">
                <i className="fas fa-user"></i> &nbsp;Create New Password
            </p>
            <form className="form" onSubmit={(event) => onSubmit(event)}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(event) => onChange(event)}
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={(event) => onChange(event)}
                        minLength="6"
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Reset"
                />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <p className="my-1">
                <Link to="/login">Login</Link> instead
            </p>
        </Fragment>
    );
};

Reset.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, resetPassword })(Reset);
