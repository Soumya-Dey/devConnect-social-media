import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_ALL_PROFILES,
    GET_GITHUB_REPOS,
    NO_REPOS,
    FOLLOW_ERROR,
} from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false,
            };
        case GET_ALL_PROFILES:
            return {
                ...state,
                profiles: action.payload,
                loading: false,
            };
        case GET_GITHUB_REPOS:
            return {
                ...state,
                repos: action.payload,
                loading: false,
            };
        case NO_REPOS:
            return {
                ...state,
                repos: [],
                loading: false,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                profile: null,
            };
        case FOLLOW_ERROR:
            return {
                ...state,
                loading: false,
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false,
            };
        default:
            return state;
    }
}
