import React from 'react'
import Notifications from './Notifications'

interface AdminNotificationProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDropdown?: boolean;
}

export default function AdminNotification(props: AdminNotificationProps) {
    return <Notifications {...props} />
}
