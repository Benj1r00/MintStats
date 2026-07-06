import { useState, useEffect } from 'react';
import { useLocation,  } from 'react-router-dom';
import MatchCard from '../components/MatchCard/MatchCard';
import "./FullGameStatsPage.css"

export default function FullGameStatsPage() {
    const location = useLocation();

    const matchDetails = location.state?.details;
    const version = location.state?.gameversion;

    const [championMap, setChampionMap] = useState({});

    useEffect(() => {
        const fetchChampionsData = async () => {
            if (!version) return;
            try {
                const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
                const data = await response.json();
                
                const champions = data.data;
                const newChampionMap = {};

                for (const champName in champions) {
                    const champId = champions[champName].key;
                    newChampionMap[champId] = champName;
                }

                setChampionMap(newChampionMap);
            } catch (error) {
                console.error("Помилка завантаження даних чемпіонів:", error);
            }
        };

        fetchChampionsData();
    }, [version]); 

    const bannedChampionIds = [];

    matchDetails.teamsStats.forEach(team => {
        if (team.bans && team.bans.length > 0) {
            team.bans.forEach(ban => {
                bannedChampionIds.push(ban.championId);
            });
        }
    });

    const summonerSpells = {
        1: "SummonerBoost",   // Cleanse
        3: "SummonerExhaust", // Exhaust
        4: "SummonerFlash",   // Flash
        6: "SummonerHaste",   // Ghost
        7: "SummonerHeal",    // Heal
        11: "SummonerSmite",  // Smite
        12: "SummonerTeleport",// Teleport
        14: "SummonerDot",    // Ignite
        21: "SummonerBarrier" // Barrier
    };

    const secondaryStyles = {
        8000: "Precision_icon",   // Точність
        8100: "Domination_icon",  // Домінування
        8200: "Sorcery_icon",     // Чаклунство
        8300: "Inspiration_icon", // Натхнення
        8400: "Resolve_icon"      // Хоробрість
    };

    const primaryRunes = {
        8005: "104px-Press_the_Attack_rune",
        8008: "104px-Lethal_Tempo_rune",
        8021: "104px-Fleet_Footwork_rune",
        8010: "104px-Conqueror_rune",
        8112: "104px-Electrocute_rune",
        8124: "104px-Predator_rune",
        8128: "104px-Dark_Harvest_rune",
        8106: "104px-Hail_of_Blades_rune",
        8214: "104px-Summon_Aery_rune",
        8229: "104px-Arcane_Comet_rune",
        8230: "104px-Phase_Rush_rune",
        8437: "104px-Grasp_of_the_Undying_rune",
        8439: "104px-Aftershock_rune",
        8465: "104px-Guardian_rune",
        8351: "104px-Glacial_Augment_rune",
        8360: "104px-Unsealed_Spellbook_rune",
        8369: "104px-First_Strike_rune"
    };

    if (!matchDetails) {
        return <p className='error-message'>Дані матчу не знайдено (можливо, сторінка була оновлена напряму).</p>;
    }

    return (
        <div style={{ color: 'white' }}>
            <div className="match-header">
                <p className='match-time'>Тривалість: {+(`${Math.floor(matchDetails.gameDurationSeconds / 60)}.${matchDetails.gameDurationSeconds % 60}`)} хв.</p>
            </div>  
            <div className="teams-matrix-container">
                <div className="team-column">
                    <h3>Синя команда</h3>
                    <ul className="team-list">
                        {matchDetails.team100.map((player) => (
                            <MatchCard 
                                key={player.puuid}
                                isWin={player.win}
                                version={version}
                                champion={player.championName}
                                kills={player.kills}
                                deaths={player.deaths}
                                assists={player.assists}
                                cripStat={player.totalMinionsKilled + player.neutralMinionsKilled}
                                championLevel={player.champLevel} 
                                gameDurationSeconds={player.timePlayed}
                                spell1Name={summonerSpells[player.summoner1Id] || "SummonerFlash"}
                                spell2Name={summonerSpells[player.summoner2Id] || "SummonerDot"}
                                primaryRuneId={primaryRunes[player.perks.styles[0].selections[0].perk] || "104px-Conqueror_rune"}
                                secondaryStyleId={secondaryStyles[player.perks.styles[1].style] || "Precision_icon"}
                                item0={player.item0} item1={player.item1} item2={player.item2}
                                item3={player.item3} item4={player.item4} item5={player.item5}
                                trinket={player.item6}
                                name={player.riotIdGameName} tag={player.riotIdTagline}
                                flippedcss={false} 
                            />
                        ))}
                    </ul>
                </div>
                
                <div className="team-column">
                    <h3 style={{ textAlign: "right" }}>Червона команда</h3>
                    <ul className="team-list">
                        {matchDetails.team200.map((player) => (
                            <MatchCard 
                                key={player.puuid}
                                isWin={player.win}
                                version={version}
                                champion={player.championName}
                                kills={player.kills}
                                deaths={player.deaths}
                                assists={player.assists}
                                cripStat={player.totalMinionsKilled + player.neutralMinionsKilled} 
                                championLevel={player.champLevel} 
                                gameDurationSeconds={player.timePlayed} 
                                spell1Name={summonerSpells[player.summoner1Id] || "SummonerFlash"}
                                spell2Name={summonerSpells[player.summoner2Id] || "SummonerDot"}
                                primaryRuneId={primaryRunes[player.perks.styles[0].selections[0].perk] || "104px-Conqueror_rune"}
                                secondaryStyleId={secondaryStyles[player.perks.styles[1].style] || "Precision_icon"}
                                item0={player.item0} item1={player.item1} item2={player.item2}
                                item3={player.item3} item4={player.item4} item5={player.item5}
                                trinket={player.item6}
                                name={player.riotIdGameName} tag={player.riotIdTagline}
                                flippedcss={true} 
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="circles-container">
                {bannedChampionIds.map((championId, index) => ( 
                    championId === -1 || championId === "-1" ? (
                        
                        <div 
                            key={index} 
                            className="crossed-circle" 
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        ></div>
                        
                    ) : (
                    
                        <img 
                            key={index} 
                            className="crossed-circle" 
                            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championMap[championId]}.png`} 
                            alt={championMap[championId] || "Unknown"} 
                            title={championMap[championId]}
                        />
                        
                    )
                ))}
            </div>
        </div>
    );
}