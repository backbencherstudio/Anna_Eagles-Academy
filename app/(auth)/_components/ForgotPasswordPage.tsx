'use client'
import React, { useState } from 'react';
import Logo from '@/components/Icons/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OtpVerifyPage from './OtpVerify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        setError('');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            toast.success('OTP sent to your email');
        }, 2000);

    };

    const handleBackToEmail = () => {
        setStep('email');

    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white">
            {/* left side forgot password form */}
            <div className="flex-1 flex items-center justify-center py-12 w-full px-5">
                <div className="w-full lg:max-w-lg shadow-md border lg:border-none lg:shadow-none rounded-lg p-8 lg:p-0">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Logo />
                            <h2 className="text-xl font-bold text-[#1D1F2C] font-sans">The White <br /> Eagles Academy</h2>
                        </div>
                        {step === 'email' ? (
                            <>
                                <p className="text-center text-lg mt-4 font-medium font-sans">Forgot your password?</p>
                                <p className="text-center text-sm text-gray-500 mt-2">Enter your email address and we'll send you a link to reset your password.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-center text-lg mt-4 font-medium font-sans">Check your email</p>
                                <p className="text-center text-sm text-gray-500 mt-2">Enter the 6-digit code sent to your email address.</p>
                            </>
                        )}
                    </div>
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                        <MdEmail />
                                    </span>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="pl-10 pr-4 py-5 xl:py-6 text-base"
                                    />
                                </div>
                                <div className="min-h-[20px]">
                                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                                </div>
                            </div>
                            <Button disabled={isLoading} type="submit" className="w-full py-6 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white font-semibold rounded-xl mt-2 text-lg">
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    )}
                    {step === 'otp' && (
                        <OtpVerifyPage
                            email={email}
                            onBack={handleBackToEmail}
                        />
                    )}
                </div>
            </div>
            {/* right side image */}
            <div className="hidden lg:flex flex-1 h-screen items-center justify-center w-full py-2">
                <Image
                    src="/images/login_regisiter/img.png"
                    alt="forgot password"
                    width={1200}
                    height={1200}
                    className="w-full h-full object-contain rounded-3xl"
                    priority
                />
            </div>
        </div>
    );
}
