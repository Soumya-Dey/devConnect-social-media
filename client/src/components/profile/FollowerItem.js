import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import { connect } from "react-redux";

import {
    addFollowerFollowing,
    removeFollowerFollowing,
} from "../../actions/profile";

const FollowerItem = ({
    follower: { date, name, avatar, user },
    addFollowerFollowing,
    removeFollowerFollowing,
}) => {
    const [btnClass, setBtnClass] = useState("btn btn-filled");

    return (
        <div className="follower-item">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img mr"
                        src={avatar}
                        alt={`${name}'s avatar`}
                    />
                </Link>
                <div>
                    <p className="x-small">{name}</p>
                    <Moment format="YYYY/MM/DD">{moment.utc(date)}</Moment>
                </div>
            </div>

            {/* {auth.user._id !== _id && ( */}
            <button
                className={btnClass}
                // onClick={() => {
                //     // if the user hasn't followed
                //     // then addFollowerFollowing
                //     // otherwise removeFollowerFollowing
                //     followers.filter(
                //         (follower) =>
                //             follower.user.toString() ===
                //             auth.user._id.toString()
                //     ).length > 0
                //         ? removeFollowerFollowing(_id)
                //         : addFollowerFollowing(_id);
                // }}
            >
                {/* {followers.filter(
                        (follower) =>
                            follower.user.toString() ===
                            auth.user._id.toString()
                    ).length > 0 ? (
                        <Fragment>
                            <i className="fas fa-user-check"></i>&nbsp;
                            Following
                        </Fragment>
                    ) : ( */}
                <Fragment>
                    <i className="fas fa-user-plus"></i>&nbsp; Follow
                </Fragment>
                {/* )} */}
            </button>
            {/* )} */}
        </div>
    );
};

FollowerItem.propTypes = {
    follower: PropTypes.object.isRequired,
    addFollowerFollowing: PropTypes.func.isRequired,
    removeFollowerFollowing: PropTypes.func.isRequired,
};

export default connect(null, { addFollowerFollowing, removeFollowerFollowing })(
    FollowerItem
);
