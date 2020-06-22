import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
    profile: {
        user: { _id, name, avatar },
        status,
        company,
        location,
        skills,
    },
}) => {
    return (
        <div className="profile bg-white">
            <div>
                <img
                    className="round-img"
                    src={avatar}
                    alt={`${name}'s avatar`}
                />
                <div>
                    <h2>{name}</h2>
                    <p className="status-txt">
                        {status} {company && <span>at {company}</span>}
                    </p>
                    <p className="location-txt">{location}</p>
                </div>
            </div>

            <h3 className="text-primary mt">Skill Set</h3>

            <ul className="skills">
                {skills.slice(0, 4).map((skill, i) => (
                    <li key={i} className="text-primary">
                        <i className="fas fa-check"></i> {skill}
                    </li>
                ))}
            </ul>

            {skills.length > 4 && (
                <p className="more-txt text-primary">and more...</p>
            )}

            <div className="line"></div>

            <Link to={`/profile/${_id}`} className="btn btn-primary">
                View Profile
            </Link>
        </div>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileItem;
