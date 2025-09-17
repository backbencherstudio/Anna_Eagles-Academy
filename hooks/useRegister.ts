import { useState } from 'react';
import { createAccount } from '@/lib/apis/authApis';
import toast from 'react-hot-toast';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createAccount(data);
            if (response.success) {
                toast.success(response.message || 'Registration successful! Please check your email for verification.');
                return response;
            } else {
                toast.error(response.message || 'Registration failed. Please try again.');
                setError(response.message || 'Registration failed. Please try again.');
                return null;
            }
        } catch (err: any) {
            let errorMessage = 'Registration failed. Please try again.';
            let statusCode = err.response?.data?.statusCode;
            if (err.response?.data?.message?.message) {
                if (Array.isArray(err.response.data.message.message)) {
                    errorMessage = err.response.data.message.message.join(', ');
                } else {
                    errorMessage = err.response.data.message.message;
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            if (statusCode === 401) {
                toast.error(errorMessage);
                setError(errorMessage);
            } else if (statusCode === 400) {
                toast.error(errorMessage);
                setError(errorMessage);
            } else {
                toast.error(errorMessage);
                setError(errorMessage);
            }

            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        register,
        isLoading,
        error,
        clearError
    };
};
