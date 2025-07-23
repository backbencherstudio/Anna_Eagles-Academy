'use client'
import React, { useState, useRef } from 'react';
import Logo from '@/components/Icons/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some(digit => digit === '')) {
            setOtpError('Please enter the complete OTP');
            return;
        }
        setOtpError('');
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            toast.success('OTP verified successfully');

        }, 2000);
    };

    const handleResendOtp = () => {
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
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
                        <p className="text-center text-lg mt-4 font-medium font-sans">Forgot your password?</p>
                        <p className="text-center text-sm text-gray-500 mt-2">Enter your email address and we'll send you a link to reset your password.</p>
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
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="flex flex-col items-center">
                                <p className="text-center text-base text-gray-700 mb-4">Enter the 6-digit code sent to <span className="font-semibold">{email}</span></p>
                                <div className="flex gap-2 justify-center mb-2">
                                    {otp.map((digit, idx) => (
                                        <Input
                                            key={idx}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(idx, e)}
                                            ref={el => { inputRefs.current[idx] = el; }}
                                            className="w-12 h-12 text-center text-xl border-gray-300 focus:border-[#F1C27D] focus:ring-[#F1C27D] rounded-md"
                                        />
                                    ))}
                                </div>
                                <div className="min-h-[20px]">
                                    {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
                                </div>
                                <Button type="submit" disabled={isVerifying} className="w-full py-6 mt-2 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-semibold rounded-xl text-lg">
                                    {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                                </Button>
                                <div className="flex w-full gap-3 mt-4">
                                    <Button type="button" variant="outline" onClick={handleBackToEmail} className="flex-1 cursor-pointer text-base border-gray-300 font-medium">
                                        Back
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={handleResendOtp} className="flex-1 cursor-pointer text-[#F1C27D] hover:underline text-sm font-medium border border-gray-200">
                                        Resend OTP
                                    </Button>

                                </div>
                            </div>
                        </form>
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
