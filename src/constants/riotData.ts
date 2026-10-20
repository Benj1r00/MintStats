export type RiotAssetDictionary = Record<number, string | undefined>;

export const SUMMONER_SPELLS: RiotAssetDictionary = {
    1: 'SummonerBoost',
    3: 'SummonerExhaust',
    4: 'SummonerFlash',
    6: 'SummonerHaste',
    7: 'SummonerHeal',
    11: 'SummonerSmite',
    12: 'SummonerTeleport',
    14: 'SummonerDot',
    21: 'SummonerBarrier',
} as const;

export const SECONDARY_STYLES: RiotAssetDictionary = {
    8000: 'Precision_icon',
    8100: 'Domination_icon',
    8200: 'Sorcery_icon',
    8300: 'Inspiration_icon',
    8400: 'Resolve_icon',
} as const;

export const PRIMARY_RUNES: RiotAssetDictionary = {
    8005: '104px-Press_the_Attack_rune',
    8008: '104px-Lethal_Tempo_rune',
    8021: '104px-Fleet_Footwork_rune',
    8010: '104px-Conqueror_rune',
    8112: '104px-Electrocute_rune',
    8124: '104px-Predator_rune',
    8128: '104px-Dark_Harvest_rune',
    8106: '104px-Hail_of_Blades_rune',
    8214: '104px-Summon_Aery_rune',
    8229: '104px-Arcane_Comet_rune',
    8230: '104px-Phase_Rush_rune',
    8437: '104px-Grasp_of_the_Undying_rune',
    8439: '104px-Aftershock_rune',
    8465: '104px-Guardian_rune',
    8351: '104px-Glacial_Augment_rune',
    8360: '104px-Unsealed_Spellbook_rune',
    8369: '104px-First_Strike_rune',
} as const;
