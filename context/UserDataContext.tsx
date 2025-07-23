'use client'

import React, { createContext, useContext } from 'react';

// Demo user data type
export interface UserData {
    name: string;
    role: 'student' | 'admin';
    avatar_url?: string;
}

// Demo user data
const demoUser: UserData = {
    name: 'John Doe',
    role: 'student',
    avatar_url: '',
};

// Context
const UserDataContext = createContext<UserData>(demoUser);

// Provider
export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserDataContext.Provider value={demoUser}>
            {children}
        </UserDataContext.Provider>
    );
};

// Hook for consuming context
export const useUserData = () => useContext(UserDataContext);
