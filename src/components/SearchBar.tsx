import { useState, SyntheticEvent, ChangeEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

function SearchBar({
    onSearch,
    placeholder = 'Пошук гравця (Faker#KR1)...',
    disabled = false,
}: SearchBarProps) {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="searchContainer">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className="searchInput"
            />
            <button type="submit" className="searchButton" aria-label="Шукати">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="searchIcon"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </form>
    );
}

export default SearchBar;
