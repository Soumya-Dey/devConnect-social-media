require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const authToken = require("../../middleware/auth");
const User = require("../../models/User");

// @route GET api/auth
// @desc get currently logged in user
// @access Private
router.get("/", authToken, async (req, res) => {
    try {
        // return the user without password field if token is authorized
        const user = await User.findById(req.user.id).select("-password");

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route POST api/auth
// @desc login user and get token
// @access Public
router.post(
    "/",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // check if the email exists
            let currentUser = await User.findOne({ email: req.body.email });

            if (!currentUser) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid credentials" }],
                });
            }

            // compare the entered password
            const isMatched = await bcrypt.compare(
                req.body.password,
                currentUser.password
            );
            if (!isMatched)
                return res.status(400).json({
                    errors: [{ msg: "Invalid credentials" }],
                });

            // return json web token
            // to keep user signed in
            const payload = {
                user: {
                    // getting "_id" from the user model
                    id: currentUser.id,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        console.log("here errr");
                        throw err;
                    }

                    // update the avatar
                    currentUser.avatar = gravatar.url(
                        currentUser.email,
                        {
                            s: "200", // size of the avatar image
                            r: "pg", // rating: pg -> no naked images
                            d: "retro", // default image when no avatar is available
                        },
                        true
                    );
                    res.json({ token: token });
                }
            );
        } catch (error) {
            console.log(error);
            console.log("error");
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
