import { useState, useContext, useEffect } from "react";
import FriendCard from "../components/FriendCard";
import SearchBar from "../components/SearchBar";
import { FriendContext } from "../context/FriendContext.jsx";
import { useAuth } from "../context/AuthContext";
const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    users,
    sentRequests,
    userRequests,
    handleRejectRequest,
    handleAcceptRequest,
    fetchUserDetail,
    setSentRequests,
    handleRequest,
  } = useContext(FriendContext);
  const { userData } = useAuth();
  const handleAddFriend = (id) => {
    if (!sentRequests.includes(id)) {
      const selectedFriend = users.find((f) => f._id === id);
      if (selectedFriend) {
        setSentRequests((prevRequests) => [...prevRequests, selectedFriend._id]);
        handleRequest(selectedFriend._id);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const filteredFriends = users.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const requestedUsers = users.filter((user) =>
    userRequests.includes(user._id)
  );

  return (
   
      <div className="bg-gray-900 min-h-screen p-6">
         {userData ? (
        <>
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-100">Add Friends</h1>
            <p className="text-gray-400">
              Search for friends and send requests
            </p>
          </header>

          <div className="mb-6">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <section>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Friend Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    name={friend.username}
                    email={friend.email}
                    isRequestSent={sentRequests.includes(friend._id)}
                    onAddFriend={() => handleAddFriend(friend._id)}
                  />
                ))
              ) : (
                <p className="text-gray-400">No friends found.</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Friend Requests
            </h2>
            {requestedUsers.length > 0 ? (
              requestedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg mb-4"
                >
                  <div>
                    <h3 className="text-lg text-gray-100">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(user._id)}
                      className="px-4 py-2 bg-green-600 text-gray-100 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(user._id)}
                      className="px-4 py-2 bg-red-600 text-gray-100 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No friend requests.</p>
            )}
          </section>
        </div> </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-3xl font-bold text-gray-400">Please Login</h2>
        </div>
      )}
      </div>
   
  );
};

export default AddFriends;
