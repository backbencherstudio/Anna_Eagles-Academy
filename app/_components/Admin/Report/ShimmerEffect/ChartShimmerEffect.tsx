import React from 'react'

export default function ChartShimmerEffect() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px] relative">
        {/* Chart skeleton */}
        <div className="absolute inset-0 bg-gray-50 rounded-lg animate-pulse">
          {/* Grid lines skeleton */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-gray-200"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-gray-200"
                style={{ left: `${15 + i * 12}%` }}
              />
            ))}
          </div>
          
          {/* Chart lines skeleton */}
          <div className="absolute inset-0 p-4">
            <div className="w-full h-full relative">
              {/* Baseline line skeleton */}
              <div className="absolute w-full h-1 bg-gray-300 rounded animate-pulse" style={{ top: '30%' }} />
              {/* Policy line skeleton */}
              <div className="absolute w-full h-1 bg-gray-300 rounded animate-pulse" style={{ top: '60%' }} />
              
              {/* Data points skeleton */}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="absolute">
                  <div
                    className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
                    style={{ 
                      left: `${i * 12}%`, 
                      top: '25%' 
                    }}
                  />
                  <div
                    className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
                    style={{ 
                      left: `${i * 12}%`, 
                      top: '55%' 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Y-axis labels skeleton */}
          <div className="absolute left-2 top-4 space-y-8">
            {[0, 30, 60, 80, 100, 120].map((_, i) => (
              <div key={i} className="h-3 bg-gray-300 rounded animate-pulse w-8" />
            ))}
          </div>
          
          {/* X-axis labels skeleton */}
          <div className="absolute bottom-2 left-4 right-4 flex justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-300 rounded animate-pulse w-12" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
