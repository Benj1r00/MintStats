import { useState, useCallback } from 'react';

function useRiotApi() {
    const [playerData, setPlayerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlayerStats = useCallback(async (playerName, playerTag, gameNum = 6) => {
        setIsLoading(true);
        setError(null);

        try {
            const RIOT_API_KEY = process.env.REACT_APP_RIOT_API_KEY;
            
            const SUM_INFO = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerName}/${playerTag}?api_key=${RIOT_API_KEY}`;
            const respons = await fetch(SUM_INFO);
            if (!respons.ok) throw new Error('Гравця з таким Riot ID не знайдено');
            const data = await respons.json();
            const playerPuuid = data.puuid;

            const MATCH_HISTORIS_IDS = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerPuuid}/ids?start=0&count=${gameNum}&api_key=${RIOT_API_KEY}`;            
            const matchHistorisRespons = await fetch(MATCH_HISTORIS_IDS);
            const matchIds = await matchHistorisRespons.json();

            if (!matchIds || matchIds.length === 0) throw new Error('У гравця немає зіграних матчів');

            const matchPromises = matchIds.map(matchId => {
                const GET_MATCH_INFO = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
                return fetch(GET_MATCH_INFO).then(res => res.json());
            });

            const allMatchesData = await Promise.all(matchPromises);

            // Словники даних
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

            const formattedMatches = allMatchesData.map(matchData => {
                const playerStats = matchData.info.participants.find(participant => participant.puuid === playerPuuid);
                
                return {
                    matchId: matchData.metadata.matchId, 
                    champion: playerStats.championName,
                    kills: playerStats.kills,
                    deaths: playerStats.deaths,
                    assists: playerStats.assists,
                    damage: playerStats.totalDamageDealtToChampions,
                    isWin: playerStats.win,
                    gameMode: matchData.info.gameMode,
                    cripStat: playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled,
                    gameTime: +(`${Math.floor(playerStats.timePlayed / 60)}.${playerStats.timePlayed % 60}`),
                    spell1Name: summonerSpells[playerStats.summoner1Id] || "SummonerFlash",
                    spell2Name: summonerSpells[playerStats.summoner2Id] || "SummonerDot",
                    primaryRuneId: primaryRunes[playerStats.perks.styles[0].selections[0].perk] || "104px-Conqueror_rune",
                    secondaryStyleId: secondaryStyles[playerStats.perks.styles[1].style] || "Precision_icon",
                    item0: playerStats.item0,
                    item1: playerStats.item1,
                    item2: playerStats.item2,
                    item3: playerStats.item3,
                    item4: playerStats.item4,
                    item5: playerStats.item5,
                    trinket: playerStats.item6
                };
            });

            setPlayerData(formattedMatches);

        } catch (error) {
            setError(error.message || "Не вдалося отримати статистику гравця");
            setPlayerData(null);   
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { playerData, isLoading, error, fetchPlayerStats };
}

export default useRiotApi;