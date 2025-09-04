import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AudioState {
  currentPlayingId: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  audioUrl: string | null
}

const initialState: AudioState = {
  currentPlayingId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  audioUrl: null,
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setCurrentAudio: (state, action: PayloadAction<{ id: string; url: string }>) => {
      state.currentPlayingId = action.payload.id
      state.audioUrl = action.payload.url
      state.isPlaying = true
      state.currentTime = 0
      state.duration = 0
    },
    playAudio: (state) => {
      state.isPlaying = true
    },
    pauseAudio: (state) => {
      state.isPlaying = false
    },
    stopAudio: (state) => {
      state.currentPlayingId = null
      state.isPlaying = false
      state.currentTime = 0
      state.duration = 0
      state.audioUrl = null
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload
      state.isMuted = action.payload === 0
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    seekTo: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
  },
})

export const {
  setCurrentAudio,
  playAudio,
  pauseAudio,
  stopAudio,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  seekTo,
} = audioSlice.actions

export default audioSlice.reducer
