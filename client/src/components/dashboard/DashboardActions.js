import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const DashboardActions = ({ auth: { user } }) => {
    return (
        <div className="dash-buttons">
            <Link to={`/profile/${user._id}`} className="btn btn-primary mr">
                <i className="fas fa-user-circle"></i> &nbsp;View Profile
            </Link>
            <Link to="/create-profile" className="btn btn-white mr">
                <i className="fas fa-user-circle text-primary"></i> &nbsp;
                <span className="text-dark">Edit Profile</span>
            </Link>
            <Link to="/add-experience" className="btn btn-white mr">
                <i className="fab fa-black-tie text-primary"></i> &nbsp;
                <span className="text-dark">Add Experience</span>
            </Link>
            <Link to="/add-education" className="btn btn-white mr">
                <i className="fas fa-graduation-cap text-primary"></i> &nbsp;
                <span className="text-dark">Add Education</span>
            </Link>
        </div>
    );
};

DashboardActions.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(DashboardActions);
