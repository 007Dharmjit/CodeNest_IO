"use client";
import { useContext, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CodeEditorContext } from "../context/CodeEditorContext";
import executeCode from "../API/executecode";
const Output = () => {
  const { editorRef, languageDATA } = useContext(CodeEditorContext);
  const [outputData, setOutputData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  
  const runCode = async () => {
    const currentCode = editorRef.current?.getValue(); // Get the current code from the editor
    if (!currentCode) return;
    try {
      setIsloading(true);
      const { run: result } = await executeCode(languageDATA, currentCode);
      setOutputData(result.output); // Update the output data with the result
    } catch (error) {
      console.error("Error while executing code:", error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="w-1/2">
      <button
        className="text-zinc-200 mt-3 ml-2 hover:text-green-600 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-green-600 duration-700"
        onClick={runCode}
      >
        {" "}
        {isLoading ? (
          <AiOutlineLoading3Quarters className="rotating-loader" />
        ) : (
          "Run"
        )}
      </button>
      <div className="my-3 mx-4 border-2 border-red-300 h-[100vh]">
        <p className="m-3">
          {outputData ? outputData : 'Click "Run" to see output'}
        </p>
      </div>
    </div>
  );
};

export default Output;
