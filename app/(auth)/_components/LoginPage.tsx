'use client'

import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Logo from '@/components/Icons/Logo'
import { MdEmail } from 'react-icons/md'
import { FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { clearError } from '@/rtk/slices/authSlice'
import { useLoginMutation, useVerifyEmailMutation, useResendEmailVerificationMutation } from '@/rtk/api/authApi'
import LoginLoading from '@/components/Resuable/LoginLoading'
import EmailVerificationModal from './EmailVerificationModal'


interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const { error, isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [loginUser, { isLoading }] = useLoginMutation();
    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
    const [resendEmailVerification, { isLoading: isResending }] = useResendEmailVerificationMutation();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Email verification modal states
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [storedPassword, setStoredPassword] = useState('');

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setIsRedirecting(true);
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                if (user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/user/dashboard');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, user, router]);



    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await loginUser(data).unwrap();

            // Check if response has success: false (API might return 200 with success: false)
            if (result && result.success === false) {
                // Check if email verification is required
                // Type assertion to access data property that might exist in the response
                const responseData = result as any;
                if (responseData.data?.requires_verification || responseData.requires_verification) {
                    const errorMessage = result.message || 'Your email is not verified.';
                    toast.error(errorMessage);
                    // Show verification modal
                    setVerificationEmail(data.email);
                    setStoredPassword(data.password);
                    setShowVerificationModal(true);
                    return;
                }

                // Other error with success: false
                toast.error(result.message || 'Login failed. Please try again.');
                return;
            }

            toast.success(result.message || 'Login successful!');
        } catch (error: any) {
            // Debug: Log error structure to understand the format
            console.log('Login error:', error);
            console.log('Error data:', error?.data);

            // Check if email verification is required
            // Try multiple possible paths for the error structure
            const requiresVerification =
                error?.data?.data?.requires_verification ||
                error?.data?.requires_verification ||
                (error?.data?.data && typeof error.data.data === 'object' && error.data.data.requires_verification);

            if (requiresVerification) {
                const errorMessage = error?.data?.message || error?.data?.data?.message || 'Your email is not verified.';
                toast.error(errorMessage);
                // Show verification modal
                setVerificationEmail(data.email);
                setStoredPassword(data.password); // Store password for re-login after verification
                setShowVerificationModal(true);
                return;
            }

            let errorMessage = 'Login failed. Please try again.';

            if (error?.data?.message?.message) {
                errorMessage = error.data.message.message;
            } else if (error?.data?.message) {
                if (typeof error.data.message === 'string') {
                    errorMessage = error.data.message;
                } else if (error.data.message?.error) {
                    errorMessage = error.data.message.error;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleVerifyEmail = async (token: string) => {
        const response = await verifyEmail({
            email: verificationEmail,
            token: token
        }).unwrap();

        if (response.success) {
            toast.success(response.message || 'Email verified successfully!');
            setShowVerificationModal(false);
            // Try to login again after verification
            try {
                const loginData = { email: verificationEmail, password: storedPassword };
                await loginUser(loginData).unwrap();
                toast.success('Login successful!');
            } catch (loginError: any) {
                let loginErrorMessage = 'Login failed. Please try again.';
                if (loginError?.data?.message) {
                    loginErrorMessage = loginError.data.message;
                }
                toast.error(loginErrorMessage);
            }
        } else {
            throw new Error(response.message || 'Verification failed. Please try again.');
        }
    };

    const handleResendVerification = async () => {
        if (!verificationEmail) {
            toast.error('Email address is required');
            return;
        }

        const response = await resendEmailVerification({
            email: verificationEmail
        }).unwrap();

        if (response.success) {
            toast.success(response.message || 'Verification code resent successfully!');
        } else {
            throw new Error(response.message || 'Failed to resend verification code');
        }
    };

    const handleGoogleLogin = () => {
        const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
        const googleAuthUrl = `${baseURL}/api/auth/google`;
        window.location.href = googleAuthUrl;
    };

    // Show loading screen during login or redirect
    const showLoading = isLoading || isRedirecting;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white relative">
            {/* Custom Loading Overlay */}
            <LoginLoading isLoading={showLoading} />

            {/* left side login form */}
            <div className={`flex-1 flex items-center justify-center py-12 w-full px-5 transition-opacity duration-300 ${isRedirecting ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className="w-full lg:max-w-lg shadow-md border lg:border-none lg:shadow-none rounded-lg p-8 lg:p-0">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Logo />
                            <h2 className="text-xl font-bold text-[#1D1F2C] font-sans">The White  Eagles Academy</h2>
                        </div>
                        <p className=" text-center text-lg mt-4 font-medium font-sans">Let's sign in to your account</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer border-none bg-[#F1F3F4] py-6 flex items-center gap-2 text-2xl"
                            onClick={handleGoogleLogin}
                        >
                            <FcGoogle className="text-2xl" />
                            <span className="text-base font-medium">Google</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer border-none bg-[#F1F3F4] py-6 flex items-center gap-2 text-2xl"
                        >
                            <FaFacebook className="text-2xl" color="#1877F2" />
                            <span className="text-base font-medium">Facebook</span>
                        </Button>
                        <div className="flex items-center my-7">
                            <div className="flex-grow h-px bg-gray-200" />
                            <span className="mx-2 text-gray-400 text-lg">or sign in with email</span>
                            <div className="flex-grow h-px bg-gray-200" />
                        </div>
                        {/* Email input with icon */}
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                    <MdEmail />
                                </span>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="pl-10 pr-4 h-12 text-base"
                                />
                            </div>
                            <div className="min-h-[20px]">
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>
                        </div>
                        {/* Password input with icon and eye toggle */}
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                    <FaLock />
                                </span>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="pl-10 pr-10 h-12 text-base"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xl focus:outline-none"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            <div className="min-h-[20px]">
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-xs text-[#F1C27D] hover:underline">Forgot password?</Link>
                        </div>
                        <Button disabled={isLoading} type="submit" className="w-full py-6 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white font-semibold rounded-xl mt-2 text-lg disabled:opacity-70">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                    <div className="flex justify-center items-center mt-4">
                        <p className="text-sm text-gray-500">Don't have an account?<Link href="/sign-up" className="text-[#F1C27D] hover:underline font-medium ml-1"> Sign Up</Link></p>
                    </div>
                    {/* Demo credentials info */}
                    {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p><strong>Student:</strong> student@gmail.com / 123456</p>
                            <p><strong>Admin:</strong> admin@admin.com / 123456</p>
                        </div>
                    </div> */}
                </div>
            </div>
            {/* right side image */}
            <div className="hidden lg:flex flex-1 h-screen items-center justify-center w-full py-2">
                <Image
                    src="/images/login_regisiter/img.png"
                    alt="login"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain rounded-3xl"
                    priority
                />
            </div>

            {/* Email Verification Modal */}
            <EmailVerificationModal
                open={showVerificationModal}
                email={verificationEmail}
                onClose={() => setShowVerificationModal(false)}
                onVerify={handleVerifyEmail}
                onResend={handleResendVerification}
                isVerifying={isVerifying}
                isResending={isResending}
                autoResendOnOpen={true}
            />
        </div>
    )
}