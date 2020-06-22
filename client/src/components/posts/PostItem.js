import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
    auth,
    post: { _id, user, name, avatar, text, date, likes, comments },
    addLike,
    removeLike,
    deletePost,
    margin,
    showAction,
}) => {
    const [likeStyle, setLikeStyle] = useState({
        backgroundColor: "#f5f5f5",
        color: "#333",
        border: "#ccc solid 1px",
    });

    const [CountStyle, setCountStyle] = useState({
        color: "#333",
        border: "#ccc solid 1px",
    });

    useEffect(() => {
        // if user likes the post then change the color of the btn
        if (
            likes.filter(
                (like) => like.user.toString() === auth.user._id.toString()
            ).length > 0
        ) {
            setLikeStyle({
                backgroundColor: "#17a2b8",
                color: "#fff",
                border: "none",
            });
            setCountStyle({
                color: "#17a2b8",
                border: "#17a2b8 solid 1px",
            });
        } else {
            setLikeStyle({
                backgroundColor: "#f5f5f5",
                color: "#333",
                border: "#ccc solid 1px",
            });
            setCountStyle({
                color: "#333",
                border: "#ccc solid 1px",
            });
        }
    }, [likes, auth.user._id]);

    return (
        <div className={`post bg-white p-custom-2 my-${margin}`}>
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
                <p className="post-text">{text}</p>
                <p className="post-date my">
                    Posted on{" "}
                    {<Moment format="YYYY/MM/DD">{moment.utc(date)}</Moment>}
                </p>

                {showAction && (
                    <Fragment>
                        <button
                            type="button"
                            style={likeStyle}
                            className="btn btn-light mr"
                            onClick={(e) =>
                                // if the user hasn't liked the post
                                // then add a like to the post
                                // otherwise remove the post
                                likes.filter(
                                    (like) =>
                                        like.user.toString() ===
                                        auth.user._id.toString()
                                ).length > 0
                                    ? removeLike(_id)
                                    : addLike(_id)
                            }
                        >
                            <i className="fas fa-thumbs-up"></i>
                            {likes.length > 0 && (
                                <span
                                    className="likes-count"
                                    style={CountStyle}
                                >
                                    {likes.length}
                                </span>
                            )}
                        </button>
                        {/* <button
                type="button"
                className="btn btn-light mr"
                onClick={(e) => removeLike(_id)}
            >
                <i className="fas fa-thumbs-down"></i>
            </button> */}

                        <Link
                            to={`/posts/${_id}`}
                            className="btn btn-primary mr"
                        >
                            Discussion
                            {comments.length > 0 && (
                                <span className="comment-count">
                                    {comments.length}
                                </span>
                            )}
                        </Link>
                        {!auth.loading && user === auth.user._id && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={(e) => deletePost(_id)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
};

PostItem.defaultProps = {
    showAction: true,
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    margin: PropTypes.number,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {
    addLike,
    removeLike,
    deletePost,
})(PostItem);
