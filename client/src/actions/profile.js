import axios from "axios";

import { setAlert } from "./alert";
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_ALL_PROFILES,
    GET_GITHUB_REPOS,
    NO_REPOS,
    FOLLOW_ERROR,
    UPDATE_FOLLOWERS,
} from "../actions/types";

// for getting current user's profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        // get the profile
        const res = await axios.get("/api/profile/me");

        // send the profile data to the reducer
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for getting all profiles
export const getAllProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get("/api/profile");

        // send the profiles data to the reducer
        dispatch({
            type: GET_ALL_PROFILES,
            payload: res.data,
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for getting a profile by user id
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        // send the profile data to the reducer
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for getting github repos of a user
export const getGithubRepos = (githubUsername) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/github/${githubUsername}`);

        // send the repository data to the reducer
        dispatch({
            type: GET_GITHUB_REPOS,
            payload: res.data,
        });
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: NO_REPOS,
        });
    }
};

// for creating or updating a profile
// formData -> data we get from the form
// history -> param to redirect to a route after update [history.push('<route to redirect>')]
export const createProfile = (formData, history, isEditing = false) => async (
    dispatch
) => {
    try {
        // create or update profile
        const res = await axios.post("/api/profile", formData, {
            headers: { "Content-Type": "application/json" },
        });

        // send the profile data to the reducer
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

        // show an alert
        dispatch(
            setAlert(
                isEditing
                    ? "Profile updated successfully"
                    : "Profile created successfully",
                "success"
            )
        );

        window.scrollTo(0, 0);

        // if creating profile then redirect to dashboard
        if (!isEditing) history.push("/dashboard");
    } catch (error) {
        // validation errors
        const errArr = error.response.data.errors;

        // send the errors to the alert reducer
        if (errArr) {
            errArr.forEach((errItem) =>
                dispatch(setAlert(errItem.msg, "danger"))
            );
        }

        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for adding follower and following
export const addFollowerFollowing = (userToFollowId) => async (dispatch) => {
    try {
        // add follower and following
        const res = await axios.put(`/api/profile/follow/${userToFollowId}`);

        // send the profile data to the reducer
        dispatch({
            type: UPDATE_FOLLOWERS,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("User followed successfully", "success"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: FOLLOW_ERROR,
        });
    }
};

// for removing follower and following
export const removeFollowerFollowing = (userToUnfollowId) => async (
    dispatch
) => {
    try {
        // remove follower and following
        const res = await axios.delete(
            `/api/profile/unfollow/${userToUnfollowId}`
        );

        // send the profile data to the reducer
        dispatch({
            type: UPDATE_FOLLOWERS,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("User unfollowed successfully", "dark"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: FOLLOW_ERROR,
        });
    }
};

// for adding experience to a profile
export const addExperience = (formData, history) => async (dispatch) => {
    try {
        // create or update profile
        const res = await axios.put("/api/profile/experience", formData, {
            headers: { "Content-Type": "application/json" },
        });

        // send the profile data to the reducer
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Experience added successfully", "success"));

        history.push("/dashboard");

        window.scrollTo(0, 0);
    } catch (error) {
        // validation errors
        const errArr = error.response.data.errors;

        // send the errors to the alert reducer
        if (errArr) {
            errArr.forEach((errItem) =>
                dispatch(setAlert(errItem.msg, "danger"))
            );
        }

        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for adding education to a profile
export const addEducation = (formData, history) => async (dispatch) => {
    try {
        // create or update profile
        const res = await axios.put("/api/profile/education", formData, {
            headers: { "Content-Type": "application/json" },
        });

        // send the profile data to the reducer
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Education added successfully", "success"));

        history.push("/dashboard");

        window.scrollTo(0, 0);
    } catch (error) {
        // validation errors
        const errArr = error.response.data.errors;

        // send the errors to the alert reducer
        if (errArr) {
            errArr.forEach((errItem) =>
                dispatch(setAlert(errItem.msg, "danger"))
            );
        }

        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for deleting a experience
export const deleteExperience = (expId) => async (dispatch) => {
    try {
        // delete the experience by id
        const res = await axios.delete(`/api/profile/experience/${expId}`);

        // send the updated profile data to the reducer
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Experience removed successfully", "success"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for deleting a education
export const deleteEducation = (eduId) => async (dispatch) => {
    try {
        // delete the education by id
        const res = await axios.delete(`/api/profile/education/${eduId}`);

        // send the updated profile data to the reducer
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        // show an alert
        dispatch(setAlert("Education removed successfully", "success"));
    } catch (error) {
        // send the error data to reducer
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// for deleting user and profile
export const deleteAccount = () => async (dispatch) => {
    if (
        window.confirm(
            "Are you absolutely sure you want to delete your account?"
        )
    ) {
        try {
            await axios.delete("/api/profile");

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });

            dispatch(
                setAlert("Your account has been permanently deleted", "dark")
            );
        } catch (error) {
            // send the error data to reducer
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status,
                },
            });
        }
    }
};
