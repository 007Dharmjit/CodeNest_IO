const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedByuser: {type: String, required: true, trim: true },

  uploadedAt: { type: Date, default: Date.now },

  images: [
    {
      type: String, // Could be a URL or file path
      required: true,
    },
  ],
});

module.exports = mongoose.model("Problem", ProblemSchema);
