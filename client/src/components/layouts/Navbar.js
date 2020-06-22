import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../actions/auth";

const Navbar = (props) => {
    // links to show when user is not logged in
    const guestLinks = (
        <ul>
            <li>
                <Link to="/profiles">Developers</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
        </ul>
    );

    // links to show when user is loggin in
    const authLinks = (
        <ul>
            <li>
                <Link to="/posts">Posts Feed</Link>
            </li>
            <li>
                <Link to="/profiles">Developers</Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user"></i> &nbsp;
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <a onClick={props.logout} href="/login">
                    <i className="fas fa-sign-out-alt"></i> &nbsp;
                    <span className="hide-sm">Logout</span>
                </a>
            </li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/" className="nav-h1">
                    Dev <i className="fas fa-code"></i> Connect
                </Link>
            </h1>
            {!props.auth.loading && (
                <Fragment>
                    {props.auth.isAuthenticated ? authLinks : guestLinks}
                </Fragment>
            )}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
