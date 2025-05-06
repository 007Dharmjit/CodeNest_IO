// import React from "react";
import PropTypes from 'prop-types';

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, username, or email"
      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 border-gray-700 placeholder-gray-400 text-gray-100"
    />
  );
};
SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
// export default SearchBar;
