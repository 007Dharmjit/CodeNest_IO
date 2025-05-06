import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const FriendContext = createContext();

const FriendContextProvider = ({ children }) => {
  const [logedinUser, setLogedinUser] = useState();
  const [friends, setFriends] = useState([]);
  const [friendData, setfriendData] = useState([]);
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);

  const getFriend = async (friendId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/${friendId}`
      );

      setfriendData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchUserDetail = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setLogedinUser(decoded);
        const filteredFromRequests = decoded.requests
          .filter((request) => request.from !== decoded.id)
          .map((request) => request.from);
        setUserRequests(filteredFromRequests);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const fetchUsers = async () => {
    if (logedinUser?.email) {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/users/fetch-users",
          {
            params: {
              useremail: logedinUser.email,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    } else {
      console.log("No user found.");
    }
  };

  const handleRejectRequest = async (requestedUserId) => {
    try {
      setUserRequests((prevRequests) =>
        prevRequests.filter((userId) => userId !== requestedUserId)
      );

      const response = await axios.post(
        "http://localhost:3001/api/users/reject-request",
        {
          fromId: requestedUserId,
          toId: logedinUser.id,
        }
      );

      if (response.status === 200) {
        // Update the token and fetch fresh user details
        localStorage.setItem("authToken", response.data.token);
        fetchUserDetail();
        toast.success("Request rejected successfully.", {
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
    } catch (error) {
      toast.success(error, "Error rejecting friend request", {
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
  };
  const handleAcceptRequest = async (requestedUserId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/accept-request",
        {
          fromId: requestedUserId,
          toId: logedinUser.id,
        }
      );

      if (response.status === 200) {
        // Update token in local storage
        localStorage.setItem("authToken", response.data.token);
        // Fetch updated user details to sync state
        fetchUserDetail();
        toast.success("Request accepted successfully.", {
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
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.", {
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
  };
  const handleRequest = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/send-request",
        {
          fromId: logedinUser.id,
          toId: id,
        }
      );
      if (response.status === 200) {
        fetchUserDetail();
        setSentRequests((prev) => [...prev, id]);
        toast.success(
          `Friend request sent to ${users.find((u) => u._id === id).username}!`,
          {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Friend request already sent.", {
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
        toast.error(error.message, {
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
    }
  };
  const FriendsData = async (userID) => {
    if (!userID) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/get-friends?userID=${userID}`
      );
      setFriends(response.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

 
  useEffect(() => {
    if (logedinUser?.email) {
      fetchUsers();
    }
  }, [logedinUser]);

  return (
    <FriendContext.Provider
      value={{
        logedinUser,
        users,
        handleRequest,
        friends,
        sentRequests,
        fetchUsers,
        userRequests,
        fetchUserDetail,
        friendData,
        handleRejectRequest,
        setSentRequests,
        handleAcceptRequest,
        FriendsData,
        getFriend,
      
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

FriendContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FriendContextProvider;
