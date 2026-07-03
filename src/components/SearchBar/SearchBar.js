import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="searchContainer">
      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Пошук гравця (Faker#KR1)..." 
        className="searchInput"
      />
      <button type="submit" className="searchButton" aria-label="Шукати">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="searchIcon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;