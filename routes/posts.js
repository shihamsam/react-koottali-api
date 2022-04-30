const express = require("express");
const Post = require("../models/Post");
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

//get timeline posts
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
