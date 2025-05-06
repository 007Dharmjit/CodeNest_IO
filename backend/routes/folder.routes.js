const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folder.controller");

// Create a new folder
router.post("/", folderController.createFolder);

// Get all folders for a user
router.post("/get-folders", folderController.getFolders);

// Add a file to a folder
router.post("/add-file", folderController.addFileToFolder);

//Rename Folder
router.put("/rename/:folderId", folderController.renameFolder);
// Update a file in a folder
router.put("/update-file", folderController.updateFile);

// Get files by folder ID
router.get("/get-files", folderController.getFilesByFolderId);

// Delete a folder
router.delete("/delete-folder", folderController.deleteFolder);

// Delete a file from a folder
router.delete("/delete-file", folderController.deleteFile);

module.exports = router;