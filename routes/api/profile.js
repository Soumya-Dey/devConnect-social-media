require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const axios = require("axios");

const authToken = require("../../middleware/auth");
const checkId = require("../../middleware/checkId");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route GET api/profile/me
// @desc get logged in user's profile
// @access Private
router.get("/me", authToken, async (req, res) => {
    try {
        const currentProfile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["name", "avatar"]);

        if (!currentProfile) {
            return res.status(400).json({
                errors: [{ msg: "No profile found for this user" }],
            });
        }

        res.json(currentProfile);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route    POST api/profile
// @desc     create or update profile
// @access   Private
router.post(
    "/",
    [
        authToken,
        [
            check("status", "Status is required!").notEmpty(),
            check("skills", "Skills are required!").notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructure the fields from req.body
        const {
            avatar,
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        } = req.body;

        // build the object for the profile
        const tempProfile = {};
        tempProfile.user = req.user.id;
        if (company) tempProfile.company = company;
        if (location) tempProfile.location = location;
        if (website) tempProfile.website = website;
        if (bio) tempProfile.bio = bio;
        if (status) tempProfile.status = status;
        if (githubusername) tempProfile.githubusername = githubusername;
        if (skills)
            tempProfile.skills = skills.split(",").map((skill) => skill.trim());

        tempProfile.social = {};
        if (youtube) tempProfile.social.youtube = youtube;
        if (twitter) tempProfile.social.twitter = twitter;
        if (instagram) tempProfile.social.instagram = instagram;
        if (linkedin) tempProfile.social.linkedin = linkedin;
        if (facebook) tempProfile.social.facebook = facebook;

        // create or update the profile in db
        try {
            // Using upsert option (creates new doc if no match is found)
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: tempProfile },
                { new: true, upsert: true }
            );

            if (avatar) {
                await User.findByIdAndUpdate(req.user.id, { avatar });
            }

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    GET api/profile
// @desc     get all profiles
// @access   Public
router.get("/", async (req, res) => {
    try {
        const allProfiles = await Profile.find().populate("user", [
            "name",
            "avatar",
        ]);

        res.json(allProfiles);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route    GET api/profile/user/:userId
// @desc     get profile by user ID
// @access   Public
router.get("/user/:userId", checkId("userId"), async (req, res) => {
    try {
        const specificProfile = await Profile.findOne({
            user: req.params.userId,
        }).populate("user", ["name", "avatar"]);

        if (!specificProfile) {
            return res.status(400).json({
                errors: [{ msg: "No profile found" }],
            });
        }

        res.json(specificProfile);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route    DELETE api/profile
// @desc     delete user, profile and posts
// @access   Private
router.delete("/", authToken, async (req, res) => {
    try {
        // remove the profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // remove the respective user
        await User.findByIdAndRemove(req.user.id);

        // remove user's posts
        await Post.deleteMany({ user: req.user.id });

        res.json({ msg: `User(${req.user.id}) removed successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route    PUT api/profile/follow/:userToFollowId
// @desc     add follower and following to profiles
// @access   Private
router.put(
    "/follow/:userToFollowId",
    [authToken, checkId("userToFollowId")],
    async (req, res) => {
        try {
            // get the logged in profile
            const currentProfile = await Profile.findOne({
                user: req.user.id,
            }).populate("user", ["name", "avatar"]);
            // add this user to followers list of "profileToFollow"
            const currentUser = await User.findById(req.user.id).select(
                "-password"
            );

            // get the profile to follow
            const profileToFollow = await Profile.findOne({
                user: req.params.userToFollowId,
            }).populate("user", ["name", "avatar"]);
            // add this profile to following list of "currentProfile"
            const userToFollow = await User.findById(
                req.params.userToFollowId
            ).select("-password");

            // check if the user already followed
            if (
                profileToFollow.followers.filter(
                    (follower) => follower.user.toString() === req.user.id
                ).length > 0
            ) {
                return res.status(400).json({
                    errors: [{ msg: "User already in the follower list!" }],
                });
            }

            // build the follower and following
            const newFollower = {
                user: req.user.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
            };
            const newFollowing = {
                user: userToFollow.id,
                name: userToFollow.name,
                avatar: userToFollow.avatar,
            };

            // add the follower and following
            profileToFollow.followers.unshift(newFollower);
            currentProfile.following.unshift(newFollowing);

            // save the profiles
            await profileToFollow.save();
            await currentProfile.save();

            res.json(profileToFollow.followers);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    DELETE api/profile/unfollow/:userToFollowId
// @desc     remove follower and following from profiles
// @access   Private
router.delete(
    "/unfollow/:userToFollowId",
    [authToken, checkId("userToFollowId")],
    async (req, res) => {
        try {
            // get the logged in profile
            const currentProfile = await Profile.findOne({
                user: req.user.id,
            }).populate("user", ["name", "avatar"]);

            // get the profile to unfollow
            const profileToUnfollow = await Profile.findOne({
                user: req.params.userToFollowId,
            }).populate("user", ["name", "avatar"]);

            // find the index to remove
            const followerIndexToRemove = profileToUnfollow.followers
                .map((follower) => follower.user.toString())
                .indexOf(req.user.id);
            const followingIndexToRemove = currentProfile.following
                .map((followingItem) => followingItem.user.toString())
                .indexOf(req.params.userToFollowId);

            // check wheather the user is in any lists
            if (followerIndexToRemove === -1 && followerIndexToRemove === -1) {
                return res.status(400).json({
                    errors: [
                        { msg: "User is not in follower and following list!" },
                    ],
                });
            }
            if (followerIndexToRemove === -1) {
                return res.status(400).json({
                    errors: [{ msg: "User is not in the follower list!" }],
                });
            }
            if (followingIndexToRemove === -1) {
                return res.status(400).json({
                    errors: [{ msg: "User is not in the following list!" }],
                });
            }

            // remove the user from both the followers and following lists
            profileToUnfollow.followers.splice(followerIndexToRemove, 1);
            currentProfile.following.splice(followingIndexToRemove, 1);

            // save the profiles
            await profileToUnfollow.save();
            await currentProfile.save();

            res.json(profileToUnfollow.followers);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    PUT api/profile/experience
// @desc     add experience to profile
// @access   Private
router.put(
    "/experience",
    [
        authToken,
        [
            check("title", "Title is required").notEmpty(),
            check("company", "Company is required").notEmpty(),
            check("from", "From date is required").notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        // build the experience obj
        const tempExp = {
            title: title,
            company: company,
            location: location,
            from: from,
            to: to,
            current: current,
            description: description,
        };

        try {
            // get the logged in profile
            const profile = await Profile.findOne({ user: req.user.id });

            // add the new experience to the top of the array
            profile.experience.unshift(tempExp);

            // save the profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    DELETE api/profile/experience/:expId
// @desc     remove experience from profile
// @access   Private
router.delete(
    "/experience/:expId",
    [authToken, checkId("expId")],
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            // get the index of the experience
            const indexToRemove = profile.experience
                .map((exp) => exp.id)
                .indexOf(req.params.expId);

            if (indexToRemove === -1)
                return res
                    .status(400)
                    .json({ errors: [{ msg: "No experience found" }] });

            // remove the item at the index
            profile.experience.splice(indexToRemove, 1);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    PUT api/profile/education
// @desc     add education to profile
// @access   Private
router.put(
    "/education",
    [
        authToken,
        [
            check("school", "School is required").notEmpty(),
            check("degree", "Degree is required").notEmpty(),
            check("fieldofstudy", "Fieldofstudy is required").notEmpty(),
            check("from", "From date is required").notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        // build the experience obj
        const tempEdu = {
            school: school,
            degree: degree,
            fieldofstudy: fieldofstudy,
            from: from,
            to: to,
            current: current,
            description: description,
        };

        try {
            // get the logged in profile
            const profile = await Profile.findOne({ user: req.user.id });

            // add the new experience to the top of the array
            profile.education.unshift(tempEdu);

            // save the profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    DELETE api/profile/education/:eduId
// @desc     remove education from profile
// @access   Private
router.delete(
    "/education/:eduId",
    [authToken, checkId("eduId")],
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            // get the index of the experience
            const indexToRemove = profile.education
                .map((edu) => edu.id)
                .indexOf(req.params.eduId);

            if (indexToRemove === -1)
                return res
                    .status(400)
                    .json({ errors: [{ msg: "No education found" }] });

            // remove the item at the index
            profile.education.splice(indexToRemove, 1);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    GET api/profile/github/:username
// @desc     get github repos of the user
// @access   Public
router.get("/github/:username", async (req, res) => {
    try {
        const githubRes = await axios.get(
            encodeURI(
                `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
            ),
            {
                "user-agent": "node.js",
                Authorization: `token ${process.env.GITHUB_CLIENT_ID}`,
            }
        );

        res.json(githubRes.data);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

module.exports = router;
