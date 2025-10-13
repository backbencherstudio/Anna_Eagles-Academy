import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssignmentQuestion {
    id: string;
    title: string;
    points: number;
    position: number;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    published_at: string;
    publication_status: string;
    due_at: string;
    total_marks: number;
    created_at: string;
    updated_at: string;
    remaining_time: string;
    series_id: string;
    course_id: string;
    questions: AssignmentQuestion[];
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
    submission_status: {
        is_submitted: boolean;
    };
}

export interface QuizAnswer {
    id: string;
    option: string;
}

export interface QuizQuestion {
    id: string;
    prompt: string;
    points: number;
    position: number;
    created_at: string;
    answers: QuizAnswer[];
}

export interface Quiz {
    id: string;
    title: string;
    instructions: string;
    total_marks: number;
    published_at: string;
    due_at: string;
    is_published: boolean;
    publication_status: string;
    created_at: string;
    updated_at: string;
    remaining_time: string;
    series_id: string;
    course_id: string;
    questions: QuizQuestion[];
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
    submission_status: {
        is_submitted: boolean;
    };
}

interface AssignmentQuizState {
    assignments: Assignment[];
    quizzes: Quiz[];
    loading: boolean;
    error: string | null;
    filter: 'Upcoming' | 'Finished' | 'All';
    submissionLoading: boolean;
    submissionError: string | null;
}

const initialState: AssignmentQuizState = {
    assignments: [],
    quizzes: [],
    loading: false,
    error: null,
    filter: 'All',
    submissionLoading: false,
    submissionError: null,
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
        setSubmissionLoading: (state, action: PayloadAction<boolean>) => {
            state.submissionLoading = action.payload;
        },
        setSubmissionError: (state, action: PayloadAction<string | null>) => {
            state.submissionError = action.payload;
        },
        clearSubmissionError: (state) => {
            state.submissionError = null;
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
    setSubmissionLoading,
    setSubmissionError,
    clearSubmissionError,
} = assignmentQuizSlice.actions;

export default assignmentQuizSlice.reducer;
