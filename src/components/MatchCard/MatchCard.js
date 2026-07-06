import React from 'react';
import './MatchCard.css'; 

function MatchCard({ isWin=false, champion, kills, deaths, assists, 
                     championLevel, cripStat, gameDurationSeconds, 
                     spell1Name, spell2Name,
                     primaryRuneId, secondaryStyleId,
                     item0, item1, item2, item3, item4, item5, trinket,
                     onClick, flippedcss, version, name, tag}) {

    const pathToChampionImg = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`;
    const pathToMainRunIdImg = `/assets/primaryRuneId/${primaryRuneId}.webp`;
    const pathTosecondaryRunIdImg = `/assets/secondaryStyleId/${secondaryStyleId}.webp`;
    const spell1ImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell1Name}.png`;
    const spell2ImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell2Name}.png`;
    const ItemUrl = (item) => `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`
    
    return (
        <div className={`statsContainer ${flippedcss ? 'flipped' : ''}`} 
        style={{ backgroundColor: isWin ? '#1A1D3C' : '#301A24' }} 
        onClick={onClick}>
        
        <div className="championBlock">
            <div className="avatarWrapper">
            <img className="championIcon" src={pathToChampionImg} alt={champion}></img>
            <span className="levelBadge">{championLevel}</span>
            </div>
            
            <div className="spellsAndRunes">
            <div className="spells">
                <img className="spell" src={spell1ImageUrl} alt={spell1ImageUrl}></img>
                <img className="spell" src={spell2ImageUrl} alt={spell2ImageUrl}></img>
            </div>
            <div className="runes">
                <img className="rune primaryRune" src={pathToMainRunIdImg} alt={pathToMainRunIdImg}></img>
                <img className="rune" src={pathTosecondaryRunIdImg} alt={pathTosecondaryRunIdImg}></img>
            </div>
            </div>
        </div>

        {/* 2. Блок KDA */}
        <div className="kdaBlock">
            <div className="kdaNumbers">
                {kills} / <span className="deaths">{deaths}</span> / {assists}
            </div>
            <div className="kdaRatio">
                {+((kills+assists)/deaths).toFixed(2)}:1 KDA
            </div>
        </div>

        <div className="extraStats">
            {name && tag ? `${name}#${tag}` : name || " "}
            <div className="statRow"> 
                CS {cripStat} ({+(cripStat/gameDurationSeconds).toFixed(1)})
            </div>
        </div>
        <div className='items-block'>
            <div className='main-items-grid'>
                {item0 ? <img className="item-icon" src={ItemUrl(item0)} alt="Item 0" /> : <div className="empty-slot"></div>}
                {item1 ? <img className="item-icon" src={ItemUrl(item1)} alt="Item 1" /> : <div className="empty-slot"></div>}
                {item2 ? <img className="item-icon" src={ItemUrl(item2)} alt="Item 2" /> : <div className="empty-slot"></div>}
                {item3 ? <img className="item-icon" src={ItemUrl(item3)} alt="Item 3" /> : <div className="empty-slot"></div>}
                {item4 ? <img className="item-icon" src={ItemUrl(item4)} alt="Item 4" /> : <div className="empty-slot"></div>}
                {item5 ? <img className="item-icon" src={ItemUrl(item5)} alt="Item 5" /> : <div className="empty-slot"></div>}
            </div>
            {trinket ? (<img className="trinket-icon" src={ItemUrl(trinket)} alt="Trinket" />) : (<div className="trinket-empty"></div>)}
        </div>

        </div>
    );
}

export default MatchCard;