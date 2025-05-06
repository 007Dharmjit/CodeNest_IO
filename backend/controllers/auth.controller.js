const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
exports.signup = async (req, res) => {
  let { firstname, lastname, username, email, password } = req.body;

  try {
    // Ensure required fields are provided and trim them safely
    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    firstname = firstname.trim();
    lastname = lastname.trim();
    username = username.trim();

    // Check if the email format is valid
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).send("Email must be a Gmail address (@gmail.com)");
    }

    // Ensure password meets security requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
        );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).send("Account Created Successfully");
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password, "form back");

  try {
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Invalid credentials");

    // Set the user's online status to true
    user.online = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        folders: user.folders,
        friends: user.friends,
        requests: user.requests,
        online: user.online,
        profileImage:user.profileImage,
        solvedproblems:user.solvedproblems,
        myproblems:user.myproblems,
        bio:user.bio,
      },
      "aPq9!dS@3fT8zX1&mE7o^kP4#tY2wQ5",
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by ID and update their online status to false
    const user = await User.findByIdAndUpdate(
      userId,
      { online: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Something went wrong");
  }
};
