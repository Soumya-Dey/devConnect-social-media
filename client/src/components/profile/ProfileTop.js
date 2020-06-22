import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
    addFollowerFollowing,
    removeFollowerFollowing,
} from "../../actions/profile";

const ProfileTop = ({
    auth,
    profile: {
        status,
        company,
        location,
        website,
        social,
        followers,
        following,
        user: { _id, name, avatar },
    },
    addFollowerFollowing,
    removeFollowerFollowing,
}) => {
    const [btnClass, setBtnClass] = useState("btn btn-outline mb");

    useEffect(() => {
        followers.filter(
            (follower) => follower.user.toString() === auth.user._id.toString()
        ).length > 0
            ? setBtnClass("btn btn-filled mb")
            : setBtnClass("btn btn-outline mb");
    }, [followers, auth.user._id]);

    return (
        <div className="profile-top bg-primary p-3">
            <div className="mr-6">
                <img
                    className="round-img mb"
                    src={avatar}
                    alt={`${name}'s avatar`}
                />
                <h1 className="medium">{name}</h1>
            </div>

            <div className="right-div">
                <p className="mb">{location && <span>{location}</span>}</p>
                <div className="follow-div mb">
                    <p className="mr">
                        <span className="small">{followers.length}</span>{" "}
                        &nbsp;followers
                    </p>
                    <p>
                        <span className="small">{following.length}</span>{" "}
                        &nbsp;following
                    </p>
                </div>
                <p className="lead">
                    {status} {company && <span>at {company}</span>}
                </p>

                {auth.user._id !== _id && (
                    <button
                        className={btnClass}
                        onClick={() => {
                            // if the user hasn't followed
                            // then addFollowerFollowing
                            // otherwise removeFollowerFollowing
                            followers.filter(
                                (follower) =>
                                    follower.user.toString() ===
                                    auth.user._id.toString()
                            ).length > 0
                                ? removeFollowerFollowing(_id)
                                : addFollowerFollowing(_id);
                        }}
                    >
                        {followers.filter(
                            (follower) =>
                                follower.user.toString() ===
                                auth.user._id.toString()
                        ).length > 0 ? (
                            <Fragment>
                                <i className="fas fa-user-check"></i>&nbsp;
                                Following
                            </Fragment>
                        ) : (
                            <Fragment>
                                <i className="fas fa-user-plus"></i>&nbsp;
                                Follow
                            </Fragment>
                        )}
                    </button>
                )}
                <div className="icons mt">
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fas fa-globe fa-2x" />
                        </a>
                    )}
                    {social && social.twitter && (
                        <a
                            href={social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-twitter fa-2x" />
                        </a>
                    )}
                    {social && social.facebook && (
                        <a
                            href={social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-facebook fa-2x" />
                        </a>
                    )}
                    {social && social.linkedin && (
                        <a
                            href={social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-linkedin fa-2x" />
                        </a>
                    )}
                    {social && social.youtube && (
                        <a
                            href={social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-youtube fa-2x" />
                        </a>
                    )}
                    {social && social.instagram && (
                        <a
                            href={social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-instagram fa-2x" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired,
    addFollowerFollowing: PropTypes.func.isRequired,
    removeFollowerFollowing: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {
    addFollowerFollowing,
    removeFollowerFollowing,
})(ProfileTop);
