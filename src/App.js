import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import StatsPage from './pages/StatsPage'; 
import ErrorPage from './pages/ErrorPage';
import FullGameStatsPage from './pages/FullGameStatsPage';

export default function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<HomePage />}> 
          <Route path="/:name/:tag" element={<StatsPage />} /> {/* сторінка з статистикою останніх матчів */}
          <Route path="match/:matchId" element={<FullGameStatsPage />} /> {/* детальна статичтика гравців за 1 матч */}
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}