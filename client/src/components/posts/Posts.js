import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../layouts/Spinner";
import PostItem from "./PostItem";
import { getAllPosts } from "../../actions/post";
import PostForm from "./PostForm";

const Posts = ({ getAllPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);

    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user"></i> &nbsp;Welcome to the community!
            </p>

            <PostForm />

            <div className="posts">
                {posts.map((post) => (
                    <PostItem key={post._id} post={post} margin={2} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getAllPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});

export default connect(mapStateToProps, { getAllPosts })(Posts);
