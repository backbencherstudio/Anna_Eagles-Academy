// Authentication utility functions
import userData from '@/public/data/user.json';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'admin';
    profileImage: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

const DEMO_PASSWORDS: { [key: string]: string } = {
    'student@gmail.com': '123456',
    'admin@admin.com': '123456'
};

export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
    try {
        // Find user by email
        const user = userData.find((u: any) => u.email === credentials.email);
        
        if (!user) {
            throw new Error('User not found');
        }

        const expectedPassword = DEMO_PASSWORDS[credentials.email];
        if (!expectedPassword || expectedPassword !== credentials.password) {
            throw new Error('Invalid password');
        }

        const transformedUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as 'student' | 'admin',
            profileImage: user.profileImage,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zip: user.zip,
            country: user.country
        };

        return transformedUser;
    } catch (error) {
        // console.error('Authentication error:', error);
        return null;
    }
};

export const saveUserToLocalStorage = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
    }
};

export const getUserFromLocalStorage = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
};

export const logout = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }
};

export const getCurrentUser = (): User | null => {
    if (isAuthenticated()) {
        return getUserFromLocalStorage();
    }
    return null;
}; 