const User = require("../models/user.model");
const jwt = require("jsonwebtoken"); // Import jwt for token generation
const mongoose = require("mongoose");
const Problem = require("../models/problem.model");
const generateAuthToken = (User) => {
  const token = jwt.sign(
    {
      id: User._id,
      username: User.username,
      email: User.email,
      folders: User.folders,
      friends: User.friends,
      requests: User.requests,
      online: User.online,
      profileImage: User.profileImage,
      bio: User.bio,
      solvedproblems: User.solvedproblems,
      myproblems: User.myproblems,
    },
    "aPq9!dS@3fT8zX1&mE7o^kP4#tY2wQ5",
    { expiresIn: "1h" } // Token valid for 1 hour
  );
  return token;
};

exports.getproblemId = async (req, res) => {
  const { id } = req.params;
  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid User ID format" });
  }
  try {
    // Find user and populate myproblems with problem details
    const user = await User.findById(id).populate("myproblems");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.myproblems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.submitProblem = async (req, res) => {
  try {
    const { userID, code, problemTitle, id } = req.body; // Extract from request body

    if (!userID || !code || !problemTitle || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the solved problem to the user's `solvedproblems` array
    user.solvedproblems.push({
      problemId: id,
      problemtitle: problemTitle,
      code: code,
    });

    // Save the updated user document
    await user.save();
    // Generate a new token with updated user data
    const token = generateAuthToken(user);
    res.status(200).json({ token });  
  } catch (error) {
    console.error("Error submitting problem:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getproblems = async (req, res) => {
  try {
    const problems = await Problem.find(); // Retrieve all problems from the database
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getFriends = async (req, res) => {
  const { userID } = req.query;

  // Validate userID
  if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userID).populate("friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends data:", error);
    res.status(500).json({ message: "Error fetching friends data" });
  }
};
// Fetch all users (excluding self and friends)
exports.fetchUsers = async (req, res) => {
  const { useremail } = req.query;

  try {
    const loggedInUser = await User.findOne({ email: useremail });

    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    const friendIds = loggedInUser.friends;

    const users = await User.find({
      email: { $ne: useremail }, // Exclude the logged-in user
      _id: { $nin: friendIds }, // Exclude friends by their IDs
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};
// Get user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Send friend request
exports.sendFrienddRequest = async (req, res) => {
  const { fromId, toId } = req.body;
  // Validate input
  if (!fromId || !toId) {
    return res
      .status(400)
      .json({ message: "Both fromId and toId are required." });
  }

  if (fromId === toId) {
    return res
      .status(400)
      .json({ message: "You cannot send a friend request to yourself." });
  }
  try {
    const sender = await User.findById(fromId);
    const receiver = await User.findById(toId);

    if (!sender || !receiver) {
      return res.status(404).json("Sender or receiver not found.");
    }

    const existingRequest = receiver.requests.find(
      (request) => request.from.toString() === fromId
    );

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const newRequest = {
      to: toId,
      from: fromId,
      status: "pending",
      timestamp: Date.now(),
    };

    sender.requests.push(newRequest);
    receiver.requests.push(newRequest);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the friend request." });
  }
};
// Reject friend request

exports.rejectFriendRequest = async (req, res) => {
  const { fromId, toId } = req.body;

  if (!fromId || !toId) {
    return res.status(400).json({ error: "Both fromId and toId are required" });
  }

  try {
    const fromObjectId = new mongoose.Types.ObjectId(fromId);
    const toObjectId = new mongoose.Types.ObjectId(toId);

    // Remove friend request from 'to' user's requests array
    await User.updateOne(
      { _id: toObjectId },
      { $pull: { requests: { from: fromObjectId } } }
    );

    // Remove friend request from 'from' user's sent requests if stored there
    await User.updateOne(
      { _id: fromObjectId },
      { $pull: { requests: { to: toObjectId } } }
    );

    // Fetch updated user and generate token
    const updatedUser = await User.findById(toObjectId).populate("friends");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateAuthToken(updatedUser);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  const { fromId, toId } = req.body;

  if (!fromId || !toId) {
    return res.status(400).json({ error: "Both fromId and toId are required" });
  }

  try {
    const fromObjectId = new mongoose.Types.ObjectId(fromId);
    const toObjectId = new mongoose.Types.ObjectId(toId);

    // Ensure users are not already friends
    const toUser = await User.findById(toObjectId);
    const fromUser = await User.findById(fromObjectId);

    if (!toUser || !fromUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      toUser.friends.includes(fromObjectId) ||
      fromUser.friends.includes(toObjectId)
    ) {
      return res.status(400).json({ error: "Users are already friends" });
    }

    // Add to each other's friends list
    await User.updateOne(
      { _id: toObjectId },
      { $addToSet: { friends: fromObjectId } }
    );
    await User.updateOne(
      { _id: fromObjectId },
      { $addToSet: { friends: toObjectId } }
    );

    // Remove friend request from both users
    await User.updateOne(
      { _id: toObjectId },
      { $pull: { requests: { from: fromObjectId } } }
    );
    await User.updateOne(
      { _id: fromObjectId },
      { $pull: { requests: { to: toObjectId } } }
    );

    // Fetch updated user with populated friends
    const updatedUser = await User.findById(toObjectId).populate("friends");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found after update" });
    }
    const token = generateAuthToken(updatedUser);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
