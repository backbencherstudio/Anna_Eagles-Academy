import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutData {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: string;
    total_price: string;
    type: string;
    user_id: string;
    series_id: string;
    series: {
        id: string;
        title: string;
        thumbnail: string;
        total_price: string;
    };
}

interface PaymentState {
    checkoutData: CheckoutData | null;
    isLoading: boolean;
    error: string | null;
    appliedCoupon: string | null;
    couponDiscount: number;
}

const initialState: PaymentState = {
    checkoutData: null,
    isLoading: false,
    error: null,
    appliedCoupon: null,
    couponDiscount: 0,
};

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setCheckoutData: (state, action: PayloadAction<CheckoutData>) => {
            state.checkoutData = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setAppliedCoupon: (state, action: PayloadAction<string | null>) => {
            state.appliedCoupon = action.payload;
        },
        setCouponDiscount: (state, action: PayloadAction<number>) => {
            state.couponDiscount = action.payload;
        },
        clearPaymentState: (state) => {
            state.checkoutData = null;
            state.isLoading = false;
            state.error = null;
            state.appliedCoupon = null;
            state.couponDiscount = 0;
        },
    },
});

export const {
    setCheckoutData,
    setLoading,
    setError,
    setAppliedCoupon,
    setCouponDiscount,
    clearPaymentState,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
