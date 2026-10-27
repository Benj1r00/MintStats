export type RiotAssetDictionary = Record<number, string | undefined>;

export const SUMMONER_SPELLS: RiotAssetDictionary = {
    1: 'SummonerBoost', // Cleanse
    3: 'SummonerExhaust', // Exhaust
    4: 'SummonerFlash', // Flash
    6: 'SummonerHaste', // Ghost
    7: 'SummonerHeal', // Heal
    11: 'SummonerSmite', // Smite
    12: 'SummonerTeleport', // Teleport
    13: 'SummonerMana', // Clarity (ARAM)
    14: 'SummonerDot', // Ignite
    21: 'SummonerBarrier', // Barrier
    32: 'SummonerSnowball', // Mark (ARAM)
} as const;
