import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
    total_revenue: string;
    total_users: number;
    new_enrollments: number;
    new_users: number;
    completed_payments: number;
}

interface ChartDataPoint {
    date: string;
    revenue: number;
}

interface ChartData {
    label: string;
    data: ChartDataPoint[];
}

interface RevenueGrowthSummary {
    current_period_revenue: number;
    previous_period_revenue: number;
    growth_percentage: number;
    growth_direction: "up" | "down";
    current_period_label: string;
    previous_period_label: string;
    period_type: string;
}

interface RevenueGrowth {
    summary: RevenueGrowthSummary;
    chart_data: {
        current_period: ChartData;
        last_period: ChartData;
    };
}

interface ScheduleEvent {
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
    type: string;
    metadata: any;
    user_id: string | null;
    assignment_id: string | null;
    quiz_id: string | null;
    course_id: string;
    series_id: string;
    user: any;
    assignment: {
        id: string;
        title: string;
    } | null;
    quiz: {
        id: string;
        title: string;
    } | null;
    course: {
        id: string;
        title: string;
    };
    series: {
        id: string;
        title: string;
    };
}

interface MainDashboardData {
    dashboardStats: DashboardStats;
    revenueGrowth: RevenueGrowth;
    scheduleEvents: ScheduleEvent[];
    assignment: any[];
    quiz: any[];
}

interface MainDashboardState {
    data: MainDashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: MainDashboardState = {
    data: null,
    loading: false,
    error: null,
};

const mainDashboardSlice = createSlice({
    name: 'mainDashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action: PayloadAction<MainDashboardData>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setDashboardData, setLoading, setError, clearError } = mainDashboardSlice.actions;
export default mainDashboardSlice.reducer;
