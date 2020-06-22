import {
    GET_POSTS,
    GET_POST,
    POSTS_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    UPDATE_COMMENTS,
} from "../actions/types";

const initialState = {
    post: null,
    posts: [],
    loading: true,
    error: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false,
            };
        case GET_POST:
            return {
                ...state,
                post: action.payload,
                loading: false,
            };
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
                loading: false,
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(
                    (post) => post._id !== action.payload
                ),
                loading: false,
            };
        case POSTS_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload.postId
                        ? { ...post, likes: action.payload.likes }
                        : post
                ),
                loading: false,
            };
        case UPDATE_COMMENTS:
            return {
                ...state,
                post: { ...state.post, comments: action.payload },
                loading: false,
            };
        default:
            return state;
    }
}
