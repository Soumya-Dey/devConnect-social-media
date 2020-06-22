import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import Spinner from "../layouts/Spinner";
import DashboardActions from "./DashboardActions";
import Experiences from "./Experiences";
import Educations from "./Educations";

const Dashboard = ({ getCurrentProfile, deleteAccount, auth, profile }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return profile.loading && profile.profile === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <h1 className="lead">
                <i className="fas fa-user"></i> &nbsp;Welcome,{" "}
                {auth.user && auth.user.name}
            </h1>
            {profile.profile !== null ? (
                <Fragment>
                    <DashboardActions />
                    <div className="table-container">
                        <div>
                            <Experiences
                                experiences={profile.profile.experience}
                            />
                        </div>
                        <div>
                            <Educations
                                educations={profile.profile.education}
                            />
                        </div>
                    </div>
                </Fragment>
            ) : (
                <Fragment>
                    <p>
                        You haven't yet set up a profile, please add some info
                    </p>
                    <Link
                        to="/create-profile"
                        className="btn btn-primary my-1 mr"
                    >
                        Create Profile
                    </Link>
                </Fragment>
            )}

            <button
                className="btn btn-danger my-2"
                onClick={() => deleteAccount()}
            >
                <i className="fas fa-user-minus" /> &nbsp;Delete Account
            </button>
        </Fragment>
    );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
    Dashboard
);
