import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage/HomePage';
import StatsPage from '@/pages/StatsPage/StatsPage';
import ErrorPage from '@/pages/ErrorPage/ErrorPage';
import FullGameStatsPage from '@/pages/FullGameStatsPage/FullGameStatsPage';

export default function App() {
    return (
        <div className="app-layout">
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route path="/:name/:tag" element={<StatsPage />} />
                    <Route path="match/:id" element={<FullGameStatsPage />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}
