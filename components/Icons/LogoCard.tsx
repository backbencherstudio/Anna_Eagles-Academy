import React from 'react'

interface LogoCardProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function LogoCard({ width = 28, height = 34, className }: LogoCardProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 28 34" 
      fill="none"
      className={className}
    >
    <path d="M0.891266 3.41266C0.891266 1.65759 2.31403 0.234818 4.0691 0.234818H21.5472C23.3023 0.234818 24.725 1.65758 24.725 3.41265V33.4432H4.0691C2.31403 33.4432 0.891266 32.0204 0.891266 30.2654V3.41266Z" fill="#F1C27D" />
    <path d="M0.891266 3.41266C0.891266 1.65759 2.31403 0.234818 4.0691 0.234818H21.5472C23.3023 0.234818 24.725 1.65758 24.725 3.41265V33.4432H4.0691C2.31403 33.4432 0.891266 32.0204 0.891266 30.2654V3.41266Z" fill="#F1C27D" />
    <path d="M6.60779 27.5971H25.5189V31.0864H6.60779C5.64423 31.0862 4.86365 30.3049 4.86365 29.3413C4.86387 28.3779 5.64437 27.5974 6.60779 27.5971Z" fill="#F1C27D" stroke="white" strokeWidth="1.58892" />
    <path d="M3.67238 32.6626H22.3422C24.0972 32.6626 25.52 31.2399 25.52 29.4848V6.09593" stroke="white" strokeWidth="1.58892" strokeLinecap="round" />
    <path d="M3.67238 32.6626H23.9311C25.6862 32.6626 27.1089 31.2399 27.1089 29.4848V6.09593" stroke="#F1C27D" strokeWidth="1.58892" strokeLinecap="round" />
</svg>
  )
}
