import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handlePlayerSearch = (inputValue) => {
        const [name, tag] = inputValue.split('#');
        if (name && tag) {
            navigate(`/${name}/${tag}`);
        } else {
            alert("Помилка: Введіть Riot ID у правильному форматі, наприклад: Faker#KR1");
        }
    };

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="logo">MintStat🍃</div>
        
        <div className="header-search">
          <SearchBar onSearch={handlePlayerSearch} />
        </div>    

        <div className="header-spacer"></div> 
      </header>

      <main className="main-content">
        
        {location.pathname === '/' && (
          <section className="welcome-message">
            <h2>Ласкаво просимо до MintStat ^-^</h2>
          </section>
        )}

        <Outlet /> 
        
      </main>
    </div>
  );
}