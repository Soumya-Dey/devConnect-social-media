import axios from "axios";

// for setting the token globally in the headers
const setAuthToken = (token) => {
    if (token) axios.defaults.headers.common["x-auth-token"] = token;
    else delete axios.defaults.headers.common["x-auth-token"];
};

export default setAuthToken;
