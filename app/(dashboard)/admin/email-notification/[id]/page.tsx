import EmailNotification from '@/app/_components/Admin/EmailNotification'

interface PageProps {
    params: {
        id: string
    }
}

export default function EmailNotificationWithStudent({ params }: PageProps) {
    return <EmailNotification studentId={params.id} />
}
