import { useParams } from "react-router-dom";
import { useState } from "react";
import problemData from "../data/ProblemsData.json";
import executeCode from "../API/executecode";
import Layout from "../Pages/Layout.jsx";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { LANGUAGES } from "../data/Language";
import { IoTriangle } from "react-icons/io5";
import { IoIosCloudUpload } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
function ProblemDescription() {
  const { problemTitle } = useParams(); // Get the dynamic problem title from the URL
  const problemDetail = problemData.find(
    (p) => p.title === problemTitle.replace(/-/g, " ")
  );
  const { userData, setUserData } = useAuth();
  const {
    title,
    id,
    description,
    inputDescription,
    outputDescription,
    example,
    constraints,
  } = problemDetail;

  const [code, setCode] = useState(""); // Stores the current code from the editor
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("js"); // Default language
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = async () => {
    try {
      setIsLoading(true); // Start loading

      const selectedLang = language || "js";
      const languageData = LANGUAGES[selectedLang];

      if (!languageData) {
        setOutput("Error: Selected language is not supported.");
        setIsLoading(false);
        return;
      }
      if (code.length <= 0) {
        setOutput("Error: Please write code");
        setIsLoading(false);
        return;
      }
      const payload = {
        Language: languageData.language,
        Version: languageData.language_version,
        Code: code, // Add code to the payload
      };

      // Example API call (replace `executeCode` with your actual implementation)
      const { run: result } = await executeCode(payload, code);

      setOutput(result?.output || "Execution completed successfully.");
    } catch (err) {
      console.error("Error executing code:", err);
      setOutput("Error executing code.");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  const handleSubmit = async () => {
    if (code.length <= 0) return;
    if (!userData.id) return;
    if (!problemTitle) return;
    if (!id) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/submit-problem",
        {
          userID: userData.id,
          code,
          problemTitle,
          id,
        }
      );
      if (response.status === 200) {
        // Update token in local storage
        localStorage.setItem("authToken", response.data.token);
        const decoded = jwt_decode(response.data.token);
        setUserData(decoded);
        toast.success("Problem Submited successfully.", {
          position: "top-center",
          autoClose: 1500,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Error submitting problem:", {
        position: "top-center",
        autoClose: 1500,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-800">
      {/* Main Container */}
      <Layout />
      <div className=" flex justify-center items-center gap-4 py-2">
        <button
          onClick={handleRunCode}
          className="bg-zinc-700 px-3 py-1 rounded flex justify-between items-center gap-2 hover:bg-zinc-600  w-fit transition"
        >
          {" "}
          {isLoading ? (
            <AiOutlineLoading3Quarters className="rotating-loader" />
          ) : (
            <IoTriangle size={18} color="#18181b" className=" rotate-90" />
          )}
          {/* <IoTriangle size={18} color="#18181b" className=" rotate-90" /> */}
          Run
        </button>
        <button
          onClick={handleSubmit}
          className="bg-zinc-700 text-green-500 px-3  py-1 rounded  flex justify-between items-center gap-2 hover:bg-zinc-600  w-fit transition"
        >
          {" "}
          <IoIosCloudUpload size={18} />
          Submit
        </button>{" "}
      </div>
      {/* Main Layout - Problem Description & Code Section */}
      <div className="flex flex-col xl:flex-row gap-4 p-4 flex-1">
        {/* Left - Problem Details */}
        <div
          className="border border-zinc-700 rounded-lg p-4 bg-zinc-800 shadow-md overflow-y-auto 
                        w-full h-1/2 xl:w-1/2 xl:h-full"
        >
          <h3 className="text-xl font-semibold border-b border-zinc-700 pb-2">
            {id}. {title}
          </h3>

          <p className="mt-3">{description}</p>

          <h4 className="font-semibold text-lg mt-4">Input Description:</h4>
          <p className="italic text-gray-300">{inputDescription}</p>

          <h4 className="font-semibold text-lg mt-4">Output Description:</h4>
          <p className="italic text-gray-300">{outputDescription}</p>

          <h4 className="font-semibold text-lg mt-4">Example:</h4>
          <div className="border-l-2 pl-3 border-green-500">
            <p>
              <strong>Explanation:</strong> {example.explanation}
            </p>
            <p>
              <strong>Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
          </div>
          <h4 className=" font-semibold text-lg my-3">Constraints :</h4>
          <p style={{ whiteSpace: "pre-line" }}> {constraints}</p>
        </div>
        {/* Right Div */}
        <div
          className="border border-zinc-700 rounded-lg p-4 bg-zinc-800 shadow-md flex flex-col 
                        w-full h-1/2 xl:w-1/2 xl:h-full"
        >
          {/* Code Editor */}
          <div className="flex flex-col gap-2  w-full h-full  bg-zinc-800 rounded-lg shadow-lg">
            <div className="h-[60%] w-full ">
              {/* Language Selector */}
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-800 text-white p-1 rounded-lg w-fit outline-none"
              >
                {Object.keys(LANGUAGES).map((key) => (
                  <option key={key} value={key}>
                    {LANGUAGES[key].name}
                  </option>
                ))}
              </select>
              <Editor
                theme="vs-dark"
                language={language} // Dynamically update the language
                value={code}
                onChange={(value) => setCode(value)} // Update the code state on change
                height="90%"
                width="100%"
              />
            </div>
            <div className="h-[40%] bg-zinc-800 border  border-zinc-700 rounded-lg w-full flex flex-col py-2 px-3">
              <h4 className="text-lg font-semibold w-full mt-4">Output:</h4>
              <p className="p-3 rounded-lg w-full h-full mt-2 overflow-auto">
                {output}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
