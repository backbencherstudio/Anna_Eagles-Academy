import EmailNotification from '@/app/_components/Admin/EmailNotification'

export interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EmailNotificationWithStudent({ params }: PageProps) {
    const { id } = await params
    return <EmailNotification studentId={id} />
}
