// SearchBox.js
import React from 'react';
import './SearchBox.scss';
import search_btn from "../../assets/search_icon.png";

const SearchBox = ({ inputValue, handleInputChange, onSearch }) => {
  return (
    <div className='search-box'>
      <input 
        type="text" 
        id="input-box" 
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />
      <button onClick={onSearch}>
        <img src={search_btn} alt="search"/>
      </button>
    </div>
  );
};

export default SearchBox;
