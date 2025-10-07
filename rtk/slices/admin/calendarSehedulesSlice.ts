import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalendarEvent {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    title: string;
    description: string | null;
    class_link: string | null;
    start_at: string;
    end_at: string;
    timezone: string | null;
    status: string;
    type: 'CLASS' | 'QUIZ' | 'ASSIGNMENT' | 'GENERAL' | 'LECTURE' | 'MEETING';
    metadata: any;
    user_id: string | null;
    assignment_id: string | null;
    quiz_id: string | null;
    course_id: string | null;
    series_id: string | null;
    user?: {
        id: string;
        username: string | null;
        email: string;
        first_name: string;
        last_name: string;
    };
    assignment?: {
        id: string;
        title: string;
    };
    quiz?: {
        id: string;
        title: string;
    };
    course?: {
        id: string;
        title: string;
    };
    series?: {
        id: string;
        title: string;
    };
}

export interface CalendarSchedulesState {
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    selectedDate: string;
    loading: boolean;
    error: string | null;
}

const initialState: CalendarSchedulesState = {
    events: [],
    selectedEvent: null,
    selectedDate: '',
    loading: false,
    error: null,
};

const calendarSchedulesSlice = createSlice({
    name: 'calendarSchedules',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
            state.events = action.payload;
        },
        setSelectedEvent: (state, action: PayloadAction<CalendarEvent | null>) => {
            state.selectedEvent = action.payload;
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setEvents,
    setSelectedEvent,
    setSelectedDate,
    setLoading,
    setError,
    clearError,
} = calendarSchedulesSlice.actions;

export default calendarSchedulesSlice.reducer;
