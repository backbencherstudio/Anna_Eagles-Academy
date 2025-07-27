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
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useUserData } from '@/context/UserDataContext'
import { useRouter } from 'next/navigation'

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const { login } = useUserData();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const result = await login(data.email, data.password);

            if (result.success && result?.user) {
                toast.success(result.message);

                // Redirect based on user role
                setTimeout(() => {
                    if (result.user?.role === 'admin') {
                        router.push('/dashboard');
                    } else {
                        router.push('/dashboard');
                    }
                }, 1000);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white ">
            {/* left side login form */}
            <div className="flex-1 flex items-center justify-center py-12 w-full px-5">
                <div className="w-full lg:max-w-lg shadow-md border lg:border-none lg:shadow-none rounded-lg p-8 lg:p-0">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Logo />
                            <h2 className="text-xl font-bold text-[#1D1F2C] font-sans">The White <br /> Eagles Academy</h2>
                        </div>
                        <p className=" text-center text-lg mt-4 font-medium font-sans">Let's sign in to your account</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer border-none bg-[#F1F3F4] py-6 flex items-center gap-2 text-2xl"
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
                        <Button disabled={isLoading} type="submit" className="w-full py-6 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white font-semibold rounded-xl mt-2 text-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}
                        </Button>
                    </form>
                    <div className="flex justify-center items-center mt-4">
                        <p className="text-sm text-gray-500">doesn't have an account?<Link href="/sign-up" className="text-[#F1C27D] hover:underline font-medium ml-1"> Sign Up</Link></p>
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
                    width={1200}
                    height={1200}
                    className="w-full h-full object-contain rounded-3xl"
                    priority
                />
            </div>
        </div>
    )
}