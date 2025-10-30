import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client'
import { getCookie } from '@/lib/tokenUtils'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (socket && socket.connected) return socket
  // prefer explicit socket url, else derive from API endpoint, else same-origin
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || ''
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ''
  const path = process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io'

  let baseUrl: string | undefined
  if (explicitUrl) {
    baseUrl = explicitUrl
  } else if (apiEndpoint) {
    try {
      const u = new URL(apiEndpoint)
      const wsProtocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
      baseUrl = `${wsProtocol}//${u.host}`
    } catch {
      baseUrl = undefined
    }
  } else {
    baseUrl = undefined // same-origin
  }

  // Basic connection; add auth headers/query if needed
  const token = typeof document !== 'undefined' ? (getCookie('access_token') || getCookie('token') || '') : ''
  const options: Partial<ManagerOptions & SocketOptions> = {
    path,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    withCredentials: true,
    auth: token ? { token } : undefined,
  }
  socket = baseUrl ? io(baseUrl, options) : io(undefined as unknown as string, options)
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Reusable helpers to standardize usage across components
export const onSocket = (event: string, handler: (...args: any[]) => void) => {
  const s = getSocket()
  s.on(event, handler)
}

export const offSocket = (event: string, handler: (...args: any[]) => void) => {
  if (!socket) return
  socket.off(event, handler)
}

export const emitSocket = (event: string, payload?: any) => {
  const s = getSocket()
  s.emit(event, payload)
}
