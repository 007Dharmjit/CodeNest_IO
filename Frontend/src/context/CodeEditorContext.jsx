"use client";
import { createContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
// import { LANGUAGES } from "../data/Language";
import axios from "axios";

export const CodeEditorContext = createContext();

const CodeEditorProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [selecteddata, setSelectedData] = useState([]);
  const [languageDATA, setLanguageData] = useState({
    Language: null,
    Version: null,
    fileData: null,
    fileName: null,
    folderId: null,
    _id: null,
  });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showData, setShowData] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState("");
  const [fileDataobject, setfileDataobject] = useState([]);
  const editorRef = useRef(null);

  const disableData = () => {
    setShowData((prev) => !prev);
  };

  const setFileData = (folderId) => {
    axios
      .get(`http://localhost:3001/api/Folder/get-files?id=${folderId}`)
      .then((res) => {
        const data = res.data;
        setFiles([]);
        setfileDataobject([]);
        data.forEach((file) => {
          setFiles((prev) => [...prev, file.fileName]);
          setfileDataobject((prev) => [...prev, file]);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //Add file to DB
  const addFileToDB = async (
    folderId,
    fileName,
    Language,
    fileData,
    Version
  ) => {
    setFiles((prev) => [...prev, fileName]);
    setFileData(folderId);
    try {
      axios
        .post("http://localhost:3001/api/Folder/add-file", {
          folderId,
          fileName,
          Language,
          fileData,
          Version,
        })
        .then((res) => {
          setfileDataobject((prev) => [...prev, res.data]);
          console.log("File added successfully");
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error("File with this name already exists ", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.error("Something went wrong. Please try again.", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        });
    } catch (error) {
      console.error("Error adding file:", error);
      alert("Error adding file.");
    }
  };

  //save file to database
  const saveFile = async (fileData, _id) => {
    try {
      axios
        .put("http://localhost:3001/api/Folder/update-file", {
          fileData,
          _id,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("saved", {
              position: "top-center",
              autoClose: 500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
          setfileDataobject([]);
          setFileData(res.data.folderId);
        })
        .catch((err) => {
          console.error("Error saving file:", err);
          alert("Error saving file.");
        });
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file.");
    }
  };

  // Delete File from database
  const deleteFile = (file_id, folder_id) => {
    if (!file_id || !folder_id) {
      toast.error("Try again .", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    axios
      .delete(
        `http://localhost:3001/api/Folder/delete-file?file_id=${file_id}&folder_id=${folder_id}`
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          // Update the file data or UI as needed
          setFileData(folder_id);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  //Get Data
  const getData = (e) => {
    showData ? null : disableData();
    const nameAttr = e.target.attributes.name;
    if (!nameAttr) return;
    const name = nameAttr.value;
    const { Language, Version, fileData, fileName, folderId, _id } =
      fileDataobject.find((item) => item.fileName === name);

    setLanguageData({ Language, Version, fileData, fileName, folderId, _id });
  };

  //Handlig Editor Mounting
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <CodeEditorContext.Provider
      value={{
        files,
        setFiles,
        selecteddata,
        setSelectedData,
        languageDATA,
        setLanguageData,
        inputVisible,
        setInputVisible,
        inputValue,
        setInputValue,
        setFileData,
        editorRef,
        showData,
        fileDataobject,
        setShowData,
        addFileToDB,
        disableData,
        getData,
        deleteFile,
        saveFile,
        handleEditorDidMount,
        currentFolderId,
        setCurrentFolderId,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};
CodeEditorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CodeEditorProvider;
