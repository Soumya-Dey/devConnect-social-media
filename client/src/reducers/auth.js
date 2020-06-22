import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT,
    ACCOUNT_DELETED,
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        // authenticating a user
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
            };
        // registering a new user
        // loggin in a  user
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false,
            };
        // fail when registering
        // fail when logging in
        // fail when authenticating
        // loggin out user
        // deleting user
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case AUTH_ERROR:
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
            };
        default:
            return state;
    }
}
