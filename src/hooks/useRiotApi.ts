import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SUMMONER_SPELLS } from '@/constants/riotData';
import { setMatches, setProfile } from '@/store/playerSlice';

export interface FetchPlayerStatsData {
    matchId: string;
    champion: string;
    kills: number;
    deaths: number;
    assists: number;
    damage: number;
    isWin: boolean;
    championLevel: number;
    gameMode: string;
    cripStat: number;
    gameTime: number;
    spell1Name: string;
    spell2Name: string;
    primaryRuneId: number;
    secondaryStyleId: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    trinket: number;
    fullGameDetails: {
        gameDurationSeconds: number;
        team100: Array<any>;
        team200: Array<any>;
        teamsStats: Array<object>;
        rawParticipants: Array<object>;
    };
}

export interface FetchPlayerProfileData {
    ProfileSumInfo: {
        Proflevl: number;
        ProfIcon: number;
        Ranked: {
            RANKED_FLEX: {
                tier: string;
                rank: string;
                leaguePoints: number;
                wins: number;
                losses: number;
                inactive: boolean;
                hotStreak: boolean;
            };
            RANKED_SOLO_5x5: {
                tier: string;
                rank: string;
                leaguePoints: number;
                wins: number;
                losses: number;
                inactive: boolean;
                hotStreak: boolean;
            };
        };
    };
}

function useRiotApi() {
    const dispatch = useDispatch();

    const [playerData, setPlayerData] = useState<FetchPlayerStatsData[] | null>(null);
    const [playerProfileData, setplayerProfileData] = useState<FetchPlayerProfileData | null>(null);
    const [gameVersion, setGameVersion] = useState('16.11.1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlayerStats = useCallback(
        async (playerName: string, playerTag: string, gameNum: number = 6): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const versionRes = await fetch(
                    'https://ddragon.leagueoflegends.com/api/versions.json'
                );
                const versions = await versionRes.json();
                const latestVersion = versions[0];
                setGameVersion(latestVersion);

                const RIOT_API_KEY: string = import.meta.env.VITE_APP_RIOT_API_KEY;

                const SUM_INFO = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerName}/${playerTag}?api_key=${RIOT_API_KEY}`;
                const respons = await fetch(SUM_INFO);
                if (!respons.ok) throw new Error('Гравця з таким Riot ID не знайдено');
                const data = await respons.json();
                const playerPuuid = data.puuid;
                console.log(playerPuuid);

                const SummonerDTO = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${playerPuuid}?api_key=${RIOT_API_KEY}`;
                const SummonerDTOdata = await fetch(SummonerDTO);
                const ProfileIconLevel = await SummonerDTOdata.json();

                const RankedInfoUrl = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${playerPuuid}?api_key=${RIOT_API_KEY}`;
                const RankedInfoData = await fetch(RankedInfoUrl);
                const RankedInfourl = await RankedInfoData.json();

                const MATCH_HISTORIS_IDS = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerPuuid}/ids?start=0&count=${gameNum}&api_key=${RIOT_API_KEY}`;
                const matchHistorisRespons = await fetch(MATCH_HISTORIS_IDS);
                const matchIds = await matchHistorisRespons.json();

                if (!matchIds || matchIds.length === 0)
                    throw new Error('У гравця немає зіграних матчів');

                const matchPromises = matchIds.map((matchId: string) => {
                    const GET_MATCH_INFO = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
                    return fetch(GET_MATCH_INFO).then((res) => res.json());
                });

                const allMatchesData = await Promise.all(matchPromises);

                const playerProfile: FetchPlayerProfileData = {
                    ProfileSumInfo: {
                        Proflevl: ProfileIconLevel.summonerLevel,
                        ProfIcon: ProfileIconLevel.profileIconId,
                        Ranked: {
                            RANKED_FLEX: (() => {
                                const flex = RankedInfourl.find(
                                    (q: any) => q.queueType === 'RANKED_FLEX_SR'
                                );
                                return {
                                    tier: flex?.tier || 'UNRANKED',
                                    rank: flex?.rank || '',
                                    leaguePoints: flex?.leaguePoints || 0,
                                    wins: flex?.wins || 0,
                                    losses: flex?.losses || 0,
                                    inactive: flex?.inactive || false,
                                    hotStreak: flex?.hotStreak || false,
                                };
                            })(),
                            RANKED_SOLO_5x5: (() => {
                                const solo = RankedInfourl.find(
                                    (q: any) => q.queueType === 'RANKED_SOLO_5x5'
                                );
                                return {
                                    tier: solo?.tier || 'UNRANKED',
                                    rank: solo?.rank || '',
                                    leaguePoints: solo?.leaguePoints || 0,
                                    wins: solo?.wins || 0,
                                    losses: solo?.losses || 0,
                                    inactive: solo?.inactive || false,
                                    hotStreak: solo?.hotStreak || false,
                                };
                            })(),
                        },
                    },
                };

                setplayerProfileData(playerProfile);

                const formattedMatches: FetchPlayerStatsData[] = allMatchesData.map((matchData) => {
                    const playerStats = matchData.info.participants.find(
                        (participant: any) => participant.puuid === playerPuuid
                    );

                    const team100 = matchData.info.participants.filter(
                        (p: any) => p.teamId === 100
                    );
                    const team200 = matchData.info.participants.filter(
                        (p: any) => p.teamId === 200
                    );

                    return {
                        matchId: matchData.metadata.matchId,
                        champion: playerStats.championName,
                        kills: playerStats.kills,
                        deaths: playerStats.deaths,
                        assists: playerStats.assists,
                        damage: playerStats.totalDamageDealtToChampions,
                        isWin: playerStats.win,
                        championLevel: playerStats.champLevel,
                        gameMode: matchData.info.gameMode,
                        cripStat: playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled,
                        gameTime:
                            +`${Math.floor(playerStats.timePlayed / 60)}.${playerStats.timePlayed % 60}`,
                        spell1Name: SUMMONER_SPELLS[playerStats.summoner1Id] || 'SummonerFlash',
                        spell2Name: SUMMONER_SPELLS[playerStats.summoner2Id] || 'SummonerDot',
                        primaryRuneId: playerStats.perks.styles[0].selections[0].perk,
                        secondaryStyleId: playerStats.perks.styles[1].style,
                        item0: playerStats.item0,
                        item1: playerStats.item1,
                        item2: playerStats.item2,
                        item3: playerStats.item3,
                        item4: playerStats.item4,
                        item5: playerStats.item5,
                        trinket: playerStats.item6,

                        fullGameDetails: {
                            gameDurationSeconds: matchData.info.gameDuration,
                            team100: team100,
                            team200: team200,
                            teamsStats: matchData.info.teams,
                            rawParticipants: matchData.info.participants,
                        },
                    };
                });

                setPlayerData(formattedMatches);

                dispatch(setProfile(playerProfile));
                dispatch(setMatches(formattedMatches));
            } catch (error: any) {
                setError(error.message || 'Не вдалося отримати статистику гравця');
                setPlayerData(null);
            } finally {
                setIsLoading(false);
            }
        },
        [dispatch]
    );

    return { playerData, playerProfileData, gameVersion, isLoading, error, fetchPlayerStats };
}

export default useRiotApi;
