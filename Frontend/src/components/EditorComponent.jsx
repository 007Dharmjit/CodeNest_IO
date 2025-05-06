"use client";
import { useContext } from "react";
import Editor from "@monaco-editor/react";
import { RxCross2 } from "react-icons/rx";
import { CodeEditorContext } from "../context/CodeEditorContext";
import Output from "./Output";

const EditorComponent = () => {
  const {
    languageDATA,
    handleEditorDidMount,
    disableData,
    showData,editorRef,
    saveFile,
  } = useContext(CodeEditorContext);  
  const updateFile = (e) => {  
    if(editorRef.current){
      const data = editorRef.current.getValue();
      saveFile(data,e.target.id)
    }
  
  }
  return (
    <div className="bg-[#1e1e1e] flex flex-row h-full w-full">
      {showData && languageDATA?.fileName ? (
        <>
          <div className="inputcomponent w-1/2">
            <div className=" flex justify-between items-center">
              <div className="name mt-3 ml-2 py-2 px-6 flex flex-row gap-2">
                <p>{languageDATA?.fileName}</p>
                <div className="pt-1 cursor-pointer" onClick={disableData}>
                  <RxCross2 />
                </div>
              </div>
              <button 
              id={languageDATA._id}
                onClick={updateFile}
                // className="ml-auto bg-blue-500  text-white px-3 py-1 rounded hover:bg-blue-600"
                className="text-zinc-200 mt-3 ml-2 hover:text-blue-600 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-blue-600 duration-700"
              >
                Save
              </button>
            </div>

            <div className="my-3 mx-4" key={languageDATA._id}>
              <Editor
                theme="vs-dark"
                onMount={handleEditorDidMount}
                path={languageDATA?.fileName || "default"}
                defaultLanguage={languageDATA?.Language || "txt"}
                defaultValue={languageDATA?.fileData || "plaintext"}
                height="100vh"
              />
            </div>
          </div>
          <Output />
        </>
      ) : (
        <div className="h-full w-full flex justify-center items-center flex-col text-[#131316] cursor-default">
          <h1 className="font-semibold text-2xl flex">
            Create file <p className="bg-zinc-800 mx-2 px-2 rounded">Ctrl</p>+{" "}
            <p className="bg-zinc-800 mx-2 px-2 rounded">Shift</p>+{" "}
            <p className="bg-zinc-800 px-2 rounded mx-2">f</p>
          </h1>
          <h1 className="font-semibold text-9xl">CodeNest.io</h1>
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
