import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Spinner from "../layouts/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { getPost } from "../../actions/post";

const Post = ({ getPost, post: { post, loading }, match }) => {
    useEffect(() => {
        getPost(match.params.postId);
    }, [getPost, match.params.postId]);

    return loading || post === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Link to="/posts" className="btn btn-light">
                Back To Posts
            </Link>
            <PostItem post={post} margin={1} showAction={false} />

            <CommentForm postId={post._id} />

            <div className="comments">
                {post.comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        postId={post._id}
                        comment={comment}
                    />
                ))}
            </div>
        </Fragment>
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
