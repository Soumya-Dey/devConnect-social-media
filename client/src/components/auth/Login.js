import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { login } from "../../actions/auth";

const Login = (props) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    // for email -> {prevData, email: value}
    // for password -> {prevData, password: value}
    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value });

    const onSubmit = async (event) => {
        event.preventDefault();

        props.login({ email, password });
    };

    if (props.isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">
                <i className="fas fa-user"></i> &nbsp;Sign into Your Account
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(event) => onChange(event)}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
