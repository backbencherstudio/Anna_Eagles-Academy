import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import {
    Calendar,
    Award,
    Star,
    FileCheck,
    Settings,
    Check,
    X,
    Users,
    BookOpen,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

interface NotificationItem {
    id: string;
    type: 'invitation' | 'completion' | 'opinion' | 'payment' | 'admin' | 'system';
    message: string;
    time: string;
    icon: React.ReactNode;
    hasActions?: boolean;
    role?: string;
}

interface MainNotificationProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDropdown?: boolean;
}

export default function MainNotification({ isOpen = true, onClose, isDropdown = false }: MainNotificationProps) {
    const router = useRouter();
    const user = {
        role: 'user'
    }
    const [showAll, setShowAll] = useState(false);

    // All notifications with role-based filtering
    const allNotifications: NotificationItem[] = [
        // Student notifications
        {
            id: '1',
            type: 'invitation',
            message: "You've got an invitation for a 1v1 session on 12 June 2025 11 AM",
            time: '20 mins ago',
            icon: <Calendar className="w-5 h-5 text-[#725dff]" />,
            hasActions: true,
            role: 'student'
        },
        {
            id: '2',
            type: 'completion',
            message: "Congratulations! 🎉 You've Mastered the Course! Your dedication and hard work have paid off.",
            time: '20 mins ago',
            icon: <Award className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '3',
            type: 'opinion',
            message: "Your Opinion Matters! 🌟 Share your thoughts and help us enhance your learning experience.",
            time: '1 hour ago',
            icon: <Star className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '4',
            type: 'payment',
            message: "Payment Success! 🎉 You're officially enrolled! Your course journey begins now.",
            time: 'a week ago',
            icon: <FileCheck className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '5',
            type: 'completion',
            message: "Congratulations! 🎉 You've Mastered the Course! Your dedication and hard work have paid off.",
            time: 'a month ago',
            icon: <Award className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '6',
            type: 'payment',
            message: "Payment Success! 🎉 You're officially enrolled! Your course journey begins now.",
            time: '2 months ago',
            icon: <FileCheck className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '7',
            type: 'invitation',
            message: "You've got an invitation for a group study session on 15 June 2025 2 PM",
            time: '3 months ago',
            icon: <Calendar className="w-5 h-5 text-[#725dff]" />,
            hasActions: true,
            role: 'student'
        },
        {
            id: '8',
            type: 'completion',
            message: "Great job! 🎯 You've completed the Advanced JavaScript module successfully.",
            time: '4 months ago',
            icon: <Award className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },
        {
            id: '9',
            type: 'opinion',
            message: "We'd love your feedback! 💭 Rate your recent course experience.",
            time: '5 months ago',
            icon: <Star className="w-5 h-5 text-[#725dff]" />,
            role: 'student'
        },

        // Admin notifications
        {
            id: '10',
            type: 'admin',
            message: "New student registration: John Doe has joined the platform! 🎉",
            time: '10 mins ago',
            icon: <Users className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '11',
            type: 'admin',
            message: "Course completion alert: 5 students completed 'Advanced React' course today! 📚",
            time: '1 hour ago',
            icon: <BookOpen className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '12',
            type: 'admin',
            message: "Revenue update: Monthly earnings increased by 15% compared to last month! 💰",
            time: '2 hours ago',
            icon: <TrendingUp className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '13',
            type: 'admin',
            message: "System alert: Server maintenance scheduled for tomorrow at 2 AM ⚠️",
            time: '3 hours ago',
            icon: <AlertCircle className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '14',
            type: 'admin',
            message: "New course submission: 'Machine Learning Basics' pending review 📝",
            time: '1 day ago',
            icon: <BookOpen className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '15',
            type: 'admin',
            message: "Student feedback: 4.8/5 average rating for this month! 🌟",
            time: '2 days ago',
            icon: <Star className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '16',
            type: 'admin',
            message: "Payment processed: $2,500 received from course enrollments 💳",
            time: '3 days ago',
            icon: <FileCheck className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '17',
            type: 'admin',
            message: "Instructor application: Sarah Johnson applied for teaching position 👨‍🏫",
            time: '1 week ago',
            icon: <Users className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '18',
            type: 'admin',
            message: "System update: New features deployed successfully! 🚀",
            time: '1 week ago',
            icon: <TrendingUp className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        },
        {
            id: '19',
            type: 'admin',
            message: "Monthly report: 150 new students, 25 course completions 📊",
            time: '2 weeks ago',
            icon: <TrendingUp className="w-5 h-5 text-[#725dff]" />,
            role: 'admin'
        }
    ];

    // Filter notifications based on user role
    const filteredNotifications = allNotifications.filter(notification =>
        notification.role === user?.role || !notification.role
    );

    const [notifications, setNotifications] = useState<NotificationItem[]>(filteredNotifications);

    // Calculate notification count
    const calculateNotificationCount = () => {
        return notifications.length;
    };

    // Expose notification count for external use
    const getNotificationCount = () => {
        return notifications.length;
    };

    // Update notifications when user role changes
    useEffect(() => {
        const updatedFilteredNotifications = allNotifications.filter(notification =>
            notification.role === user?.role || !notification.role
        );
        setNotifications(updatedFilteredNotifications);
    }, [user?.role]);

    // Close notification dropdown when clicking outside (only for dropdown mode)
    useEffect(() => {
        if (!isDropdown || !isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.notification-dropdown')) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdown, isOpen, onClose]);

    const handleAccept = (id: string) => {
        // Handle accept logic
        console.log('Accepted invitation:', id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const handleDecline = (id: string) => {
        // Handle decline logic
        console.log('Declined invitation:', id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const handleSeeAll = () => {
        setShowAll(true);
    };

    const handleSeeLess = () => {
        setShowAll(false);
    };

    const handleSettingsClick = () => {
        router.push('/setting/notification');
    };

    // If it's a dropdown and not open, don't render
    if (isDropdown && !isOpen) {
        return null;
    }

    const containerClasses = isDropdown
        ? `absolute top-full right-0 mt-2 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto transition-all duration-300 ease-in-out transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`
        : "min-h-screen bg-white p-4";

    const contentClasses = isDropdown
        ? "p-4"
        : "";

    // Determine which notifications to show
    const initialNotifications = notifications.slice(0, 5);
    const remainingNotifications = notifications.slice(5);
    const displayedNotifications = showAll ? notifications : initialNotifications;

    return (
        <div className={containerClasses}>
            {isDropdown && (
                <div className="p-4 border-b border-gray-100 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 cursor-pointer"
                                onClick={handleSettingsClick}
                            >
                                <Settings className="h-6 w-6" />
                            </Button>
                            {/* <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button> */}
                        </div>
                    </div>
                </div>
            )}

            {!isDropdown && (
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Notification</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={handleSettingsClick}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Notifications List */}
            <div className={contentClasses}>
                <div className="space-y-4">
                    {displayedNotifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className="flex items-start gap-3 p-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-10 h-10 bg-[#F1EFFF]  rounded-full flex items-center justify-center">
                                {notification.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 leading-relaxed mb-2">
                                    {notification.message}
                                </p>

                                {/* Action Buttons for Invitation */}
                                {notification.hasActions && (
                                    <div className="flex gap-2 mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-8 text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => handleDecline(notification.id)}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleAccept(notification.id)}
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            Accept
                                        </Button>
                                    </div>
                                )}

                                {/* Timestamp */}
                                <p className="text-xs text-gray-500">
                                    {notification.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See All/Less Button */}
                {!isDropdown && (
                    <div className="flex justify-center mt-8">
                        {!showAll && remainingNotifications.length > 0 ? (
                            <Button
                                variant="link"
                                className="text-[#725DFF] cursor-pointer transform duration-300 hover:text-[#725DFF]/90 font-medium"
                                onClick={handleSeeAll}
                            >
                                See all ({remainingNotifications.length} more)
                            </Button>
                        ) : showAll ? (
                            <Button
                                variant="link"
                                className="text-[#725DFF] cursor-pointer transform duration-300 hover:text-[#725DFF]/90 font-medium"
                                onClick={handleSeeLess}
                            >
                                See less
                            </Button>
                        ) : null}
                    </div>
                )}

                {/* Dropdown See All Button */}
                {isDropdown && !showAll && remainingNotifications.length > 0 && (
                    <div className="flex justify-center mt-4 pt-3 border-t border-gray-100 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                        <Button
                            variant="link"
                            className="text-[#725DFF] cursor-pointer transform duration-300 hover:text-[#725DFF]/90 font-medium text-sm"
                            onClick={handleSeeAll}
                        >
                            See all notifications ({remainingNotifications.length} more)
                        </Button>
                    </div>
                )}

                {isDropdown && showAll && (
                    <div className="flex justify-center mt-4 pt-3 border-t border-gray-100 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                        <Button
                            variant="link"
                            className="text-[#725DFF] cursor-pointer transform duration-300 hover:text-[#725DFF]/90 font-medium text-sm"
                            onClick={handleSeeLess}
                        >
                            See less
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
