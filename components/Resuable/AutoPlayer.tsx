'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import WaveAnimation from './WaveAnimation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { 
  setCurrentAudio, 
  playAudio, 
  pauseAudio, 
  stopAudio, 
  setCurrentTime, 
  setDuration, 
  setVolume, 
  toggleMute, 
  seekTo 
} from '@/lib/store/audioSlice'

interface AutoPlayerProps {
  audioUrl: string
  title: string
  duration?: string
  audioId: string
  className?: string
}

export default function AutoPlayer({ 
  audioUrl, 
  title, 
  duration, 
  audioId,
  className = ""
}: AutoPlayerProps) {
  const dispatch = useAppDispatch()
  const { 
    currentPlayingId, 
    isPlaying, 
    currentTime, 
    duration: audioDuration, 
    volume, 
    isMuted 
  } = useAppSelector((state) => state.audio)
  
  const [animationTime, setAnimationTime] = useState(0)
  const [metaDuration, setMetaDuration] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number | null>(null)
  
  const isCurrentlyPlaying = currentPlayingId === audioId

  // When this player is no longer the current one, ensure it is paused.
  // Do not auto-play when it becomes current; playback is controlled by isPlaying state.
  useEffect(() => {
    if (!isCurrentlyPlaying && audioRef.current) {
      audioRef.current.pause()
    }
  }, [isCurrentlyPlaying])

  // Handle play/pause state changes
  useEffect(() => {
    if (isCurrentlyPlaying && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isCurrentlyPlaying])

  useEffect(() => {
    const animate = () => {
      if (isPlaying && isCurrentlyPlaying) {
        setAnimationTime((prev: number) => prev + 0.016) // ~60fps
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    
    if (isPlaying && isCurrentlyPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isCurrentlyPlaying])

  // If we already have metadata duration locally and this card becomes active, sync it to Redux
  useEffect(() => {
    if (isCurrentlyPlaying && audioDuration === 0 && metaDuration > 0) {
      dispatch(setDuration(metaDuration))
    }
  }, [isCurrentlyPlaying, metaDuration, audioDuration, dispatch])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current && isCurrentlyPlaying) {
      dispatch(setCurrentTime(audioRef.current.currentTime))
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration
      setMetaDuration(d)
      if (isCurrentlyPlaying) {
        dispatch(setDuration(d))
      }
    }
  }

  const handleAudioError = () => {
    console.log('Audio error occurred')
    dispatch(setCurrentTime(0))
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && isCurrentlyPlaying) {
      const seekTime = (parseFloat(e.target.value) / 100) * audioDuration
      audioRef.current.currentTime = seekTime
      dispatch(seekTo(seekTime))
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    dispatch(setVolume(newVolume))
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleMuteToggle = () => {
    const willMute = !isMuted
    dispatch(toggleMute())
    if (audioRef.current) {
      audioRef.current.volume = willMute ? 0 : volume
    }
  }

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      if (isPlaying) {
        dispatch(pauseAudio())
      } else {
        dispatch(playAudio())
      }
    } else {
      dispatch(setCurrentAudio({ id: audioId, url: audioUrl }))
    }
  }

  const effectiveDuration = isCurrentlyPlaying
    ? (audioDuration > 0 ? audioDuration : metaDuration)
    : metaDuration
  const progress = isCurrentlyPlaying && effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0

  return (
    <div className={`bg-gray-100 rounded-lg p-3 sm:p-4 md:p-6 mb-4 relative overflow-hidden ${className}`}>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .volume-slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* Audio Waveform */}
      <div className="mb-3 sm:mb-4 w-full relative overflow-hidden">
        <WaveAnimation
          isPlaying={isPlaying && isCurrentlyPlaying}
          isActive={isCurrentlyPlaying}
          progress={progress}
          animationTime={animationTime}
        />
        
        {/* Play Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={handlePlayPause}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center transition-all cursor-pointer duration-200 hover:scale-105"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-[#F1C27D] rounded-full flex items-center justify-center">
              {isCurrentlyPlaying && isPlaying ? (
                <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
              ) : (
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white ml-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-2 sm:mb-3">
        <input
          type="range"
          min="0"
          max="100"
          value={isCurrentlyPlaying ? progress : 0}
          onChange={handleSeek}
          disabled={!isCurrentlyPlaying}
          className={`w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none slider ${
            isCurrentlyPlaying ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          style={{
            background: `linear-gradient(to right, #F1C27D 0%, #F1C27D ${progress}%, #E5E7EB ${progress}%, #E5E7EB 100%)`
          }}
        />
      </div>

      {/* Audio Controls */}
      {isCurrentlyPlaying && isPlaying && (
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          {/* Volume Control */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleMuteToggle}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              ) : (
                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer volume-slider"
              style={{
                background: `linear-gradient(to right, #F1C27D 0%, #F1C27D ${(isMuted ? 0 : volume) * 100}%, #E5E7EB ${(isMuted ? 0 : volume) * 100}%, #E5E7EB 100%)`
              }}
            />
          </div>
        </div>
      )}
      
      {/* Time Display */}
      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
        <span>{isCurrentlyPlaying ? formatTime(currentTime) : '0:00'}</span>
        <span>{effectiveDuration > 0 ? formatTime(effectiveDuration) : (duration ?? '--:--')}</span>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onEnded={() => {
          if (isCurrentlyPlaying) {
            dispatch(setCurrentTime(0))
            dispatch(pauseAudio())
          }
        }}
        onPause={() => {
          if (isCurrentlyPlaying) {
            dispatch(pauseAudio())
          }
        }}
        onPlay={() => {
          if (isCurrentlyPlaying) {
            dispatch(playAudio())
          }
        }}
        preload="metadata"
        style={{ display: 'none' }}
      />
    </div>
  )
}
