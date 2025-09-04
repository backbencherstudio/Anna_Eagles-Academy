import React, { useEffect, useRef, useState } from 'react'

interface WaveAnimationProps {
  isPlaying: boolean
  isActive: boolean
  progress: number
  animationTime: number
  className?: string
}

export default function WaveAnimation({ 
  isPlaying, 
  isActive, 
  progress, 
  animationTime, 
  className = "" 
}: WaveAnimationProps) {
  const [waveformData, setWaveformData] = useState<number[]>([])

  // Generate waveform data with controlled heights
  const generateWaveformData = () => {
    const data = []
    for (let i = 0; i < 30; i++) {
      // Create controlled wave patterns that fit within container
      const baseHeight = 40 + Math.sin(i * 0.2) * 15
      const variation = Math.sin(i * 0.5) * 10
      const noise = (Math.random() - 0.5) * 5
      data.push(Math.max(25, Math.min(80, baseHeight + variation + noise)))
    }
    return data
  }

  useEffect(() => {
    setWaveformData(generateWaveformData())
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes waveFlow {
          0% { transform: scaleY(0.3); }
          25% { transform: scaleY(1.1); }
          50% { transform: scaleY(0.7); }
          75% { transform: scaleY(1.3); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
      <div className={`flex items-center justify-center space-x-0.5 sm:space-x-1 md:space-x-1.5 w-full relative overflow-hidden h-16 sm:h-20 ${className}`}>
        {/* Left side waveform */}
        {waveformData.slice(0, 15).map((data, i) => {
          const baseHeight = data * 0.4;
          const animatedHeight = isPlaying ? 
            (baseHeight + Math.sin(animationTime * 0.3 + i * 0.3) * 6 + Math.sin(animationTime * 0.5 + i * 0.2) * 3) : 
            baseHeight;
          const isBarActive = isActive && i < (progress / 100) * 15;
          
          return (
            <div
              key={`left-${i}`}
              className={`rounded-full flex-1 transition-all duration-200 ease-in-out ${
                isBarActive ? 'bg-blue-500' : 'bg-amber-600'
              }`}
              style={{
                height: `${Math.max(animatedHeight, 12)}px`,
                minWidth: '2px',
                width: '3px',
                maxHeight: '50px',
                ...(isPlaying ? {
                  animationName: 'waveFlow',
                  animationDuration: `${1.2 + Math.sin(i) * 0.3}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                  animationDelay: `${i * 0.05}s`
                } : {
                  animation: 'none'
                })
              }}
            />
          );
        })}
        
        {/* Right side waveform */}
        {waveformData.slice(15, 30).map((data, i) => {
          const baseHeight = data * 0.4;
          const animatedHeight = isPlaying ? 
            (baseHeight + Math.sin(animationTime * 0.3 + (i + 15) * 0.3) * 6 + Math.sin(animationTime * 0.5 + (i + 15) * 0.2) * 3) : 
            baseHeight;
          const isBarActive = isActive && (i + 15) < (progress / 100) * 30;
          
          return (
            <div
              key={`right-${i}`}
              className={`rounded-full flex-1 transition-all duration-200 ease-in-out ${
                isBarActive ? 'bg-blue-500' : 'bg-amber-600'
              }`}
              style={{
                height: `${Math.max(animatedHeight, 12)}px`,
                minWidth: '2px',
                width: '3px',
                maxHeight: '50px',
                ...(isPlaying ? {
                  animationName: 'waveFlow',
                  animationDuration: `${1.2 + Math.sin(i + 20) * 0.3}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                  animationDelay: `${(i + 20) * 0.05}s`
                } : {
                  animation: 'none'
                })
              }}
            />
          );
        })}
      </div>
    </>
  )
}
