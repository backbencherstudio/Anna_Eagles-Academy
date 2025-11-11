import { useRegisterMutation } from '@/rtk/api/authApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
    const router = useRouter();
    const [registerUser, { isLoading, error }] = useRegisterMutation();

    const register = async (data: any, resetForm?: () => void) => {
        try {
            const response = await registerUser(data).unwrap();
            
            // Check if the response indicates an error
            if (!response.success) {
                // This is an error response
                const errorMessage = response.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
                return { success: false, email: null };
            }
            
            // Check if response has the expected success structure
            if (response && response.success) {
                toast.success(response.message || 'Registration successful! Please check your email for verification.');
                // Clear form fields on success
                if (resetForm) {
                    resetForm();
                }
                // Return success with email for verification modal
                return { success: true, email: data.email };
            } else {
                toast.error('Registration failed. Please try again.');
                return { success: false, email: null };
            }
        } catch (err: any) {
            let errorMessage = 'Registration failed. Please try again.';
            
            // Handle different error response structures
            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.data?.message?.message) {
                if (Array.isArray(err.data.message.message)) {
                    errorMessage = err.data.message.message.join(', ');
                } else {
                    errorMessage = err.data.message.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
            return { success: false, email: null };
        }
    };

    const clearError = () => {
        // RTK Query handles error state automatically
    };

    return {
        register,
        isLoading,
        error: error ? (typeof error === 'string' ? error : 'message' in error ? error.message : 'An error occurred') : null,
        clearError
    };
};
