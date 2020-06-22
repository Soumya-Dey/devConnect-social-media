import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Spinner from "../layouts/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import ProfilePosts from "./ProfilePosts";
import { getProfileById } from "../../actions/profile";

const Profile = ({
    getProfileById,
    profile: { profile, loading },
    auth,
    match,
}) => {
    useEffect(() => {
        getProfileById(match.params.userId);
    }, [getProfileById, match.params.userId]);

    return (
        <Fragment>
            {profile === null || loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    <Link to="/profiles" className="btn btn-light mr">
                        Back To Profiles
                    </Link>
                    {auth.isAuthenticated &&
                        !auth.loading &&
                        auth.user._id === profile.user._id && (
                            <Link to="/create-profile" className="btn btn-dark">
                                Edit Profile
                            </Link>
                        )}

                    <div className="profile-grid my-1">
                        {/* TOP */}
                        <ProfileTop profile={profile} />

                        {/* ABOUT */}
                        <ProfileAbout profile={profile} />

                        {/* EXPERIENCE */}
                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.experience.length > 0 ? (
                                <Fragment>
                                    {profile.experience.map((exp) => (
                                        <ProfileExperience
                                            key={exp._id}
                                            experience={exp}
                                        />
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No experience credentials added</h4>
                            )}
                        </div>

                        {/* EDUCATION */}
                        <div className="profile-edu bg-white p-2">
                            <h2 className="text-primary">Education</h2>
                            {profile.education.length > 0 ? (
                                <Fragment>
                                    {profile.education.map((edu) => (
                                        <ProfileEducation
                                            key={edu._id}
                                            education={edu}
                                        />
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No education credentials added</h4>
                            )}
                        </div>

                        {/* GITHUB */}
                        {profile.githubusername && (
                            <ProfileGithub
                                githubUsername={profile.githubusername}
                            />
                        )}

                        <ProfilePosts profile={profile} />
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
