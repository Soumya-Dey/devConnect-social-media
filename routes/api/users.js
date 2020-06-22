require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @route POST api/users
// @desc register user and get token
// @access Public
router.post(
    "/",
    [
        check("name", "Please enter a name!").notEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check(
            "password",
            "Password must be 6 or more characters long"
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let newUser = await User.findOne({ email: req.body.email });

            // check if the email already exists
            if (newUser) {
                return res.status(400).json({
                    errors: [{ msg: "User already exists!" }],
                });
            }

            // get the avatar
            const avatar = gravatar.url(
                req.body.email,
                {
                    s: "200", // size of the avatar image
                    r: "pg", // rating: pg -> no naked images
                    d: "retro", // default image when no avatar is available
                },
                true
            );

            // hash pasword
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            newUser = User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: avatar,
            });

            // save the user
            await newUser.save();

            // return json web token
            // to keep user signed in
            const payload = {
                user: {
                    // getting "_id" from the user model
                    id: newUser.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token: token });
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
