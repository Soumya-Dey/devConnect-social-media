require("dotenv").config();
const jwt = require("jsonwebtoken");
// const config = require("config");

const authToken = (req, res, next) => {
    // get the token from the request header
    if (!req.header("x-auth-token")) {
        return res.status(401).json({ msg: "No token, access not authorized" });
    }

    try {
        // verify the data from the token
        const decodedPayload = jwt.verify(
            req.header("x-auth-token"),
            process.env.JWT_SECRET
            // config.get("jwtSecret")
        );

        // set req.user to current user in the token data
        req.user = decodedPayload.user;

        // execute next callback func
        next();
    } catch (error) {
        res.status(401).json({ msg: "invalid token, access not authorized" });
    }
};

module.exports = authToken;
