const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "Short bio about the user..." },
  profileImage: { 
    type: String, 
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdEGZrhxE_fgkROVU2UvPJJXgDJwk5vhNHkg&s" 
  },
  online: { type: Boolean, default: false },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  solvedproblems: [{
    problemId:{ type:Number},
    problemtitle:{ type: String },
    code:{ type: String },
    timestamp: { type: Date, default: Date.now },
  }], 
  myproblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }], 
  requests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
      to: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
      status: { type: String, default: "pending" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema); 
