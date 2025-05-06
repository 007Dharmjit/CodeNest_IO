import { useEffect, useState } from "react";
import problemData from "../data/ProblemsData.json";
import { useAuth } from "../context/AuthContext";
import { FaComment } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";

const Problemset = () => {
  const { userData, getAllProblems, allProblems } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [iscomment, setIsComment] = useState(false);
  // const [solvedID, setSolvedId] = useState([]);
  const problemsPerPage = 20;
  useEffect(() => {
    getAllProblems();
    userData?.solvedproblems?.some((solved) => console.log(solved.problemId));
    console.log(allProblems, userData);
  }, []);

  // Filter problems based on the search query and selected difficulty
  const filteredProblems = problemData.filter((problem) => {
    const matchesQuery = problem.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "All" || problem.level === filterLevel;
    return matchesQuery && matchesLevel;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const paginatedProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage
  );

  const getLevelColor = (level) => {
    if (level === "Hard") return "text-red-500";
    if (level === "Medium") return "text-yellow-500";
    if (level === "Easy") return "text-sky-500";
    return "";
  };

  return (
    <div className="bg-zinc-800 flex items-center justify-center flex-col">
      <div className="max-w-[900px] w-[900px]">
        <h1 className="text-3xl my-3 font-semibold text-amber-400">
          Problem List
        </h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            className="bg-transparent text-white border-2 rounded-md outline-none flex-1 p-2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filterLevel}
            className="bg-zinc-800 p-2 border-2 rounded-md"
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <table className="w-full border-collapse border-transparent">
          <thead>
            <tr className="text-left border-b-2 border-zinc-600">
              <th className="p-2">Status</th>
              <th className="p-2">Title</th>
              <th className="p-2">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.map((problem) => (
              <tr
                key={problem.id}
                className="even:bg-[#343438] odd:bg-zinc-800 border-none"
              >
                <td className="p-2">
                  {" "}
                  {userData?.solvedproblems?.some(
                    (solved) => Number(solved.problemId) === Number(problem.id)
                  ) ? (
                    <GiCheckMark size={20} className="text-blue-500" />
                  ) : (
                    ""
                  )}
                </td>
                <td className="p-2">
                  <a
                    href={`/problemset/${problem.title
                      .split(" ")
                      .join("-")}/description`}
                    className="hover:text-blue-600 font-normal"
                  >
                    {problem.id}. {problem.title}
                  </a>
                </td>
                <td className={`p-2 ${getLevelColor(problem.level)}`}>
                  {problem.level}
                </td>
              </tr>
            ))}
            {filteredProblems.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1
                  ? "bg-amber-400 text-black"
                  : "bg-zinc-700 text-white"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {/* User Uploaded Problems Section */}
      <div className="max-w-[900px] w-full mt-8 px-4">
        <h2 className="text-2xl text-white mb-4">User Uploaded Problems</h2>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            selectedImage ? "blur-sm" : ""
          }`}
        >
          {allProblems.map((problem) => (
            <div key={problem._id} className="bg-zinc-700 p-4 w-fit rounded-lg">
              <div className="flex flex-wrap gap-2">
                {problem.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mb-2 cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Title : {problem.name}
              </h2>
              <p className="text-gray-400 text-lg">
                Uploaded by : {problem.uploadedByuser}
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Description : {problem.description}
              </p>
              <button
                onClick={() => {
                  setIsComment(!iscomment);
                }}
                className=" my-2 font-semibold text-blue-500 flex gap-3 items-center cursor-pointer"
              >
                Add Comment
                <FaComment size={20} />
              </button>
              <div
                className={`${
                  iscomment ? null : "hidden"
                } h-52 border border-zinc-800 p-2 rounded`}
              >
                <form action="" className=" text-lg">
                  <input
                    type="text"
                    placeholder="Add Comment"
                    className=" bg-transparent border   border-zinc-900 outline-none px-2  rounded"
                  />
                  <button className=" mx-2 px-2 border-2 rounded bg-emerald-800 hover:bg-transparent border-emerald-800 ">
                    Add
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Image Preview */}
        {selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-md px-4">
            <div className="relative bg-transparent p-2 rounded-lg">
              <img
                src={selectedImage}
                className="w-80 h-80 object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 m-2"
                onClick={() => setSelectedImage(null)}
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problemset;
