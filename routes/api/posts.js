const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authToken = require("../../middleware/auth");
const checkId = require("../../middleware/checkId");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route POST api/posts
// @desc create a new post
// @access Private
router.post(
    "/",
    [authToken, [check("text", "Text is required").notEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const currentUser = await User.findById(req.user.id).select(
                "-password"
            );

            const newPost = Post({
                text: req.body.text,
                user: req.user.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
            });

            const post = await newPost.save();

            res.json(post);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route GET api/posts
// @desc get all posts
// @access Private
router.get("/", authToken, async (req, res) => {
    try {
        // get all posts
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route GET api/posts/user/:userId
// @desc get all posts by a specific user
// @access Private
router.get(
    "/user/:userId",
    [authToken, checkId("userId")],
    async (req, res) => {
        try {
            // get all posts by the user
            const specificPosts = await Post.find({
                user: req.params.userId,
            }).sort({ date: -1 });

            res.json(specificPosts);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route GET api/posts/:postId
// @desc get a specific post
// @access Private
router.get("/:postId", [authToken, checkId("postId")], async (req, res) => {
    try {
        // get the post with the postId
        const specificPost = await Post.findById(req.params.postId);

        if (!specificPost) {
            return res.status(400).json({
                errors: [{ msg: "No post found" }],
            });
        }

        res.json(specificPost);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route DELETE api/posts/:postId
// @desc delete a specific post
// @access Private
router.delete("/:postId", [authToken, checkId("postId")], async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.postId);

        if (!specificPost) {
            return res.status(400).json({
                errors: [{ msg: "No post found" }],
            });
        }

        // check if the currently logged in user is not the owner of the post
        if (specificPost.user.toString() !== req.user.id) {
            return res.status(400).json({
                errors: [{ msg: "User not authorized!" }],
            });
        }

        specificPost.remove();

        res.json({ msg: `Post(${specificPost.id}) removed successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// @route PUT api/posts/like/:postId
// @desc like a specific post
// @access Private
router.put(
    "/like/:postId",
    [authToken, checkId("postId")],
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            // check if the user already liked the post
            if (
                post.likes.filter(
                    (like) => like.user.toString() === req.user.id
                ).length > 0
            ) {
                return res.status(400).json({
                    errors: [{ msg: "User liked the post already!" }],
                });
            }

            // add the user to the front of the likes array
            post.likes.unshift({ user: req.user.id });

            await post.save();

            res.json(post.likes);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route PUT api/posts/unlike/:postId
// @desc unlike a specific post
// @access Private
router.put(
    "/unlike/:postId",
    [authToken, checkId("postId")],
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            const indexToRemove = post.likes
                .map((like) => like.user.toString())
                .indexOf(req.user.id);

            // check wheather the post have been liked yet
            if (indexToRemove === -1) {
                return res.status(400).json({
                    errors: [{ msg: "Post hasn't been liked yet!" }],
                });
            }

            // remove the user from the likes array
            post.likes.splice(indexToRemove, 1);

            await post.save();

            res.json(post.likes);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route PUT api/posts/dislike/:postId
// @desc dislike a specific post
// @access Private
router.put(
    "/dislike/:postId",
    [authToken, checkId("postId")],
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            // check if the user already liked the post
            if (
                post.likes.filter(
                    (like) => like.user.toString() === req.user.id
                ).length > 0
            ) {
                return res.status(400).json({
                    errors: [{ msg: "User liked the post already!" }],
                });
            }

            // check if the user already disliked the post
            if (
                post.dislikes.filter(
                    (dislike) => dislike.user.toString() === req.user.id
                ).length > 0
            ) {
                return res.status(400).json({
                    errors: [{ msg: "User disliked the post already!" }],
                });
            }

            // add the user to the front of the likes array
            post.dislikes.unshift({ user: req.user.id });

            await post.save();

            res.json(post.dislikes);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route PUT api/posts/undislike/:postId
// @desc undislike a specific post
// @access Private
router.put(
    "/undislike/:postId",
    [authToken, checkId("postId")],
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            const indexToRemove = post.dislikes
                .map((dislike) => dislike.user.toString())
                .indexOf(req.user.id);

            // check wheather the post have been disliked yet
            if (indexToRemove === -1) {
                return res.status(400).json({
                    errors: [{ msg: "Post hasn't been disliked yet!" }],
                });
            }

            // remove the user from the likes array
            post.dislikes.splice(indexToRemove, 1);

            await post.save();

            res.json(post.dislikes);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route POST api/posts/comment/:postId
// @desc comment on a post
// @access Private
router.post(
    "/comment/:postId",
    [
        authToken,
        checkId("postId"),
        [check("text", "Text is required").notEmpty()],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const currentUser = await User.findById(req.user.id).select(
                "-password"
            );
            const currentPost = await Post.findById(req.params.postId);

            if (!currentPost) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            // build the new comment
            const newComment = {
                text: req.body.text,
                user: req.user.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
            };

            // add the new comment and save the post
            currentPost.comments.unshift(newComment);
            await currentPost.save();

            res.json(currentPost.comments);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

// @route    DELETE api/posts/comment/:postId/:commentId
// @desc     delete a comment
// @access   Private
router.delete(
    "/comment/:postId/:commentId",
    [authToken, checkId("postId"), checkId("commentId")],
    async (req, res) => {
        try {
            const currentPost = await Post.findById(req.params.postId);

            if (!currentPost) {
                return res.status(400).json({
                    errors: [{ msg: "No post found" }],
                });
            }

            // pull out comment
            const indexToRemove = currentPost.comments
                .map((cmmnt) => cmmnt.id.toString())
                .indexOf(req.params.commentId);

            if (indexToRemove === -1) {
                return res.status(400).json({
                    errors: [{ msg: "No comment found" }],
                });
            }

            // check if the current user is the owner of the comment
            if (
                currentPost.comments[indexToRemove].user.toString() !==
                req.user.id
            ) {
                return res.status(400).json({
                    errors: [{ msg: "User not authorized" }],
                });
            }

            // remove the comment from the comments array
            currentPost.comments.splice(indexToRemove, 1);

            await currentPost.save();

            res.json(currentPost.comments);
        } catch (error) {
            console.log(error);
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
