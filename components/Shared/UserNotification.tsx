import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { useGetAllNotificationsQuery, useDeleteSingleNotificationMutation, useDeleteMultipleNotificationsMutation } from '@/rtk/api/users/notificationsApis';
import { addNotification, removeNotification as removeNotificationAction, removeManyNotifications as removeManyNotificationsAction, setNotifications as setNotificationsAction, clearNotifications as clearNotificationsAction } from '@/rtk/slices/users/notificationsSlice';
import { getSocket } from '@/lib/socket';

import { Calendar, Star, FileCheck, Trash2 } from 'lucide-react';



interface MainNotificationProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDropdown?: boolean;
}

export default function UserNotification({ isOpen = true, onClose, isDropdown = false }: MainNotificationProps) {
    const dispatch = useAppDispatch();
    const [showAll, setShowAll] = useState(false);

    // RTK Query: initial fetch - scope by userId so cache is per-user
    const authUser = useAppSelector(s => s.auth.user);
    const userId = authUser?.id as string | undefined;
    const { data: apiData } = useGetAllNotificationsQuery(
        // pass userId to key the cache; server doesn't need it
        userId ? { userId } : ({} as any),
        {
            skip: !userId,
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );
    const [deleteSingle] = useDeleteSingleNotificationMutation();
    const [deleteMultiple] = useDeleteMultipleNotificationsMutation();

    // Redux notifications state
    const notificationsState = useAppSelector(s => s.notifications.items);



    // No role-based updates needed for demo notifications

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




    const handleSeeAll = () => {
        setShowAll(true);
    };

    const handleSeeLess = () => {
        setShowAll(false);
    };

    const handleDelete = async (id: string) => {
        // optimistic update
        dispatch(removeNotificationAction(id));
        try {
            await deleteSingle(id).unwrap();
        } catch (e) {
            // ignore rollback for now; in real app we would refetch
        }
    };

    const handleClearAll = async () => {
        const ids = notificationsState.map((n: any) => n.id).filter(Boolean);
        if (ids.length === 0) return;
        // optimistic clear
        dispatch(removeManyNotificationsAction(ids));
        try {
            await deleteMultiple(ids).unwrap();
        } catch (e) {
            // best-effort: if server fails, we could refetch, but keeping UI clean
        }
    };

    // Clear list immediately on user switch to avoid showing old user's data
    useEffect(() => {
        dispatch(clearNotificationsAction());
    }, [userId, dispatch]);

    // Seed from API when available
    useEffect(() => {
        const list = (apiData as any)?.data as any[] | undefined;
        if (Array.isArray(list)) {
            dispatch(setNotificationsAction(list as any));
        }
    }, [apiData, dispatch]);

    // Socket.io realtime subscription
    useEffect(() => {
        if (!authUser?.id) return;
        const socket = getSocket();
        const normalize = (payload: any) => {
            const raw = payload?.data ?? payload ?? {};
            const created_at = raw.created_at || raw.createdAt || new Date().toISOString();
            const text = raw.notification_event?.text || raw.text || raw.message || raw.title || 'New notification';
            const type = raw.notification_event?.type || raw.type || 'system';
            const id = raw.id || raw.entity_id || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const notification_event = raw.notification_event || { id: raw.notification_event_id || id, type, text };
            return { id, ...raw, created_at, notification_event };
        };
        const onConnect = () => {
            try { socket.emit('notifications:join', { userId: authUser.id }); } catch { }
        };
        const onNewGlobal = (payload: any) => {
            const n = normalize(payload);
            if (n.receiver_id && n.receiver_id !== authUser.id) return;
            dispatch(addNotification(n));
        };
        const onNewUser = (payload: any) => {
            const n = normalize(payload);
            if (n.receiver_id && n.receiver_id !== authUser.id) return;
            dispatch(addNotification(n));
        };
        socket.on('connect', onConnect);
        // common event names to cover server variations
        socket.on('notification:new', onNewGlobal);
        socket.on(`notification:new:${authUser.id}`, onNewUser);
        socket.on('notifications:new', onNewGlobal);
        socket.on(`notifications:new:${authUser.id}`, onNewUser);
        // handle servers that emit plain 'notification'
        socket.on('notification', onNewGlobal);
        socket.on(`notification:${authUser.id}`, onNewUser);
        return () => {
            socket.off('connect', onConnect);
            socket.off('notification:new', onNewGlobal);
            socket.off(`notification:new:${authUser.id}`, onNewUser);
            socket.off('notifications:new', onNewGlobal);
            socket.off(`notifications:new:${authUser.id}`, onNewUser);
            socket.off('notification', onNewGlobal);
            socket.off(`notification:${authUser.id}`, onNewUser);
        };
    }, [dispatch, authUser?.id]);



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
    const initialNotifications = notificationsState.slice(0, 5);
    const remainingNotifications = notificationsState.slice(5);
    const displayedNotifications = showAll ? notificationsState : initialNotifications;

    return (
        <div className={containerClasses}>
            {isDropdown && (
                <div className="p-4 border-b border-gray-100 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearAll}
                                className=" cursor-pointer border border-red-500 text-red-500 px-1 py-0.5 rounded-md text-sm"
                            >
                                Clear All
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* {!isDropdown && (
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Notification</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => handleSettingsClick('user')}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            )} */}

            {/* Notifications List */}
            <div className={contentClasses}>
                <div className="space-y-4">
                    {displayedNotifications.map((notification: any, index) => {
                        const type = notification?.notification_event?.type as string | undefined
                        const text = notification?.notification_event?.text as string | undefined
                        const createdAt = notification?.created_at as string | undefined
                        const iconEl = type === 'quiz'
                            ? <Calendar className="w-5 h-5 text-[#725dff]" />
                            : type === 'assignment'
                                ? <FileCheck className="w-5 h-5 text-[#725dff]" />
                                : <Star className="w-5 h-5 text-[#725dff]" />
                        const timeText = createdAt ? new Date(createdAt).toLocaleString() : ''
                        return (
                            <div
                                key={notification.id}
                                className="group relative flex items-start gap-3 p-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Left icon area: swap to delete on hover */}
                                <div className="relative flex-shrink-0 w-10 h-10">
                                    <div className="absolute inset-0 bg-[#F1EFFF] rounded-full flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
                                        {iconEl}
                                    </div>
                                    <button
                                        aria-label="Delete notification"
                                        onClick={() => handleDelete(notification.id)}
                                        className="absolute cursor-pointer inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full border border-red-200 bg-white text-red-500 hover:bg-red-50 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 leading-relaxed mb-2">
                                        {text}
                                    </p>



                                    {/* Timestamp */}
                                    <p className="text-xs text-gray-500">
                                        {timeText}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
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
