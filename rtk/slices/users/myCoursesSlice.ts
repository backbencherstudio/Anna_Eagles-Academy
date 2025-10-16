import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    duration: string;
    level: string;
    price: number;
    rating: number;
    studentsCount: number;
    lessonsCount: number;
    isEnrolled: boolean;
    progress: number;
}

export interface EnrolledSeriesSummary {
    id: string;
    title: string;
    duration: string | null;
    progressPercentage: number;
    lessonFiles: number;
    coursesCount: number;
    quizzesCount: number;
    assignmentsCount: number;
    thumbnailUrl: string | null;
}

export interface WatchedHistoryItem {
    lesson: {
        id: string;
        title: string;
        position: number;
        video_length: string;
        file_url: string;
        doc_url: string | null;
    };
    course: {
        id: string;
        title: string;
        position: number;
    };
    series: {
        id: string;
        title: string;
        slug: string;
        thumbnail: string;
    };
    enrollment: {
        id: string;
        enrolled_at: string;
        status: string;
        progress_percentage: number;
        last_accessed_at: string;
    };
    progress: {
        id: string;
        is_completed: boolean;
        is_viewed: boolean;
        completed_at: string | null;
        viewed_at: string | null;
        time_spent: number | null;
        last_position: number | null;
        completion_percentage: number;
    };
}

interface MyCoursesState {
    courses: Course[];
    enrolledSeries: EnrolledSeriesSummary[];
    watchedHistory: WatchedHistoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: MyCoursesState = {
    courses: [],
    enrolledSeries: [],
    watchedHistory: [],
    loading: false,
    error: null,
};

const myCoursesSlice = createSlice({
    name: 'myCourses',
    initialState,
    reducers: {
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses = action.payload;
        },
        setEnrolledSeries: (state, action: PayloadAction<EnrolledSeriesSummary[]>) => {
            state.enrolledSeries = action.payload;
        },
        setWatchedHistory: (state, action: PayloadAction<WatchedHistoryItem[]>) => {
            state.watchedHistory = action.payload;
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
    setCourses,
    setEnrolledSeries,
    setWatchedHistory,
    setLoading,
    setError,
    clearError,
} = myCoursesSlice.actions;

export default myCoursesSlice.reducer;
