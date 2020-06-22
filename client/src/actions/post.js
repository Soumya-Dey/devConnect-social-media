import axios from "axios";

import { setAlert } from "./alert";
import {
    GET_POSTS,
    POSTS_ERROR,
    UPDATE_LIKES,
    UPDATE_DISLIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    UPDATE_COMMENTS,
} from "../actions/types";

// for getting all posts
export const getAllPosts = () => async (dispatch) => {
    try {
        // get all posts
        const res = await axios.get("/api/posts");

        setTimeout(() => {
            dispatch({
                type: GET_POSTS,
                payload: res.data,
            });
        }, 500);
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for getting all posts by a user
export const getAllPostsByUser = (userId) => async (dispatch) => {
    try {
        // get all posts
        const res = await axios.get(`/api/posts/user/${userId}`);

        setTimeout(() => {
            dispatch({
                type: GET_POSTS,
                payload: res.data,
            });
        }, 500);
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for getting a post by post id
export const getPost = (postId) => async (dispatch) => {
    try {
        // get the post by id
        const res = await axios.get(`/api/posts/${postId}`);

        setTimeout(() => {
            dispatch({
                type: GET_POST,
                payload: res.data,
            });
        }, 500);
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for adding a like to post
export const addLike = (postId) => async (dispatch) => {
    try {
        // add the like
        const res = await axios.put(`/api/posts/like/${postId}`);

        // send the likes array to reducer
        dispatch({
            type: UPDATE_LIKES,
            payload: { postId: postId, likes: res.data },
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for removing a like from post
export const removeLike = (postId) => async (dispatch) => {
    try {
        // remove the like
        const res = await axios.put(`/api/posts/unlike/${postId}`);

        // send the likes array to reducer
        dispatch({
            type: UPDATE_LIKES,
            payload: { postId: postId, likes: res.data },
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for adding a dislike to post
export const addDislike = (postId) => async (dispatch) => {
    try {
        // add the dislike
        const res = await axios.put(`/api/posts/dislike/${postId}`);

        // send the dislikes array to reducer
        dispatch({
            type: UPDATE_DISLIKES,
            payload: { postId: postId, dislikes: res.data },
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for removing a like from post
export const removeDislike = (postId) => async (dispatch) => {
    try {
        // remove the dislike
        const res = await axios.put(`/api/posts/undislike/${postId}`);

        // send the dislikes array to reducer
        dispatch({
            type: UPDATE_DISLIKES,
            payload: { postId: postId, dislikes: res.data },
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for adding a new post
export const addPost = (formData) => async (dispatch) => {
    try {
        // add the post
        const res = await axios.post("/api/posts", formData, {
            headers: { "Content-Type": "application/json" },
        });

        // send the new post to reducer
        dispatch({
            type: ADD_POST,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Post added successfully", "success"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for removing a post
export const deletePost = (postId) => async (dispatch) => {
    if (window.confirm("Are you sure you want to remove your post?")) {
        try {
            // remove the post
            await axios.delete(`/api/posts/${postId}`);

            // send the deleted post id to reducer
            dispatch({
                type: DELETE_POST,
                payload: postId,
            });

            // show an alert
            dispatch(setAlert("Post removed successfully", "dark"));
        } catch (error) {
            // send the error data to reducer
            dispatch({
                type: POSTS_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status,
                },
            });
        }
    }
};

// for adding a new comment
export const addComment = (postId, formData) => async (dispatch) => {
    try {
        // add the commet
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, {
            headers: { "Content-Type": "application/json" },
        });

        // send the new comment data to reducer
        dispatch({
            type: UPDATE_COMMENTS,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Comment added successfully", "success"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: POSTS_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for deleting a comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
    if (window.confirm("Are you sure you want to remove your comment?")) {
        try {
            // add the commet
            const res = await axios.delete(
                `/api/posts/comment/${postId}/${commentId}`
            );

            // send the new comment data to reducer
            dispatch({
                type: UPDATE_COMMENTS,
                payload: res.data,
            });

            // show an alert
            dispatch(setAlert("Comment removed successfully", "dark"));
        } catch (error) {
            // send the error data to reducer
            dispatch({
                type: POSTS_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status,
                },
            });
        }
    }
};
