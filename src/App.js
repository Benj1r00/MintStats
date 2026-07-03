import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import MatchCard from './components/MatchCard/MatchCard';
import useRiotApi from './hooks/useRiotApi';

function App() {
  const { playerData, isLoading, error, fetchPlayerStats } = useRiotApi();
  const [currentPlayer, setCurrentPlayer] = useState('');

  const handlePlayerSearch = (inputValue) => {
    const [name, tag] = inputValue.split('#');
    if (name && tag) {
      setCurrentPlayer(name);
      fetchPlayerStats(name, tag);
    } else {
      alert("Помилка: Введіть Riot ID у правильному форматі, наприклад: Faker#KR1");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-placeholder">MintStat</div>
        <SearchBar onSearch={handlePlayerSearch} />
      </header>

      <div className="content-wrapper">
        <main className="main-feed">
          <section className="player-summary">
            <h2>{currentPlayer ? `Останні ігри: ${currentPlayer}` : 'Пошук гравця'}</h2>
          </section>

          {isLoading && <p style={{color: '#00BBA3'}}>Завантаження даних...</p>}
          {error && <p style={{color: '#E84057'}}>{error}</p>}
          {!isLoading && !error && playerData && (
            <section className="match-list">
              {playerData.map((match) => (
                <MatchCard 
                  key={match.matchId}
                  isWin={match.isWin}
                  champion={match.champion}
                  kills={match.kills}
                  deaths={match.deaths}
                  assists={match.assists}
                  cripStat={match.cripStat}
                  gameDurationSeconds={match.gameDurationSeconds} 
                  spell1Name={match.spell1Name}
                  spell2Name={match.spell2Name}
                  primaryRuneId={match.primaryRuneId}
                  secondaryStyleId={match.secondaryStyleId}
                />
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;