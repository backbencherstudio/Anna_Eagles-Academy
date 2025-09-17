import { useState } from 'react';
import { createAccount } from '@/lib/apis/authApis';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const register = async (data: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createAccount(data);
            
            // Check if the response indicates an error
            if (response.statusCode && response.statusCode !== 200) {
                // This is an error response
                const errorMessage = response.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
                setError(errorMessage);
                return null;
            }
            
            // Check if response has the expected success structure
            if (response && response.user && response.token) {
                toast.success(response.message || 'Registration successful! Please check your email for verification.');
                // Redirect to login after successful registration
                router.push('/login');
                return response;
            } else {
                toast.error('Registration failed. Please try again.');
                setError('Registration failed. Please try again.');
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

            toast.error(errorMessage);
            setError(errorMessage);
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
