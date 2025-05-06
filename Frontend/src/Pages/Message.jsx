import { useState, useContext, useEffect, useRef } from "react";
import { FriendContext } from "../context/FriendContext.jsx";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001");

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { getFriend, friends, friendData, FriendsData } =
  useContext(FriendContext);
  const [userData, setUserData] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedFriend = localStorage.getItem("selectedFriend");
    if (savedFriend) setSelectedFriend(savedFriend); 
  }, []);

  useEffect(() => {
    FriendsData(userData?.id);
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        setUserData(jwt_decode(token));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    if (!selectedFriend) return;
    getFriend(selectedFriend);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/messages/${userData?.id}/${selectedFriend}`
        ); 
        console.log(response.data.messages,"form back ");
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedFriend, userData?.id]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    const roomId = [userData?.id, selectedFriend].sort().join("-");
    socket.emit("joinRoom", roomId);
    return () => socket.emit("leaveRoom", roomId);
  }, [userData?.id, selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      user: userData?.username,
      userImage:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      text: messageInput,
      userId: userData?.id,
      friendID: selectedFriend,
      timestamp: new Date().toISOString(),
    }; 
    socket.emit("sendMessage", newMessage);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="bg-zinc-800 p-4 text-center font-bold text-3xl  border-b-2 border-zinc-900">
        Chat
      </header>
      <div className="flex flex-col md:flex-row flex-grow w-full h-full">
        <aside className="md:w-[35vh] w-full h-64 md:h-auto bg-zinc-800 border-r-2 border-zinc-900 px-3 py-2 overflow-y-auto">
          <h2 className="text-2xl text-purple-600 font-mono font-bold p-3">
            Friends
          </h2>
          {friends?.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                localStorage.setItem("selectedFriend", user._id);
                setSelectedFriend(user._id);
              }}
              className={`flex items-center gap-4 p-3 rounded-lg my-2 cursor-pointer shadow-lg font-mono text-xl font-semibold transition-colors duration-300 ${
                user._id === selectedFriend
                  ? "bg-[#252222]"
                  : "bg-[#2c2c31] hover:bg-[#3a3a40]"
              }`}
            >
              <img
                src="https://tse1.mm.bing.net/th?id=OIP.cqw9RboucGPRvmhX5SXfwgHaHb&pid=Api&P=0&h=180"
                alt={user.username}
                width={35}
                className="border-2 rounded-full"
              />
              <h3>{user.username}</h3>
            </div>
          ))}
        </aside>
        {selectedFriend ? (
          <section className="flex flex-col flex-grow bg-zinc-800 text-zinc-100">
            <header className={`p-3 text-2xl text-purple-600 font-mono font-bold  ${friendData?"border-b border-zinc-700":null}`}>
              {friendData?.username}
            </header>
            <div className="flex-grow overflow-y-auto p-4">
              {messages.length > 0 ? (
                // messages.map((message, index) => (
                //   <div
                //     key={message.id || index}
                //     className={`flex items-start mb-4 ${
                //       message.user === userData?.username
                //         ? "flex-row-reverse"
                //         : "flex-row"
                //     }`}
                //   >
                //     <div className="flex flex-col">
                //       <p
                //         className={`px-4 py-2 rounded-lg text-lg max-w-[50vh] border-2 ${
                //           message.user !== userData?.username
                //             ? "bg-transparent border-zinc-700"
                //             : "bg-[#495ba3] border-blue-400"
                //         }`}
                //       >
                //         {message.text}
                //       </p>
                //       <p className="text-zinc-500 text-sm px-2 mt-1">
                //         {new Date(message.timestamp).toLocaleTimeString([], {
                //           hour: "2-digit",
                //           minute: "2-digit",
                //         })}
                //       </p>
                //     </div>
                //   </div>
                // ))
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex items-start mb-4 ${
                      message.userId === userData?.id ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="flex flex-col">
                      <p
                        className={`px-4 py-2 rounded-lg text-lg max-w-[50vh] border-2 ${
                          message.userId !== userData?.id
                            ? "bg-transparent border-zinc-700"
                            : "bg-[#495ba3] border-blue-400"
                        }`}
                      >
                        {message.text}
                      </p>
                      <p className="text-zinc-500 text-sm px-2 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center">
                  No messages yet. Start the conversation!
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
            <footer className="p-4 bg-zinc-800 shadow-md flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 bg-zinc-700 border border-zinc-600 text-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </footer>
          </section>
        ) : (
          <div className="text-zinc-700  bg-zinc-800 w-full font-semibold flex justify-center items-center text-7xl ">
          Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
