import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from '../components/MatchCard/MatchCard';
import useRiotApi from '../hooks/useRiotApi';

export default function StatsPage() {
    const { name, tag } = useParams();
    const { playerData, isLoading, error, fetchPlayerStats } = useRiotApi();

    useEffect(() => {
        if (name && tag) {
            fetchPlayerStats(name, tag);
        }
    }, [name, tag, fetchPlayerStats]);

    return(
        <div className="content-wrapper">
            <main className="main-feed">
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
                            item0={match.item0}
                            item1={match.item1}
                            item2={match.item2}
                            item3={match.item3}
                            item4={match.item4}
                            item5={match.item5}
                            trinket={match.trinket}
                            />
                        ))}
                    </section>
                )}
            </main>
      </div>
    )
}