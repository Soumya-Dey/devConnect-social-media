require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const authToken = require("../../middleware/auth");
const User = require("../../models/User");

// @route GET api/auth
// @desc get currently logged in user
// @access Private
router.get("/", authToken, async (req, res) => {
    try {
        // return the user without password field if token is authorized
        const user = await User.findById(req.user.id).select(
            "-password -resetPasswordId"
        );

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
                async (err, token) => {
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
                    await currentUser.save();

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

// @route POST api/auth/forgot
// @desc send user email with password reset link
// @access Public
router.post(
    "/forgot",
    [check("email", "Please enter a valid email").isEmail()],
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

            currentUser.resetPasswordId = uuidv4();
            await currentUser.save();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.FROM_EMAIL_PASS,
                },
            });

            // send email
            let link = `https://devconnect-social-media.herokuapp.com/reset/${currentUser.resetPasswordId}`;
            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: currentUser.email,
                subject: "DevConnect Password Reset Request",
                text: `Hi ${currentUser.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n
            Thank you, Team DevConnect`,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                return res.status(400).json({
                    errors: [{ msg: error.message }],
                });
            }

            res.json({
                msg: `An email with a reset link has been sent to ${currentUser.email}`,
            });
        } catch (error) {
            res.status(500).send("server error");
        }
    }
);

// @route POST api/auth/reset/:resetPasswordId
// @desc reset user password
// @access Public
router.post(
    "/reset/:resetPasswordId",
    [
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
            // check if the email exists
            let currentUser = await User.findOne({
                resetPasswordId: req.params.resetPasswordId,
            });

            if (!currentUser) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid credentials" }],
                });
            }

            // update to the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            currentUser.password = hashedPassword;

            // make the resetPasswordId invalid
            currentUser.resetPasswordId = null;

            // save the changes to the user
            await currentUser.save();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.FROM_EMAIL_PASS,
                },
            });

            // send a confirmation email
            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: currentUser.email,
                subject: "DevConnect Password Reset Successfull",
                text: `Hi ${currentUser.name} \n 
            Your request to reset your password is successfull. \n\n 
            If you did not request this, please contact us immediately at ${process.env.FROM_EMAIL}.\n
            Thank you, Team DevConnect`,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                return res.status(400).json({
                    errors: [{ msg: error.message }],
                });
            }

            res.json({
                msg: `Password changed successfully`,
            });
        } catch (error) {
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
