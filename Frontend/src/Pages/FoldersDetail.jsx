import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFile } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import gsap from "gsap";
const FoldersDetail = () => {
  const {
    userData,
    files,
    deleteFolder,
    fetchFolders,
    folders,
    folderName,
    setFolderName,
    CreateFol,
    setFileData,
  } = useAuth();
  const folderRef = useRef(null);

  useEffect(() => {
    // Guard: if folderRef.current is not available, do nothing
    if (!folderRef.current) return;

    // Create a GSAP context with the DOM node as scope
    const ctx = gsap.context(() => {
      // Now that we know folderRef.current exists, grab its children
      const items = gsap.utils.toArray(folderRef.current.children);
      gsap.fromTo(
        items,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.4, ease: "power2.out" }
      );
    }, folderRef.current);

    return () => ctx.revert();
  }, [folders]); // If folders change, re-run the effect
  useEffect(() => {
    if (userData?.id) {
      fetchFolders();
    }
  }, [userData]);

  // Function to handle clicks outside the menu
  const handleClickOutside = (e) => {
    if (!e.target.closest(".hello")) {
      setOpenFolderMenuId(null);
      setOpenMenuId(null);
    }
  };

  // Add event listener when component mounts and remove when it unmounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const [openFolderMenuId, setOpenFolderMenuId] = useState(null);

  const showFiles = (folderId) => {
    setFileData(folderId);
    setOpenFolderMenuId(openFolderMenuId === folderId ? null : folderId);
  };
  const toggleMenu = (folderId) => {
    setOpenMenuId(openMenuId === folderId ? null : folderId);
  };

  return (
    <div className=" w-full h-full overflow-auto">
      <div className="min-h-screen bg-zinc-900 text-zinc-200">
        {userData ? (
          <>
            {/* Header */}
            <header className="bg-zin p-6 text-white">
              <h1 className="text-3xl font-bold ">
                Welcome, {userData.username}! 👋
              </h1>
            </header>

            {/* Create Folder Section */}
            <div
              className={`mx-auto mt-10 max-w-[60vh] bg-zinc-800 p-6 rounded-lg shadow-md ${
                openFolderMenuId ? "blur-sm" : "blur-none"
              }`}
            >
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Create Folder
              </h2>
              <form onSubmit={CreateFol} className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-zinc-300">
                    Folder Name
                  </label>
                  <input
                    required
                    onChange={(e) => setFolderName(e.target.value)}
                    value={folderName}
                    type="text"
                    className="w-full mt-2 p-2 border-2 border-purple-600 rounded-md bg-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
                >
                  Create Folder
                </button>
              </form>
            </div>

            {/* Folders Section */}
            <div className="mx-auto mt-10 w-full px-6">
              {folders.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <h2 className="text-2xl font-bold text-zinc-400">
                    No folders to display 😔
                  </h2>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                    Your Folders
                  </h2>

                  <div
                    ref={folderRef}
                    className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6"
                  >
                    {folders.map((folder) => (
                      <div
                        key={folder._id}
                        className="hello py-4 px-2 w-fit  flex flex-row"
                      >
                        <div className="flex items-center justify-between flex-col cursor-pointer">
                          <FaFolder
                            size={120}
                            color="#1f2937"
                            onClick={() => showFiles(folder._id)}
                          />

                          {/* </Link> */}
                          <span className="text-lg text-[#9fa6b2] font-medium">
                            {folder.folderName}
                          </span>
                        </div>

                        <div className="relative inline-block">
                          <button
                            onClick={() => toggleMenu(folder._id)}
                            className="p-2 rounded-full hover:bg-zinc-800"
                          >
                            <HiOutlineDotsVertical size={20} color="#475262" />
                          </button>
                          {openMenuId === folder._id && (
                            <div className=" hello -translate-y-20 translate-x-4 absolute right-0 mt-2 w-40 bg-zinc-800  text-white rounded-lg shadow-lg">
                              <ul className="p-2 space-y-2">
                                <Link
                                  to={`/Editor?folderId=${folder._id}&folderName=${folder.folderName}`}
                                >
                                  <li className="px-4 py-2 hover:bg-zinc-700 hover:text-blue-500 cursor-pointer">
                                    Open
                                  </li>
                                </Link>
                                <li className="px-4 py-2 hover:bg-zinc-700 hover:text-yellow-500 cursor-pointer">
                                  Rename
                                </li>
                                <li
                                  onClick={() =>
                                    deleteFolder(folder._id, folder.userId)
                                  }
                                  className="px-4 py-2 hover:bg-zinc-700 hover:text-red-500 cursor-pointer flex flex-row gap-2"
                                >
                                  {" "}
                                  Delete
                                </li>
                                <li className="px-4 py-2 hover:bg-zinc-700  hover:text-green-500 cursor-pointer">
                                  Create File
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h2 className="text-3xl font-bold text-zinc-400">Please Login</h2>
          </div>
        )}
      </div>
      {openFolderMenuId ? (
        <>
          <div className="hello z-10 border-2 border-zinc-800 top-[50%] left-40  w-fit h-fit rounded-lg py-3 px-2 absolute">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 ">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index} className="p-2">
                    <h3 key={index} className="cursor-pointer text-white">
                      <FaFile size={58} color="rgb(88 22 131)" />
                      {file}
                    </h3>
                  </div>
                ))
              ) : (
                <h2 className="text-3xl font-bold text-zinc-400">
                  No Files Found Please Create One
                </h2>
              )}{" "}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default FoldersDetail;
