import React from 'react';
import './MatchCard.css'; // Звичайний імпорт стилів

function MatchCard({ isWin=false, champion='Akali', kills=11, deaths=8, assists=10, 
                     championLevel=9, cripStat=418, gameTime=39.29, 
                     spell1Name='SummonerFlash', spell2Name='SummonerDot',
                     primaryRuneId='104px-Press_the_Attack_rune', secondaryStyleId='Precision_icon'}) {

    const pathToChampionImg = `/assets/tiles/${champion}_0.jpg`;
    const pathToMainRunIdImg = `/assets/primaryRuneId/${primaryRuneId}.webp`;
    const pathTosecondaryRunIdImg = `/assets/secondaryStyleId/${secondaryStyleId}.webp`;
    const spell1ImageUrl = `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/${spell1Name}.png`;
    const spell2ImageUrl = `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/${spell2Name}.png`;
    
    return (
        <div className="statsContainer" style={{ backgroundColor: isWin ? '#1A1D3C' : '#301A24' }}>
        
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

        {/* 3. Вертикальний розділювач */}
        <div className="divider"></div>

        {/* 4. Блок додаткової статистики */}
        <div className="extraStats">
            <div className="statRow">
            CS {cripStat} ({+(cripStat/gameTime).toFixed(1)})
            </div>
        </div>

        </div>
    );
}

export default MatchCard;