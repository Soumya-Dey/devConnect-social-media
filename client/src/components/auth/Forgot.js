import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { forgotPassword } from "../../actions/auth";

const Forgot = ({ forgotPassword }) => {
    const [email, setEmail] = useState("");

    const onChange = (event) => setEmail(event.target.value);

    const onSubmit = async (event) => {
        event.preventDefault();

        forgotPassword(email);
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Forgotten Password</h1>
            <p className="lead">
                <i className="fas fa-user"></i> &nbsp;Enter your registered
                email
            </p>
            <form className="form" onSubmit={(event) => onSubmit(event)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(event) => onChange(event)}
                        required
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Confirm"
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

Forgot.propTypes = {
    forgotPassword: PropTypes.func.isRequired,
};

export default connect(null, { forgotPassword })(Forgot);
