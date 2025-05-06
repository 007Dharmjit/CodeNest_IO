import { useEffect, useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FriendContext } from "../context/FriendContext.jsx";
import { BsFillSendFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
const AccountPage = () => {
  const {
    fetchFolders,
    userData,
    folders,
    setUserData,
    deleteFolder,
    getUserPrroblem,
    myProblems,
  } = useAuth();
  const { FriendsData, friends } = useContext(FriendContext);
  const navigate = useNavigate();
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAllProblems, setShowAllProblems] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openRenameId, setOpenRenameId] = useState(null);
  const [userName, setUserName] = useState("");
  const [bioData, setBioData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview
  };
  // Handle acoount update upload
  const handleUpload = async () => {
    if (!selectedImage && !userName && !bioData)
      return alert("Please Add data ");

    const formData = new FormData();
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    if (userName) {
      formData.append("userName", userName);
    }

    if (bioData) {
      formData.append("bioData", bioData);
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/update-profile/${userData?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.removeItem("authToken");
        localStorage.setItem("authToken", data.token);

        // Update user data context/state with new profile image from the user object.
        setUserData((prevUserData) => ({
          ...prevUserData,
          profileImage: data.user.profileImage,
          username: data.user.username,
          bio: data.user.bio,
        }));
        setPreview(null);
        toast.success("Data uploaded successfully!!", {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        toast.error("Upload failed!", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error, "Error uploading image. Please try again.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  // If not showing all, only display the first 4 folders
  const displayedFolders = showAllFolders ? folders : folders.slice(0, 4);
  // Dummy problems array for demonstration purposes.
  const problems = [
    { _id: "p1", text: "Problem 1" },
    { _id: "p2", text: "Problem 2" },
    { _id: "p3", text: "Problem 3" },
    { _id: "p4", text: "Problem 4" },
    { _id: "p5", text: "Problem 5" },
  ];
  const displayedProblems = showAllProblems ? problems : problems.slice(0, 4);
  const displayedFriends = showAllFriends ? friends : friends.slice(0, 3);

  const [newFolderName, setNewFolderName] = useState(""); // Add state for input

  const handleRename = async (folderId) => {
    if (!newFolderName.trim()) return; // Prevent empty rename

    try {
      const response = await axios.put(
        `http://localhost:3001/api/Folder/rename/${folderId}`,
        {
          folderName: newFolderName,
        }
      );

      if (response.status === 200) {
        // Update the folders state after renaming
        fetchFolders(); // Refetch folders to reflect changes
        setOpenRenameId(null); // Close input field
        setNewFolderName(""); // Reset input
      }
    } catch (error) {
      console.error("Failed to rename folder", error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      getUserPrroblem(userData.id);
      fetchFolders(); // Fetch folders when userData is available
      FriendsData(userData.id);
    }
  }, [userData]);

  const sendMessage = (friendID) => {
    if (friendID) {
      localStorage.setItem("selectedFriend", friendID);
    }
    navigate(`/MessagePage`);
  };
  // Toggle dropdown for a given folder
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };
  const openRename = (id) => {
    setOpenMenuId(null);
    setOpenRenameId((prev) => (prev === id ? null : id));
  };
  // Close the dropdown if clicking outside the dropdown or Edit button
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".edit-button") &&
        !e.target.closest(".inputshow")
      ) {
        setOpenMenuId(null);
        setOpenRenameId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900  py-2 ">
      {userData ? (
        <>
          {/* Profile Section */}
          <div className="max-w-4xl mx-auto p-6 bg-transparent rounded-md border-gray-700  border-2 shadow-md">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={
                    preview ||
                    userData?.profileImage ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737209112~exp=1737212712~hmac=4fdcc7726126f5dce10a263cab39c96a8c073505ba74ae9549fa4fe7be243a89&w=740"
                  }
                  alt="Profile"
                  className="w-20 h-20 bg-zinc-700 rounded-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl text-purple-500 font-bold">
                  {userData.username}
                </h1>
                <p className="text-purple-500 "> {userData.email}</p>
                <p className="mt-1">
                  {userData.bio
                    ? userData.bio
                    : "Short bio about the user...111"}
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center justify-end ">
              <p
                className=" flex items-center gap-2 text-blue-500   cursor-pointer"
                onClick={() => {
                  setBioData("");
                  setUserName("");
                  setSelectedImage(null);
                  setShowEditProfile(!showEditProfile);
                }}
              >
                Edit Profile <MdEdit />
              </p>
            </div>
          </div>
          {/* Edit Profile section */}
          <div className=" flex justify-center items-center ">
            {showEditProfile ? (
              <>
                <div className=" absolute z-10 translate-y-2  bg-zinc-800  w-fit py-3 rounded-lg h-fit">
                  <div className=" flex justify-end font-bold text-zinc-500 px-2">
                    <RxCross2
                      size={20}
                      className=" cursor-pointer"
                      onClick={() => {
                        setBioData("");
                        setUserName("");
                        setSelectedImage(null);
                        setShowEditProfile(false);
                      }}
                    />
                  </div>
                  <div className=" px-10">
                    <div className=" flex justify-center items-center flex-col gap-2">
                      <label
                        htmlFor="profileImageInput"
                        className="cursor-pointer "
                      >
                        <img
                          src={
                            preview ||
                            userData?.profileImage ||
                            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737209112~exp=1737212712~hmac=4fdcc7726126f5dce10a263cab39c96a8c073505ba74ae9549fa4fe7be243a89&w=740"
                          }
                          alt="Profile"
                          className="w-20 h-20 hover:opacity-45  bg-zinc-700 rounded-full object-cover"
                        />
                        <p className="  -translate-y-20  absolute text-zinc-400 w-20 h-20 cursor-pointer opacity-0 hover:opacity-100 rounded-full items-center flex justify-center">
                          Change
                        </p>
                      </label>
                      <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden "
                        placeholder="Change"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className=" text-white flex flex-col gap-2">
                      <label>New Username</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                        }}
                        placeholder="Username"
                        className=" bg-transparent outline-none border border-zinc-700 rounded px-2 py-1"
                      />
                      <label>Bio..</label>{" "}
                      <textarea
                        name="message"
                        className=" bg-transparent outline-none border border-zinc-700 rounded px-2 py-1"
                        placeholder="Add Bio.."
                        value={bioData}
                        onChange={(e) => {
                          setBioData(e.target.value);
                        }}
                      ></textarea>
                      {selectedImage || userName || bioData ? (
                        <button
                          onClick={handleUpload}
                          className=" bg-emerald-400 border border-zinc-700 rounded-lg py-2"
                        >
                          Update{" "}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Folder Section */}
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-transparent rounded-md border-2 border-gray-700 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-mono">
              My Folders
            </h2>
            <ul className="space-y-4">
              {folders.length === 0 ? (
                <h2 className="text-2xl text-zinc-700 font-bold">
                  No folders to display
                </h2>
              ) : (
                <>
                  {displayedFolders.map((folder) => (
                    <li
                      key={folder._id}
                      className="flex justify-between text-xl items-center bg-transparent border-2 border-zinc-800 p-4 rounded-md"
                    >
                      <span className="font-semibold">{folder.folderName}</span>
                      <div className="relative inline-block">
                        <button
                          onClick={() => toggleMenu(folder._id)}
                          className={`edit-button ${
                            openMenuId || openRenameId ? "blur-md" : "blur-0"
                          } text-blue-500 hover:underline`}
                        >
                          Edit
                        </button>
                        {openMenuId === folder._id && (
                          <>
                            <div className="dropdown-menu hello -translate-y-20 translate-x-4 absolute right-0 mt-2 w-40 bg-zinc-800 text-white rounded-lg shadow-lg">
                              <ul className="p-2 space-y-2">
                                <Link
                                  to={`/Editor?folderId=${folder._id}&folderName=${folder.folderName}`}
                                >
                                  <li className="px-4 py-2 hover:bg-zinc-700 hover:text-blue-500 cursor-pointer">
                                    Open
                                  </li>
                                </Link>
                                <li
                                  onClick={() => {
                                    openRename(folder._id);
                                  }}
                                  className="px-4 py-2 hover:bg-zinc-700 hover:text-yellow-500 cursor-pointer"
                                >
                                  Rename
                                </li>
                                <li
                                  onClick={() =>
                                    deleteFolder(folder._id, folder.userId)
                                  }
                                  className="px-4 py-2 hover:bg-zinc-700 hover:text-red-500 cursor-pointer flex flex-row gap-2"
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                        {openRenameId === folder._id && (
                          <div className="inputshow absolute -translate-x-52 -translate-y-10 px-2 py-1 bg-transparent w-fit items-center flex">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleRename(folder._id);
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Rename"
                                value={newFolderName}
                                onChange={(e) =>
                                  setNewFolderName(e.target.value)
                                }
                                className="bg-transparent border-2 w-fit border-zinc-800 px-3 py-2 rounded"
                              />
                            </form>
                            <button
                              onClick={() => handleRename(folder._id)}
                              className="absolute translate-x-40 bg-zinc-700 py-1 px-2 rounded-lg"
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
            {folders.length > 4 && (
              <div className="mt-4 text-center">
                {showAllFolders ? (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllFolders(false)}
                  >
                    Less
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllFolders(true)}
                  >
                    More...
                  </button>
                )}
              </div>
            )}
          </div>

          {/* MyProblem Section */}
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-transparent border-gray-700 border-2 rounded-md shadow-md">
            <h1 className="text-2xl my-2 font-semibold font-mono">
              My Problems
            </h1>
            <ul className="space-y-4 my-2">
              {problems.length === 0 ? (
                <h2 className="text-2xl text-zinc-700 font-bold">
                  No problems to display
                </h2>
              ) : (
                <>
                  {myProblems.map((problem) => (
                    <li
                      key={problem._id}
                      className="flex justify-between items-center bg-transparent border-2 text-xl border-zinc-800 p-4 rounded-md"
                    >
                      <span className="font-semibold">{problem.name}</span>
                      <button className="text-red-500">Delete</button>
                    </li>
                  ))}
                  <p className="text-2xl my-2 font-semibold font-mono ">
                    Upload your problems
                  </p>{" "}
                  <Link
                    className=" my-2 bg-zinc-800 hover:border-red-400 text-zinc-400  hover:text-white hover:bg-zinc-900 justify-start items-center gap-2 border-2 border-zinc-700 w-fit px-3 py-2 rounded-lg font-semibold text-lg flex "
                    to={`/${userData.username}/problems`}
                  >
                    Upload
                  </Link>
                </>
              )}
            </ul>
            {myProblems.length > 4 && (
              <div className="mt-4 text-center">
                {showAllProblems ? (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllProblems(false)}
                  >
                    Less
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllProblems(true)}
                  >
                    More...
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Solved Problem */}
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-transparent border-gray-700 border-2 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-mono">
              Solved Problems
            </h2>
            <ul className="space-y-4">
              {problems.length === 0 ? (
                <>
                  <h2 className="text-2xl text-zinc-700 font-bold mb-2">
                    There is&apos;t any probles you have solved.
                  </h2>
                  <Link
                    to="/problemset"
                    className=" text-blue-700 text-2xl shadow-xl bg-zinc-900 hover:bg-zinc-950 border border-zinc-700 px-2 py-1 rounded-md"
                  >
                    See Problems
                  </Link>
                </>
              ) : (
                <>
                  {displayedProblems.map((problem) => (
                    <li
                      key={problem._id}
                      className="flex justify-between items-center bg-transparent border-2 text-xl border-zinc-800 p-4 rounded-md"
                    >
                      <span className="font-semibold">{problem.text}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
            {problems.length > 4 && (
              <div className="mt-4 text-center">
                {showAllProblems ? (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllProblems(false)}
                  >
                    Less
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAllProblems(true)}
                  >
                    More...
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Friend Section */}
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-transparent  border-2 border-gray-700  rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-mono">Friends</h2>
            {friends.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {displayedFriends.map((friend) => (
                    <div key={friend._id} className="flex items-center">
                      <img
                        src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737209112~exp=1737212712~hmac=4fdcc7726126f5dce10a263cab39c96a8c073505ba74ae9549fa4fe7be243a89&w=740"
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-zinc-100">
                          {friend.username}
                        </h3>
                        <p className="text-sm text-zinc-400">{friend.email}</p>
                        {friend.online ? (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-blue-700">Online</h3>
                            <BsFillSendFill
                              className="ml-10 cursor-pointer"
                              size={23}
                              onClick={() => {
                                sendMessage(friend._id, userData.id);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-zinc-700">Offline</h3>
                            <BsFillSendFill
                              className="ml-10 cursor-pointer"
                              size={23}
                              onClick={() => {
                                sendMessage(friend._id);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ul>
                {friends.length > 3 && (
                  <div className="mt-4 text-center">
                    {showAllFriends ? (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setShowAllFriends(false)}
                      >
                        Less
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setShowAllFriends(true)}
                      >
                        More...
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl text-zinc-700 font-bold cursor-default ">
                  No friends .
                </h2>
                <Link
                  to="/addfriends"
                  className=" my-2 bg-zinc-800 hover:border-red-400 text-zinc-400  hover:text-white hover:bg-zinc-900 justify-start items-center gap-2 border-2 border-zinc-700 w-fit px-3 py-2 rounded-lg font-semibold text-lg flex "
                >
                  Add Friends
                  <BsPersonFillAdd />
                </Link>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-3xl font-bold text-zinc-400">Please Login</h2>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
