import axios from "axios";

const API = axios.create({
  baseURL: " https://emkc.org/api/v2/piston",
});
const executeCode = async (languageDATA, sourceCode) => { 
  const response = await API.post("/execute", {
    language: languageDATA.Language,
    version: languageDATA.Version,
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};

export default executeCode;
