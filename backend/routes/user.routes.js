const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
const { upload } = require("../config/cloudinaryConfig");
const User = require("../models/user.model");
const Problem = require("../models/problem.model");

router.get("/get-friends", userController.getFriends);
//submit problem
router.post("/submit-problem", userController.submitProblem);
// Fetch all users (excluding self and friends)
router.get("/fetch-users", userController.fetchUsers);
//get problem detail.
router.get("/problem/:id", userController.getproblemId);

// Send friend request
router.post("/send-request", userController.sendFrienddRequest);
//update profile data
router.post("/update-profile/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const imageUrl = req.file?.path; // Cloudinary URL, optional
    const userName = req.body.userName.trim();
    const bioData = req.body.bioData.trim();

    let updateFields = {};
    console.log(updateFields);
    if (imageUrl) {
      updateFields.profileImage = imageUrl;
    }

    if (userName) {
      updateFields.username = userName;
    }

    if (bioData) {
      updateFields.bio = bioData;
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        folders: user.folders,
        friends: user.friends,
        requests: user.requests,
        online: user.online,
        profileImage: user.profileImage,
        bio: user.bio,
        solvedproblems: User.solvedproblems,
        myproblems: User.myproblems,
      },
      "aPq9!dS@3fT8zX1&mE7o^kP4#tY2wQ5",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Data uploaded successfully!",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed!", error });
  }
});
// Upload user Problem
router.post("/upload-problem", upload.array("images"), async (req, res) => {
  try {
    // Extract fields from the request body
    const { name, description, uploadedByuser, userID } = req.body;
    console.log("body", req.body);
    // Process uploaded images from Cloudinary via multer
    // Each file object has a "path" property containing the Cloudinary URL
    const imageUrls = req.files.map((file) => file.path);
    console.log(imageUrls, "data are ");
    // Create a new Problem document
    const newProblem = new Problem({
      name, // Problem name from the form (mapped from "problmName")
      description, // Description
      uploadedBy: userID,
      uploadedByuser, // e.g., userData.username
      images: imageUrls, // Array of Cloudinary image URLs
      // uploadedAt will default to Date.now as per your schema
    });

    console.log(newProblem, "new prob");
    // Save the Problem in the database
    await newProblem.save();

    // Update the User document by pushing the new problem's _id to their myproblems array
    await User.findByIdAndUpdate(userID, {
      $push: { myproblems: newProblem._id },
    });

    // Return the new problem id (and optionally the whole problem)
    res.status(201).json({ problemId: newProblem._id, problem: newProblem });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Reject friend request
router.post("/reject-request", userController.rejectFriendRequest);
//get all problems
router.get("/get-problems", userController.getproblems);
// Accept friend request
router.post("/accept-request", userController.acceptFriendRequest);
// Get user by ID
router.get("/:id", userController.getUserById);

module.exports = router;
