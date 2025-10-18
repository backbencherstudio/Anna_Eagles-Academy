import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoProgressData {
    lesson_id: string;
    time_spent: number;
    last_position: number;
    completion_percentage: number;
}

export interface VideoProgressState {
    progressData: { [lessonId: string]: VideoProgressData };
    isSaving: boolean;
    lastSaved: { [lessonId: string]: number };
    error: string | null;
}

const initialState: VideoProgressState = {
    progressData: {},
    isSaving: false,
    lastSaved: {},
    error: null,
};

const videoProgressSlice = createSlice({
    name: 'videoProgress',
    initialState,
    reducers: {
        setVideoProgress: (state, action: PayloadAction<VideoProgressData>) => {
            const { lesson_id, time_spent, last_position, completion_percentage } = action.payload;
            state.progressData[lesson_id] = {
                lesson_id,
                time_spent,
                last_position,
                completion_percentage,
            };
            state.lastSaved[lesson_id] = Date.now();
        },
        setSavingProgress: (state, action: PayloadAction<boolean>) => {
            state.isSaving = action.payload;
        },
        setProgressError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearProgressError: (state) => {
            state.error = null;
        },
        clearVideoProgress: (state, action: PayloadAction<string>) => {
            delete state.progressData[action.payload];
            delete state.lastSaved[action.payload];
        },
        clearAllProgress: (state) => {
            state.progressData = {};
            state.lastSaved = {};
            state.error = null;
        },
    },
});

export const {
    setVideoProgress,
    setSavingProgress,
    setProgressError,
    clearProgressError,
    clearVideoProgress,
    clearAllProgress,
} = videoProgressSlice.actions;

export default videoProgressSlice.reducer;
