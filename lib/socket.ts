import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client'
import { getCookie } from '@/lib/tokenUtils'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (socket && socket.connected) return socket
  // prefer explicit socket url, else derive from API endpoint
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || ''
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ''
  const path = process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io'
  let url = explicitUrl
  if (!url && apiEndpoint) {
    try {
      const u = new URL(apiEndpoint)
      // use wss for https endpoints, ws for http
      const wsProtocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
      url = `${wsProtocol}//${u.host}`
    } catch {
      url = ''
    }
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
  socket = io(url, options)
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}


