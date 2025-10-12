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

interface MyCoursesState {
    courses: Course[];
    loading: boolean;
    error: string | null;
}

const initialState: MyCoursesState = {
    courses: [],
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
    setLoading,
    setError,
    clearError,
} = myCoursesSlice.actions;

export default myCoursesSlice.reducer;
