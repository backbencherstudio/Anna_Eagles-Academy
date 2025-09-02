import React from 'react'

interface ButtonSpringProps {
    size?: number
    color?: string
    label?: string
    className?: string
}

export default function ButtonSpring({ size = 16, color = '#0F2598', label, className }: ButtonSpringProps) {
    const dimension = `${size}px`

    return (
        <span className={`inline-flex items-center gap-2 ${className || ''}`}>
            <span
                className="inline-block rounded-full border-2 border-current border-t-transparent animate-spin"
                style={{ width: dimension, height: dimension, color }}
                aria-hidden="true"
            />
            {label ? <span className="text-current text-sm">{label}</span> : null}
        </span>
    )
}
