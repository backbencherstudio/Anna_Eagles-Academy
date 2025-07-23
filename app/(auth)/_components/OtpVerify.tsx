import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface OtpVerifyPageProps {
    email: string;
    onBack: () => void;
}

export default function OtpVerifyPage({ email, onBack }: OtpVerifyPageProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
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
            // Optionally, call a prop to notify parent of success
        }, 2000);
    };

    const handleResendOtp = () => {
        toast.success('OTP resent to your email');
        // Here you would handle resending the OTP
    };

    const handleBackToEmail = () => {
        onBack();
    };

    return (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
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
    );
}
