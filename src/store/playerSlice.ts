import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchPlayerStatsData, FetchPlayerProfileData } from '@/hooks/useRiotApi';

export interface PlayerState {
    matches: FetchPlayerStatsData[];
    profile: FetchPlayerProfileData | null;
    currentPlayer: {
        name: string;
        tag: string;
    } | null;
}

const initialState: PlayerState = {
    matches: [],
    profile: null,
    currentPlayer: null,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setMatches: (state, action: PayloadAction<FetchPlayerStatsData[]>) => {
            state.matches = action.payload;
        },

        setProfile(state, action: PayloadAction<FetchPlayerProfileData>) {
            state.profile = action.payload;
        },

        setCurrentPlayer: (state, action: PayloadAction<{ name: string; tag: string }>) => {
            state.currentPlayer = action.payload;
        },

        clearPlayerData: (state) => {
            state.matches = [];
            state.profile = null;
            state.currentPlayer = null;
        },
    },
});

export const { setMatches, setProfile, setCurrentPlayer, clearPlayerData } = playerSlice.actions;
export default playerSlice.reducer;
