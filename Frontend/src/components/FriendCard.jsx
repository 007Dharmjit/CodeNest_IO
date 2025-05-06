// import React from "react";
import PropTypes from "prop-types";

const FriendCard = ({ name, email, isRequestSent, onAddFriend }) => {
  return ( <>
    <div  className="p-4 border rounded-lg bg-gray-800 border-gray-700 flex items-center justify-between">
    <div className="flex items-center">
      <img
        src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737209112~exp=1737212712~hmac=4fdcc7726126f5dce10a263cab39c96a8c073505ba74ae9549fa4fe7be243a89&w=740"
        alt="User Avatar"
        className="w-12 h-12 rounded-full"
      />
      <div className="ml-4">
        <h3 className="font-medium text-gray-100">{name}</h3>
        <p className="text-sm text-gray-400">
          {email}
        </p>  
      </div>
    </div>
      <button
        onClick={onAddFriend}
        disabled={isRequestSent} // Disable button if request is sent
        className={`mt-4 px-4 py-2 rounded ${
          isRequestSent
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isRequestSent ? "Request Sent" : "Add Friend"}
      </button>
    </div> </>
  );
};

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isRequestSent: PropTypes.bool.isRequired,
  onAddFriend: PropTypes.func.isRequired,
};

export default FriendCard;
