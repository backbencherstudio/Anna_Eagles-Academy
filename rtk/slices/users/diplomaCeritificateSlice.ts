import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CourseCertificate } from '@/rtk/api/users/diplomaCeritificateApis';

interface DiplomaCertificateState {
    selectedCertificate: CourseCertificate | null;
    downloadLoading: boolean;
    downloadError: string | null;
    filter: 'All' | 'Completed' | 'Pending';
}

const initialState: DiplomaCertificateState = {
    selectedCertificate: null,
    downloadLoading: false,
    downloadError: null,
    filter: 'All',
};

const diplomaCertificateSlice = createSlice({
    name: 'diplomaCertificate',
    initialState,
    reducers: {
        setSelectedCertificate: (state, action: PayloadAction<CourseCertificate | null>) => {
            state.selectedCertificate = action.payload;
        },
        setDownloadLoading: (state, action: PayloadAction<boolean>) => {
            state.downloadLoading = action.payload;
        },
        setDownloadError: (state, action: PayloadAction<string | null>) => {
            state.downloadError = action.payload;
        },
        setFilter: (state, action: PayloadAction<'All' | 'Completed' | 'Pending'>) => {
            state.filter = action.payload;
        },
        clearDownloadError: (state) => {
            state.downloadError = null;
        },
        clearCertificateState: (state) => {
            state.selectedCertificate = null;
            state.downloadLoading = false;
            state.downloadError = null;
        },
    },
});

export const {
    setSelectedCertificate,
    setDownloadLoading,
    setDownloadError,
    setFilter,
    clearDownloadError,
    clearCertificateState,
} = diplomaCertificateSlice.actions;

export default diplomaCertificateSlice.reducer;

