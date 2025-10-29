import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ReceiverInfo {
  id: string
  name?: string
  email?: string
  avatar?: string
  avatar_url?: string
}

export interface NotificationEventInfo {
  id: string
  type: 'quiz' | 'assignment' | string
  text: string
}

export interface NotificationRecord {
  id: string
  sender_id: string | null
  receiver_id: string
  entity_id: string
  created_at: string
  sender?: unknown | null
  receiver?: ReceiverInfo | null
  notification_event: NotificationEventInfo
}

interface NotificationsState {
  items: NotificationRecord[]
  connected: boolean
}

const initialState: NotificationsState = {
  items: [],
  connected: false,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload
    },
    setNotifications(state, action: PayloadAction<NotificationRecord[]>) {
      state.items = action.payload
    },
    addNotification(state, action: PayloadAction<NotificationRecord>) {
      const exists = state.items.some(n => n.id === action.payload.id)
      if (!exists) {
        state.items.unshift(action.payload)
      }
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(n => n.id !== action.payload)
    },
    removeManyNotifications(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.items = state.items.filter(n => !ids.has(n.id))
    },
    clearNotifications(state) {
      state.items = []
    },
  },
})

export const {
  setConnected,
  setNotifications,
  addNotification,
  removeNotification,
  removeManyNotifications,
  clearNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer


