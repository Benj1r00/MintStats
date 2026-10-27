import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hook';
import MatchCard from '@/components/MatchCard';
import { FetchPlayerStatsData } from '@/hooks/useRiotApi';
import { SUMMONER_SPELLS } from '@/constants/riotData';
import './FullGameStatsPage.css';

export default function FullGameStatsPage() {
    const { id: matchId } = useParams<{ id: string }>();

    const matchData = useAppSelector((state) => state.player.matches.find((m) => m.matchId === matchId));

    const [championMap, setChampionMap] = useState<Record<string, string>>({});
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        const fetchVersionAndChampions = async () => {
            try {
                const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
                const versions = await versionRes.json();
                const latestVersion = versions[0];
                setVersion(latestVersion);

                const championRes = await fetch(
                    `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
                );
                const championData = await championRes.json();

                const champions = championData.data;
                const newChampionMap: Record<string, string> = {};

                for (const champName in champions) {
                    const champId = champions[champName].key;
                    newChampionMap[champId] = champName;
                }

                setChampionMap(newChampionMap);
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            }
        };

        fetchVersionAndChampions();
    }, []);

    if (!matchData || !matchData.fullGameDetails) {
        return (
            <div className="error-container" style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
                <h2>Дані матчу не знайдено 😢</h2>
                <p>Схоже, дані були очищені або ви перейшли за неправильним посиланням.</p>
                <Link to="/" style={{ color: '#00BBA3', textDecoration: 'underline' }}>
                    Повернутися на головну для пошуку
                </Link>
            </div>
        );
    }

    const matchDetails = matchData.fullGameDetails;

    const bannedChampionIds = matchDetails.teamsStats.flatMap((team: any) =>
        team.bans ? team.bans.map((ban: any) => ban.championId) : []
    );

    const mapPlayerToCard = (player: any): FetchPlayerStatsData => ({
        matchId: matchData.matchId || '',
        champion: player.championName,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        damage: player.totalDamageDealtToChampions,
        isWin: player.win,
        championLevel: player.champLevel,
        gameMode: matchData.gameMode || '',
        cripStat: player.totalMinionsKilled + player.neutralMinionsKilled,
        gameTime: player.timePlayed,
        spell1Name: SUMMONER_SPELLS[player.summoner1Id] || 'SummonerFlash',
        spell2Name: SUMMONER_SPELLS[player.summoner2Id] || 'SummonerDot',
        primaryRuneId: player.perks?.styles[0]?.selections[0]?.perk || 8010,
        secondaryStyleId: player.perks?.styles[1]?.style || 8000,
        item0: player.item0,
        item1: player.item1,
        item2: player.item2,
        item3: player.item3,
        item4: player.item4,
        item5: player.item5,
        trinket: player.item6,
        fullGameDetails: matchDetails,
    });

    return (
        <div style={{ color: 'white' }}>
            <div className="match-header">
                <p className="match-time">
                    Тривалість: {Math.floor(matchDetails.gameDurationSeconds / 60)}:
                    {String(matchDetails.gameDurationSeconds % 60).padStart(2, '0')} хв.
                </p>
            </div>

            <div className="teams-matrix-container">
                <div className="team-column">
                    <h3 style={{ color: '#5B9BD5' }}>Синя команда</h3>
                    <ul className="team-list">
                        {matchDetails.team100.map((player: any) => (
                            <MatchCard
                                key={player.puuid}
                                match={mapPlayerToCard(player)}
                                version={version || '14.1.1'}
                                name={player.riotIdGameName}
                                tag={player.riotIdTagline}
                                isFlipped={false}
                            />
                        ))}
                    </ul>
                </div>

                <div className="team-column">
                    <h3 style={{ textAlign: 'right', color: '#E06C75' }}>Червона команда</h3>
                    <ul className="team-list">
                        {matchDetails.team200.map((player: any) => (
                            <MatchCard
                                key={player.puuid}
                                match={mapPlayerToCard(player)}
                                version={version || '14.1.1'}
                                name={player.riotIdGameName}
                                tag={player.riotIdTagline}
                                isFlipped={true}
                            />
                        ))}
                    </ul>
                </div>
            </div>

            <div className="circles-container">
                {bannedChampionIds.map((championId: number | string, index: number) => {
                    const isNoBan = championId === -1 || championId === '-1';
                    return isNoBan ? (
                        <div
                            key={index}
                            className="crossed-circle"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        ></div>
                    ) : (
                        <div key={index} className="crossed-circle">
                            {version && championMap[championId] && (
                                <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championMap[championId]}.png`}
                                    alt={championMap[championId]}
                                    title={championMap[championId]}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
