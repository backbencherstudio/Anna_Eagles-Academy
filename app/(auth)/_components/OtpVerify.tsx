'use client'
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '@/rtk/api/authApi';
import { useRouter } from 'next/navigation';
import { MdLock } from 'react-icons/md';

interface OtpVerifyPageProps {
    email: string;
    onBack: () => void;
}

export default function OtpVerifyPage({ email, onBack }: OtpVerifyPageProps) {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate OTP
        if (otp.some(digit => digit === '')) {
            setOtpError('Please enter the complete OTP');
            return;
        }
        
        setOtpError('');
        // OTP is verified, show password fields
        setIsOtpVerified(true);
        toast.success('OTP verified successfully');
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            return;
        }
        
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        setPasswordError('');
        
        const token = otp.join('');
        
        try {
            const response = await resetPassword({
                email,
                token,
                password
            }).unwrap();
            
            // Show the exact message from API response
            toast.success(response.message || 'Password reset successfully');
            // Redirect to login page after successful reset
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to reset password. Please try again.';
            setPasswordError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleResendOtp = () => {
        toast.success('OTP resent to your email');
        // Here you would handle resending the OTP
    };

    const handleBackToEmail = () => {
        onBack();
    };

    return (
        <div className="space-y-6">
            {!isOtpVerified ? (
                // Step 1: Verify OTP
                <form onSubmit={handleOtpVerify} className="space-y-6">
                    <div className="flex flex-col w-full">
                        <p className="text-center text-base text-gray-700 mb-4">
                            Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
                        </p>
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
                            {otpError && <p className="text-xs text-red-500 mt-1 text-center">{otpError}</p>}
                        </div>
                        <Button type="submit" className="w-full py-6 mt-2 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-semibold rounded-xl text-lg">
                            Verify OTP
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
            ) : (
                // Step 2: Enter Password
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="flex flex-col w-full">
                        <p className="text-center text-base text-gray-700 mb-4">
                            OTP verified! Please enter your new password
                        </p>
                        
                        {/* Password Fields */}
                        <div className="space-y-4">
                            <div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                        <MdLock />
                                    </span>
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={e => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        className="pl-10 pr-4 py-5 xl:py-6 text-base"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                        <MdLock />
                                    </span>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={e => {
                                            setConfirmPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        className="pl-10 pr-4 py-5 xl:py-6 text-base"
                                    />
                                </div>
                                <div className="min-h-[20px]">
                                    {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <Button type="submit" disabled={isResetting} className="w-full py-6 mt-2 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-semibold rounded-xl text-lg">
                            {isResetting ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                        </Button>
                        <div className="flex w-full gap-3 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOtpVerified(false)} className="flex-1 cursor-pointer text-base border-gray-300 font-medium">
                                Back to OTP
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
