import { useState, useEffect } from 'react';
import { useUserData } from '@/context/UserDataContext';

interface NotificationItem {
    id: string;
    message: string;
    time: string;
    role?: string;
}

export const useNotificationCount = () => {
    const { user } = useUserData();
    const [notificationCount, setNotificationCount] = useState(0);

    // All notifications with role-based filtering
    const allNotifications: NotificationItem[] = [
        // Student notifications
        { id: '1', message: 'You have empty vibe check for tomorrow.', time: '01:55 pm', role: 'student' },
        { id: '2', message: 'Course completion notification', time: '02:30 pm', role: 'student' },
        { id: '3', message: 'Payment success notification', time: '03:15 pm', role: 'student' },

        // Admin notifications
        { id: '4', message: 'New student registration', time: '10:00 am', role: 'admin' },
        { id: '5', message: 'Course completion alert', time: '11:30 am', role: 'admin' },
        { id: '6', message: 'Revenue update', time: '12:45 pm', role: 'admin' },
        { id: '7', message: 'System maintenance alert', time: '01:20 pm', role: 'admin' },
    ];

    // Calculate notification count based on user role
    const calculateNotificationCount = () => {
        const roleBasedNotifications = allNotifications.filter(notification =>
            notification.role === user?.role || !notification.role
        );
        return roleBasedNotifications.length;
    };

    // Update notification count when user role changes
    useEffect(() => {
        setNotificationCount(calculateNotificationCount());
    }, [user?.role]);

    return notificationCount;
};
