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

export default function AdminLogin() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // setTimeout to simulate login
    const onSubmit = (data: any) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Login successful');
        }, 2000);
    };

    const handleGoogleLogin = () => {
        const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
        const googleAuthUrl = `${baseURL}/api/auth/google`;
        window.location.href = googleAuthUrl;
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
                        <p className=" text-center text-lg mt-4 font-medium font-sans">Let’s sign in to your account</p>
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
                                    {...register('email', { required: 'Email is required' })}
                                    className="pl-10 pr-4 h-12 text-base"
                                />
                            </div>
                            <div className="min-h-[20px]">
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
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
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message as string}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-xs text-[#F1C27D] hover:underline">Forgot password?</Link>
                        </div>
                        <Button disabled={isLoading} type="submit" className="w-full py-6 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white font-semibold rounded-xl mt-2 text-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}
                        </Button>
                    </form>

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
        </div>
    )
}