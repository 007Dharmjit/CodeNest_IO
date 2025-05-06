"use client";
import React from "react";
import { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { VscNewFile } from "react-icons/vsc";
import { CodeEditorContext } from "../context/CodeEditorContext";
import { LANGUAGES } from "../data/Language";
import { MdDeleteOutline } from "react-icons/md";
const Sidebar = (props) => {
  const {
    files,
    inputVisible,
    inputValue,
    setInputVisible,
    setInputValue,
    deleteFile,
    addFileToDB,
    setFileData,
    setCurrentFolderId,
    getData,
    setFiles,
    fileDataobject,
  } = useContext(CodeEditorContext);

  const inputRef = useRef(null);

  //Add file to DB
  const handleAddFile = () => {
    if (!inputValue.trim()) return;
    const fileName = inputValue.trim();
    const fileExtension = fileName.split(".").pop();
    const Language = LANGUAGES[fileExtension]?.language || "txt";
    const Version = LANGUAGES[fileExtension]?.language_version || null;
    const fileData =
      LANGUAGES[fileExtension]?.value ||
      "Default content for unsupported extensions.";
    setFiles([]);
    addFileToDB(props.folderId, fileName, Language, fileData, Version);
    setInputValue("");
    setInputVisible(false);
  };

  useEffect(() => {
    setFiles([]);
    setFileData(props.folderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.folderId]);

  // Add event listener for Ctrl + Shift + F to show input field
  useEffect(() => {
    setCurrentFolderId(props.folderName);
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "F") {
        setInputVisible(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  const formatFolderName = (folder) => { 
    return folder.length >= 5 ? folder.slice(0, 5) + "..." : folder;
  };
  return (
    <div className="bg-neutral-900 tracking-tight w-[200px]">
      <div className="flex justify-between items-center mt-2 px-3 py-1">
        <h2 className="text-[18px] uppercase">{formatFolderName(props.folderName)}</h2>
        <VscNewFile
          className="text-[20px] cursor-pointer"
          onClick={() => {
            setInputVisible(true);
            setTimeout(() => document.getElementById("file-input")?.focus(), 0);
          }}
        />
      </div>
      <div className="px-1 py-2 bg">
        {inputVisible && (
          <input
            id="file-input"
            className="bg-neutral-700 text-white caret-white px-3 py-2 w-full rounded focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleAddFile}
            onKeyDown={(e) => e.key === "Enter" && handleAddFile()}
          />
        )}
        {files.length===0 ? (
          <p className="text-gray-400 text-center mt-4">There is no file , Please Create One </p>
        ) : (
          <>
            {files.map((file, index) => (
              <React.Fragment key={index}>
                <div className="flex justify-between px-3 items-center flex-row mt-1 ">
                    <h3
                      key={index}
                      onClick={getData}
                      name={file}
                      className="cursor-pointer  text-xl  text-white"
                    >
                      {file}
                    </h3>
                  <MdDeleteOutline
                    size={26}
                    color="red"
                    className=" cursor-pointer"
                    onClick={() => {
                      const dt = fileDataobject.find(
                        (item) => item.fileName === file
                      );
                      deleteFile(dt._id, props.folderId);
                    }}
                  />{" "}
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
Sidebar.propTypes = {
  folderName: PropTypes.string.isRequired,
  folderId: PropTypes.string.isRequired,
};
export default Sidebar;
