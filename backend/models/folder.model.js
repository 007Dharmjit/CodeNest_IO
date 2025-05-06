const mongoose = require("mongoose");

const UsersFolderSchema = mongoose.Schema( {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  folderName: {
    type: String,
    required: true,
    trim: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "files",
    },
  ],
},
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('folders',UsersFolderSchema);
