const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("It's users api route!");
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.deleteOne({ __id: req.params.id });

      res.status(200).json("Account has been deleted!");
    } catch (error) {
      console.log("Delete failed.");
      res.status(500).json(error);
    }
  } else {
    return res.status(401).send("You can delete only your account.");
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
     console.log("Server error occured", error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});


//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("You do not follow this user");
      }
    } catch (error) {
      console.log("Server error occured", error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});


//update user

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account has been updated!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(401).send("You can update only your account.");
  }
});

//get a user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    !user && res.status(404).json("user not found");

    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json(other);
  } catch (error) {
    res.status(500).json("get endpoint error!");
  }
});

 

module.exports = router;
