// folder.controller.js

const Folder = require("../models/folder.model");
const File = require("../models/file.model");
const User = require("../models/user.model");

// Create a new folder
const createFolder = async (req, res) => {
  const { folderName, userId } = req.body;
  try {
    // Check if the Folder already exists
    const existingFolder = await Folder.findOne({ userId, folderName });
    if (existingFolder) {
      return res.status(400).send("Folder with this name already exists");
    }

    const folder = await Folder.create({
      folderName,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { folders: folder._id },
    });

    res.status(200).send(folder);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

// Get all folders for a user
const getFolders = async (req, res) => {
  const { userId } = req.body;

  try {
    const folders = await Folder.find({ userId: userId });
    if (!folders) {
      return res.status(404).send("Folder not found");
    }
    res.json(folders);
  } catch (err) {
    console.error("Error fetching folder:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Add a file to a folder
const addFileToFolder = async (req, res) => {
  const { folderId, fileName, Language, fileData, Version } = req.body;

  try {
    // Check if the File already exists
    const existingFile = await File.findOne({ folderId, fileName });
    if (existingFile) {
      return res.status(400).send("File with this name already exists");
    }

    const file = await File.create({
      folderId,
      fileName,
      Language,
      fileData,
      Version,
    });

    await Folder.findByIdAndUpdate(folderId, {
      $push: { files: file._id },
    });

    res.status(200).send(file);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//Rename Folder
const renameFolder = async (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  if (!folderName || !folderName.trim()) {
    return res.status(400).json({ error: "Folder name cannot be empty" });
  }

  try {
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { folderName },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res
      .status(200)
      .json({ message: "Folder renamed successfully", folder: updatedFolder });
  } catch (error) {
    console.error("Error renaming folder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { renameFolder };

// Update a file in a folder and Save file Data
const updateFile = async (req, res) => {
  const { fileData, _id } = req.body;

  try {
    const file = await File.findByIdAndUpdate(_id, { fileData }, { new: true });
    res.status(200).send(file);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Get files by folder ID
const getFilesByFolderId = async (req, res) => {
  const { id } = req.query; // Get folderId from query parameters

  try {
    const files = await File.find({ folderId: id });
    if (!files) {
      return res
        .status(404)
        .json({ message: "No files found for this folder." });
    }
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a folder and its associated files
const deleteFolder = async (req, res) => {
  const { folder_id, userId } = req.query;

  try {
    // Delete the folder
    const folderResult = await Folder.deleteOne({ _id: folder_id });

    // Delete files associated with the folder
    const filesResult = await File.deleteMany({ folderId: folder_id });

    // Remove the folder ID from the user's folders array
    const userResult = await User.updateOne(
      { _id: userId },
      { $pull: { folders: folder_id } }
    );

    res.send({
      message: "Folder and associated files deleted successfully",
      folderDeletedCount: folderResult.deletedCount,
      filesDeletedCount: filesResult.deletedCount,
      userUpdatedCount: userResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error deleting folder and files:", error);
    res.status(500).send({
      error: "An error occurred while deleting folder and there files",
    });
  }
};

// Delete a file from a folder
const deleteFile = async (req, res) => {
  const { file_id, folder_id } = req.query;

  try {
    // Delete the file
    const filesResult = await File.deleteOne({ _id: file_id });

    // Remove the file ID from the folder's files array
    const folderResult = await Folder.updateOne(
      { _id: folder_id },
      { $pull: { files: file_id } }
    );

    res.send({
      message: "File deleted successfully",
      folderDeletedCount: folderResult.deletedCount,
      filesDeletedCount: filesResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send({
      error: "An error occurred while deleting file",
    });
  }
};

module.exports = {
  createFolder,
  getFolders,
  addFileToFolder,
  updateFile,
  getFilesByFolderId,
  deleteFolder,
  deleteFile,
  renameFolder,
};
