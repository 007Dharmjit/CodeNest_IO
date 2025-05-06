const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folders",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    Language: {
      type: String,
      required: true,
      trim: true,
    },
    Version: {
      type: String,
      required: true,
      trim: true,
    },
    fileData: {
      type: String, // Or Buffer if storing binary data
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("files", fileSchema);
