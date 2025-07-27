'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authenticateUser, saveUserToLocalStorage, getUserFromLocalStorage, logout as logoutUser, isAuthenticated } from '@/lib/auth';

// Context interface
interface UserDataContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
    logout: () => void;
}

// Context
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Provider
export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing user on mount
    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated()) {
                const savedUser = getUserFromLocalStorage();
                if (savedUser) {
                    setUser(savedUser);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
        try {
            const authenticatedUser = await authenticateUser({ email, password });

            if (authenticatedUser) {
                saveUserToLocalStorage(authenticatedUser);
                setUser(authenticatedUser);
                return { success: true, message: 'Login successful', user: authenticatedUser };
            } else {
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    const value: UserDataContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
};

// Hook for consuming context
export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
