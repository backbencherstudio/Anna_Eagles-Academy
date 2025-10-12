import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Assignment {
    id: string;
    title: string;
    description: string;
    published_at: string;
    publication_status: string;
    total_marks: number;
    created_at: string;
    updated_at: string;
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
}

export interface Quiz {
    id: string;
    title: string;
    instructions: string;
    total_marks: number;
    published_at: string;
    is_published: boolean;
    publication_status: string;
    created_at: string;
    updated_at: string;
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
}

interface AssignmentQuizState {
    assignments: Assignment[];
    quizzes: Quiz[];
    loading: boolean;
    error: string | null;
    filter: 'Upcoming' | 'Finished' | 'All';
}

const initialState: AssignmentQuizState = {
    assignments: [],
    quizzes: [],
    loading: false,
    error: null,
    filter: 'All',
};

const assignmentQuizSlice = createSlice({
    name: 'assignmentQuiz',
    initialState,
    reducers: {
        setAssignments: (state, action: PayloadAction<Assignment[]>) => {
            state.assignments = action.payload;
        },
        setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
            state.quizzes = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setFilter: (state, action: PayloadAction<'Upcoming' | 'Finished' | 'All'>) => {
            state.filter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setAssignments,
    setQuizzes,
    setLoading,
    setError,
    setFilter,
    clearError,
} = assignmentQuizSlice.actions;

export default assignmentQuizSlice.reducer;
