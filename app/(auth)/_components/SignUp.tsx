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
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'
import { useRegister } from '@/hooks/useRegister'

export default function SignUp() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { isLoading, error, register: registerUser, clearError } = useRegister();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = watch('password');

    const onSubmit = async (data: any) => {
        try {
            clearError();
            await registerUser(data);
        } catch (err) {
            console.log('Error caught in SignUp component:', err);
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
                        <p className=" text-center text-lg mt-4 font-medium font-sans">Let’s get started with filling the form below</p>
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

                        {/* Error message display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {/* Name input with icon */}
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                    <FaUser />
                                </span>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    {...register('name', { required: 'Name is required' })}
                                    className="pl-10 pr-4 py-5 xl:py-6 text-base"
                                />
                            </div>
                            <div className="min-h-[20px]">
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
                            </div>
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
                                    className="pl-10 pr-4 py-5 xl:py-6 text-base"
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
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }
                                    })}
                                    className="pl-10 pr-10 py-5 xl:py-6 text-base"
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
                        {/* Confirm Password input with icon and eye toggle */}
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">
                                    <FaLock />
                                </span>
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword', {
                                        required: 'Confirm Password is required',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    className="pl-10 pr-10 py-5 xl:py-6 text-base"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xl focus:outline-none"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            <div className="min-h-[20px]">
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message as string}</p>}
                            </div>
                        </div>

                        <Button disabled={isLoading} type="submit" className="w-full py-6 cursor-pointer transition-all duration-300 bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white font-semibold rounded-xl mt-2 text-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign up'}
                        </Button>
                    </form>
                    <div className="flex justify-center items-center mt-4">
                        <p className="text-sm text-gray-500">already have an account?<Link href="/login" className="text-[#F1C27D] hover:underline font-medium ml-1"> Sign in</Link></p>
                    </div>
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