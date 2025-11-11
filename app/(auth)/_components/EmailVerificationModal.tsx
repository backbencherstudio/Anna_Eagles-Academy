'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface EmailVerificationModalProps {
    open: boolean
    email: string
    onClose: () => void
    onVerify: (token: string) => Promise<void>
    onResend: () => Promise<void>
    isVerifying?: boolean
    isResending?: boolean
    autoResendOnOpen?: boolean
}

export default function EmailVerificationModal({
    open,
    email,
    onClose,
    onVerify,
    onResend,
    isVerifying = false,
    isResending = false,
    autoResendOnOpen = false,
}: EmailVerificationModalProps) {
    const [verificationToken, setVerificationToken] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasAutoResentRef = useRef(false);
    const onResendRef = useRef(onResend);

    // Keep onResend ref updated
    useEffect(() => {
        onResendRef.current = onResend;
    }, [onResend]);

    // Countdown timer effect
    useEffect(() => {
        if (open) {
            setCountdown(300); // Reset to 5 minutes when modal opens
            hasAutoResentRef.current = false; // Reset auto-resend flag
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (countdownIntervalRef.current) {
                            clearInterval(countdownIntervalRef.current);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [open]);

    // Auto resend on open if enabled (separate effect to avoid infinite loop)
    useEffect(() => {
        if (open && autoResendOnOpen && email && !hasAutoResentRef.current) {
            hasAutoResentRef.current = true;
            onResendRef.current().catch(() => {
                // Error handling is done in parent component
            });
        }
    }, [open, autoResendOnOpen, email]);

    // Reset countdown when modal closes
    useEffect(() => {
        if (!open) {
            setCountdown(300); // Reset to 5 minutes
            setVerificationToken('');
            setVerificationError('');
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        }
    }, [open]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const canResend = countdown <= 180; // Can resend after 2 minutes

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerificationError('');

        if (!verificationToken.trim()) {
            setVerificationError('Verification token is required');
            return;
        }

        try {
            await onVerify(verificationToken);
        } catch (err: any) {
            let errorMessage = 'Verification failed. Please try again.';
            if (err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setVerificationError(errorMessage);
        }
    };

    const handleResend = async () => {
        if (!canResend) {
            return;
        }

        try {
            await onResend();
            // Reset countdown to 5 minutes after successful resend
            setCountdown(300);
        } catch (err: any) {
            // Error handling is done in parent component via toast
        }
    };

    const handleClose = () => {
        setVerificationToken('');
        setVerificationError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    // Prevent closing on outside click
                    return;
                }
            }}
        >
            <DialogContent
                className="sm:max-w-md"
                showCloseButton={false}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Verify Your Email</DialogTitle>
                    <DialogDescription className="text-center mt-2">
                        We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your email address.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerify} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="verification-token" className="block text-sm font-medium mb-2">
                            Verification Code
                        </label>
                        <Input
                            id="verification-token"
                            type="text"
                            placeholder="Enter verification code"
                            value={verificationToken}
                            onChange={(e) => {
                                setVerificationToken(e.target.value);
                                setVerificationError('');
                            }}
                            className="h-12 text-base"
                        />
                        {verificationError && (
                            <p className="text-xs text-red-500 mt-1">{verificationError}</p>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        {!canResend && countdown > 180 && (
                            <p className="text-xs text-gray-500">
                                Resend available in: <span className="font-semibold text-[#F1C27D]">{formatTime(countdown - 180)}</span>
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending || !canResend}
                            className="text-sm text-[#F1C27D] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 disabled:no-underline"
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="animate-spin w-4 h-4" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                "Didn't receive the code? Resend"
                            )}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 cursor-pointer"
                            disabled={isVerifying}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isVerifying || !verificationToken.trim()}
                            className="flex-1 cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white"
                        >
                            {isVerifying ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                'Verify Email'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

