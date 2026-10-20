import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MatchCard from '@/components/MatchCard';
import useRiotApi from '@/hooks/useRiotApi';

export default function StatsPage() {
    const { name, tag } = useParams<{ name: string; tag: string }>();
    const navigate = useNavigate();

    const { playerData, gameVersion, isLoading, error, fetchPlayerStats } = useRiotApi();

    useEffect(() => {
        if (name && tag) {
            fetchPlayerStats(name, tag);
        }
    }, [name, tag, fetchPlayerStats]);

    const handleMatchClick = (matchId: string) => {
        navigate(`/match/${matchId}`);
    };

    return (
        <div className="content-wrapper">
            <main className="main-feed">
                {isLoading && <p style={{ color: '#00BBA3' }}>Завантаження даних...</p>}
                {error && <p style={{ color: '#E84057' }}>{error}</p>}

                {!isLoading && !error && playerData && (
                    <section className="match-list">
                        {playerData.map((match) => (
                            <MatchCard
                                key={match.matchId}
                                match={match}
                                version={gameVersion}
                                onClick={() => handleMatchClick(match.matchId)}
                                isFlipped={false}
                                name={name}
                                tag={tag}
                            />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
