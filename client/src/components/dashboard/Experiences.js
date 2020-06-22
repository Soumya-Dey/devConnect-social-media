import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";

import { deleteExperience } from "../../actions/profile";

const Experiences = ({ experiences, deleteExperience }) => {
    const experiencesDOM = experiences.map((exp) => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
                <Moment format="YYYY/MM/DD">{moment.utc(exp.from)}</Moment> -{" "}
                {exp.to === null ? (
                    "Now"
                ) : (
                    <Moment format="YYYY/MM/DD">{moment.utc(exp.to)}</Moment>
                )}
            </td>
            <td>
                <button
                    className="btn btn-danger btn-round"
                    onClick={() => {
                        deleteExperience(exp._id);
                        window.scrollTo(0, 0);
                    }}
                >
                    <i className="fas fa-times"></i>
                </button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table bg-white">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{experiencesDOM}</tbody>
            </table>
        </Fragment>
    );
};

Experiences.propTypes = {
    experiences: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experiences);
