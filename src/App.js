import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import StatsPage from './pages/StatsPage'; 
import ErrorPage from './pages/ErrorPage'

export default function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/:name/:tag" element={<StatsPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}