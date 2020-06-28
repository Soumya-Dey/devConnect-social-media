import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

const FollowerItem = ({ follower: { date, name, avatar, user } }) => {
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
                    <Link to={`/profile/${user}`}>
                        <p className="x-small">{name}</p>
                    </Link>
                    <Moment format="YYYY/MM/DD">{moment.utc(date)}</Moment>
                </div>
            </div>
        </div>
    );
};

FollowerItem.propTypes = {
    follower: PropTypes.object.isRequired,
};

export default FollowerItem;
