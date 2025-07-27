import React from 'react'
import LoginPage from '../_components/LoginPage'
import AuthGuard from '@/components/AuthGuard'

export default function Login() {
    return (
        <AuthGuard>
            <LoginPage />
        </AuthGuard>
    )
}
