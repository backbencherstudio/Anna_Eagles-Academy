import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/rtk/api/authApi';

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

// New interface for video data caching
export interface VideoData {
    video_id: string;
    video_title: string;
    video_url: string;
    duration: number;
    video_duration: string;
    module: string;
    progress: any;
    completion_percentage: number;
    crossOrigin: string;
}

// New interface for series data caching
export interface CachedSeriesData {
    id: string;
    title: string;
    courses: Array<{
        id: string;
        title: string;
        position: number;
        price: string;
        video_length: string;
        intro_video_url: string | null;
        end_video_url: string | null;
        lesson_files: Array<{
            id: string;
            title: string;
            url: string;
            doc: string | null;
            kind: string;
            alt: string;
            position: number;
            video_length: string;
            lesson_progress: any;
            is_unlocked: boolean;
        }>;
        course_progress: any;
    }>;
}

interface MyCoursesState {
    courses: Course[];
    enrolledSeries: EnrolledSeriesSummary[];
    watchedHistory: WatchedHistoryItem[];
    loading: boolean;
    error: string | null;
    // New state for instant video switching
    currentVideoData: VideoData | null;
    cachedSeriesData: { [seriesId: string]: CachedSeriesData };
    selectedLessonId: string | null;
}

const initialState: MyCoursesState = {
    courses: [],
    enrolledSeries: [],
    watchedHistory: [],
    loading: false,
    error: null,
    // New state for instant video switching
    currentVideoData: null,
    cachedSeriesData: {},
    selectedLessonId: null,
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
        // New reducers for instant video switching
        setCurrentVideoData: (state, action: PayloadAction<VideoData | null>) => {
            state.currentVideoData = action.payload;
        },
        setCachedSeriesData: (state, action: PayloadAction<{ seriesId: string; data: CachedSeriesData }>) => {
            state.cachedSeriesData[action.payload.seriesId] = action.payload.data;
        },
        setSelectedLessonId: (state, action: PayloadAction<string | null>) => {
            state.selectedLessonId = action.payload;
        },
        clearCachedSeriesData: (state, action: PayloadAction<string>) => {
            delete state.cachedSeriesData[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                () => {
                    return initialState;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                () => {
                    // When a new user logs in, ensure previous user's course/video state is cleared
                    return initialState;
                }
            );
    },
});

export const {
    setCourses,
    setEnrolledSeries,
    setWatchedHistory,
    setLoading,
    setError,
    clearError,
    // New exports for instant video switching
    setCurrentVideoData,
    setCachedSeriesData,
    setSelectedLessonId,
    clearCachedSeriesData,
} = myCoursesSlice.actions;

export default myCoursesSlice.reducer;
