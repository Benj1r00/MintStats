import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
  return (
    <div className="error-container">
      <h1 className="error-code">404</h1>
      <h2 className="error-title">Упс! Сторінку не знайдено</h2>
      <p className="error-text">
        Схоже, ви зайшли кудись не туди. Можливо, посилання застаріло, або такого Riot ID не існує.
      </p>
      <Link to="/" className="home-button">
        На головну
      </Link>
    </div>
  );
}