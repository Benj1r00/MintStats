import React from 'react';
import { FetchPlayerStatsData } from '@/hooks/useRiotApi';
import { useRunes } from '@/hooks/useRunes';
import './MatchCard.css';

interface MatchCardProps {
    match: FetchPlayerStatsData;
    version: string;
    name?: string;
    tag?: string;
    isFlipped?: boolean;
    onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, version, name, tag, isFlipped = false, onClick }) => {
    const {
        isWin,
        champion,
        kills,
        deaths,
        assists,
        championLevel,
        cripStat,
        spell1Name,
        spell2Name,
        primaryRuneId,
        secondaryStyleId,
        item0,
        item1,
        item2,
        item3,
        item4,
        item5,
        trinket,
        fullGameDetails: { gameDurationSeconds },
    } = match;

    const championId = champion.toLowerCase() === 'fiddlesticks' ? 'Fiddlesticks' : champion;
    const runes = useRunes(version);

    const primaryPath = runes[primaryRuneId];
    const secondaryPath = runes[secondaryStyleId];
    const pathToChampionImg = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
    const pathToMainRunIdImg = primaryPath ? `https://ddragon.leagueoflegends.com/cdn/img/${primaryPath}` : '';
    const pathTosecondaryRunIdImg = secondaryPath ? `https://ddragon.leagueoflegends.com/cdn/img/${secondaryPath}` : '';
    const spell1ImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell1Name}.png`;
    const spell2ImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell2Name}.png`;

    const getItemUrl = (itemId: number) => `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;

    const kdaRatio = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);

    const durationMinutes = gameDurationSeconds / 60;
    const csPerMin = durationMinutes > 0 ? (cripStat / durationMinutes).toFixed(1) : '0.0';

    const items = [item0, item1, item2, item3, item4, item5];

    return (
        <div
            className={`statsContainer ${isFlipped ? 'flipped' : ''}`}
            style={{ backgroundColor: isWin ? '#1B382B' : '#282a2e' }}
            onClick={onClick}
        >
            <div className="championBlock">
                <div className="avatarWrapper">
                    <img className="championIcon" src={pathToChampionImg} alt={champion} />
                    <span className="levelBadge">{championLevel}</span>
                </div>

                <div className="spellsAndRunes">
                    <div className="spells">
                        <img className="spell" src={spell1ImageUrl} alt={spell1Name} />
                        <img className="spell" src={spell2ImageUrl} alt={spell2Name} />
                    </div>
                    <div className="runes">
                        <img className="rune primaryRune" src={pathToMainRunIdImg} alt="Primary Rune" />
                        <img className="rune" src={pathTosecondaryRunIdImg} alt="Secondary Rune" />
                    </div>
                </div>
            </div>

            <div className="kdaBlock">
                <div className="kdaNumbers">
                    {kills} / <span className="deaths">{deaths}</span> / {assists}
                </div>
                <div className="kdaRatio">{kdaRatio === 'Perfect' ? 'Perfect KDA' : `${kdaRatio}:1 KDA`}</div>
            </div>

            <div className="extraStats">
                {name && tag ? `${name}#${tag}` : name || ' '}
                <div className="statRow">
                    CS {cripStat} ({csPerMin})
                </div>
            </div>

            <div className="items-block">
                <div className="main-items-grid">
                    {/* Перебираємо масив предметів через map */}
                    {items.map((itemId, index) =>
                        itemId ? (
                            <img key={index} className="item-icon" src={getItemUrl(itemId)} alt={`Item ${index}`} />
                        ) : (
                            <div key={index} className="empty-slot"></div>
                        )
                    )}
                </div>
                {/* Трінкет завжди відображається окремо */}
                {trinket ? (
                    <img className="trinket-icon" src={getItemUrl(trinket)} alt="Trinket" />
                ) : (
                    <div className="trinket-empty"></div>
                )}
            </div>
        </div>
    );
};

export default MatchCard;
