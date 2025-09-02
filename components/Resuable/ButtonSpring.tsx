import React from 'react'

type ButtonSpringVariant = 'spinner' | 'dots'

interface ButtonSpringProps {
    loading?: boolean
    variant?: ButtonSpringVariant
    size?: number
    color?: string
    label?: string
    className?: string
}

export default function ButtonSpring({
    loading = true,
    variant = 'spinner',
    size = 16,
    color = '#0F2598',
    label,
    className,
}: ButtonSpringProps) {
    if (!loading) return null

    const dimension = `${size}px`

    return (
        <span
            className={`inline-flex items-center gap-2 ${className || ''}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            {variant === 'spinner' ? (
                <span
                    className="inline-block rounded-full border-2 border-current border-t-transparent animate-spin"
                    style={{ width: dimension, height: dimension, color }}
                    aria-hidden="true"
                />
            ) : (
                <span className="inline-flex items-center gap-[3px]" aria-hidden="true" style={{ color }}>
                    <span
                        className="inline-block rounded-full opacity-80 animate-bounce"
                        style={{ width: dimension, height: dimension, backgroundColor: 'currentColor', animationDelay: '0ms' }}
                    />
                    <span
                        className="inline-block rounded-full opacity-80 animate-bounce"
                        style={{ width: dimension, height: dimension, backgroundColor: 'currentColor', animationDelay: '120ms' }}
                    />
                    <span
                        className="inline-block rounded-full opacity-80 animate-bounce"
                        style={{ width: dimension, height: dimension, backgroundColor: 'currentColor', animationDelay: '240ms' }}
                    />
                </span>
            )}
            {label ? <span className="text-current text-sm">{label}</span> : null}
        </span>
    )
}
