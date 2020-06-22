import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

const Register = (props) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    const { name, email, password, password2 } = formData;

    // for email -> {prevData, email: value}
    // for password -> {prevData, password: value}
    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value });

    const onSubmit = async (event) => {
        event.preventDefault();

        if (password !== password2)
            props.setAlert("passwords dont match", "danger");
        else {
            props.register({ name, email, password });
        }
    };

    if (props.isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user"></i> &nbsp;Create Your Account
            </p>
            <form className="form" onSubmit={(event) => onSubmit(event)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={(event) => onChange(event)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(event) => onChange(event)}
                        required
                    />
                    <small className="form-text">
                        * For profile image, use a{" "}
                        <a
                            href="https://en.gravatar.com/site/login"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Gravatar
                        </a>{" "}
                        email or create a{" "}
                        <a
                            href="https://en.gravatar.com/site/login"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Gravatar
                        </a>{" "}
                        account if you don't have one, then sign up here with
                        that email.
                        <br />
                        You can also edit profile image after registration
                    </small>
                </div>
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
                    value="Register"
                />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
