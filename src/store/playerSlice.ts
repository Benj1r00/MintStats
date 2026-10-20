import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchPlayerStatsData } from '@/hooks/useRiotApi';

export interface PlayerState {
    matches: FetchPlayerStatsData[];
    currentPlayer: {
        name: string;
        tag: string;
    } | null;
}

const initialState: PlayerState = {
    matches: [],
    currentPlayer: null,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setMatches: (state, action: PayloadAction<FetchPlayerStatsData[]>) => {
            state.matches = action.payload;
        },

        setCurrentPlayer: (state, action: PayloadAction<{ name: string; tag: string }>) => {
            state.currentPlayer = action.payload;
        },

        clearPlayerData: (state) => {
            state.matches = [];
            state.currentPlayer = null;
        },
    },
});

export const { setMatches, setCurrentPlayer, clearPlayerData } = playerSlice.actions;
export default playerSlice.reducer;
