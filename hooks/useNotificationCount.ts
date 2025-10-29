import { useAppSelector } from '@/rtk/hooks';

export const useNotificationCount = () => {
  const count = useAppSelector((s) => s.notifications.items.length)
  return count
}
