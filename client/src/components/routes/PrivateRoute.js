import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// private route
// restricts access to a private component if not authenticated
// redirects to the login page
// destructuring the props
const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                !auth.isAuthenticated && !auth.loading ? (
                    <Redirect to="/login" />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
