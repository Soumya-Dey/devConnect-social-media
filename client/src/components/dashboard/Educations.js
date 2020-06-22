import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";

import { deleteEducation } from "../../actions/profile";

const Educations = ({ educations, deleteEducation }) => {
    const educationsDOM = educations.map((edu) => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td>{edu.degree}</td>
            <td className="hide-sm">
                <Moment format="YYYY/MM/DD">{moment.utc(edu.from)}</Moment> -{" "}
                {edu.to === null ? (
                    "Now"
                ) : (
                    <Moment format="YYYY/MM/DD">{moment.utc(edu.to)}</Moment>
                )}
            </td>
            <td>
                <button
                    className="btn btn-danger btn-round"
                    onClick={() => {
                        deleteEducation(edu._id);
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
            <h2 className="my-2">Education Credentials</h2>
            <table className="table bg-white">
                <thead>
                    <tr>
                        <th>School</th>
                        <th>Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educationsDOM}</tbody>
            </table>
        </Fragment>
    );
};

Educations.propTypes = {
    educations: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Educations);
