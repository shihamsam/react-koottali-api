const express = require("express");
const { restart } = require("nodemon");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});
//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json("You can update only your posts");
    }

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne({ __id: req.params.id });
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("You can delete only your posts");
    }
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    !post && res.status(404).json("Post not found");

    if (post.userId !== req.body.userId) {
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("Post liked successfully");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("Post unliked successfully");
      }
    } else {
      res.status(403).json("You cannot like your own posts");
    }
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: req.params.userId });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

//get users all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const userPosts = await Post.find({ userId: user._id });

    res.status(200).json(userPosts);
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    !post && res.status(404).json("Post not found!");

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});

    !posts && res.status(404).json("Post not found");

    res.status(200).json(posts);
  } catch (error) {
    console.log("Server error occured:", error);
    res.status(500).json(error);
  }
});

module.exports = router;
