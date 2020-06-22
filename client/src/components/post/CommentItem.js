import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

import { deleteComment } from "../../actions/post";

const CommentItem = ({
    auth,
    postId,
    comment: { _id, name, avatar, text, user, date },
    deleteComment,
}) => {
    return (
        <div className={`post bg-white p-custom-2 my-1`}>
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt={`${name}'s avatar`}
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="post-text my-1">{text}</p>
                <p className="post-date">
                    Posted on{" "}
                    {<Moment format="YYYY/MM/DD">{moment.utc(date)}</Moment>}
                </p>
                {!auth.loading && user === auth.user._id && (
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) => deleteComment(postId, _id)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

CommentItem.propTypes = {
    auth: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
