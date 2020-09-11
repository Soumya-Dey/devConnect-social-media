import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getAllPostsByUser } from "../../actions/post";
import PostItem from "../posts/PostItem";
import PostForm from "../posts/PostForm";
import Spinner from "../layouts/Spinner";

const ProfilePosts = ({
    auth,
    profile: { user },
    post: { posts, loading },
    getAllPostsByUser,
}) => {
    useEffect(() => {
        getAllPostsByUser(user._id);
    }, [getAllPostsByUser, user._id]);

    return (
        <div className="profile-posts">
            <h2 className="text-primary my-1">
                <i className="fas fa-rss-square"></i> &nbsp;Posts
            </h2>
            {/* POST FORM */}
            {auth.isAuthenticated &&
                !auth.loading &&
                auth.user._id === user._id && <PostForm />}
            {loading ? (
                <Spinner />
            ) : posts.length > 0 ? (
                <Fragment>
                    {posts.map((post) => (
                        <PostItem key={post._id} post={post} margin={1} />
                    ))}
                </Fragment>
            ) : (
                <h4>No posts found...</h4>
            )}
        </div>
    );
};

ProfilePosts.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getAllPostsByUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    post: state.post,
});

export default connect(mapStateToProps, { getAllPostsByUser })(ProfilePosts);
