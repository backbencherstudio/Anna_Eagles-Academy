'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useChangePasswordMutation } from '@/rtk/api/authApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/rtk/index';
import { clearChangePasswordState } from '@/rtk/slices/authSlice';
import { useEffect } from 'react';

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const { changePasswordLoading, changePasswordError, changePasswordSuccess } = useSelector(
        (state: RootState) => state.auth
    );
    const [changePassword] = useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<ChangePasswordForm>();

    const newPassword = watch('newPassword');

    // Handle toast notifications based on Redux state
    useEffect(() => {
        if (changePasswordSuccess) {
            toast.success(changePasswordSuccess);
            reset(); // Clear the form
            dispatch(clearChangePasswordState()); // Clear the success message
        }
    }, [changePasswordSuccess, reset, dispatch]);

    useEffect(() => {
        if (changePasswordError) {
            toast.error(changePasswordError);
            dispatch(clearChangePasswordState()); // Clear the error message
        }
    }, [changePasswordError, dispatch]);

    const onSubmit = async (data: ChangePasswordForm) => {
        console.log('Form submitted with data:', data);
        
        // Clear any previous state
        dispatch(clearChangePasswordState());
        
        try {
            console.log('Calling changePassword API...');
            const result = await changePassword({
                old_password: data.currentPassword,
                new_password: data.newPassword
            });
            
            console.log('API Response:', result);
            
            // Handle the response manually instead of using unwrap()
            if (result.data) {
                console.log('Success response:', result.data);
                // The Redux slice will handle the success/error state
            } else if (result.error) {
                console.log('Error response:', result.error);
                // The Redux slice will handle the error state
            }
        } catch (error) {
            console.error('Catch block error:', error);
        }
    };

    const handleFormSubmit = handleSubmit(onSubmit);

    const handleButtonClick = () => {
        handleFormSubmit();
    };

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) return 'Password must contain at least one special character';
        return true;
    };

    const validateConfirmPassword = (value: string) => {
        if (!value) return 'Please confirm your password';
        if (value !== newPassword) return 'Passwords do not match';
        return true;
    };

    return (
        <>
            {/* Change Password Form */}
            <Card className="border-0 p-4">
                <CardHeader>
                    <CardTitle className="text-lg lg:text-xl font-semibold">Password Change</CardTitle>
                    <CardDescription className="text-md text-gray-400 leading-relaxed">
                        To change your password, please fill in the fields below. Your password must contain at least 8 characters,
                        it must also include at least 1 upper case letter, one lower case letter, one number, and one special character.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-1">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                                Current password
                            </Label>
                            <p className="text-sm text-gray-400">
                                This will help us to verified that this is really you
                            </p>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    placeholder="Enter your current password"
                                    className="pl-10 pr-10"
                                    {...register('currentPassword', { required: 'Current password is required' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-1">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                                New password
                            </Label>
                            <p className="text-sm text-gray-400">
                                Following our password guidelines will ensures a strong and protected login experience.
                            </p>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter your new password"
                                    className="pl-10 pr-10"
                                    {...register('newPassword', {
                                        validate: validatePassword
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm new password
                            </Label>
                            <p className="text-sm text-gray-400">
                                Ensure this password matches with the previous one
                            </p>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your new password"
                                    className="pl-10 pr-10"
                                    {...register('confirmPassword', {
                                        validate: validateConfirmPassword
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={handleButtonClick}
                                disabled={changePasswordLoading}
                                className="bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white px-6 lg:px-8 py-2 rounded-lg font-medium w-full lg:w-auto"
                            >
                                {changePasswordLoading ? 'Changing Password...' : 'Change Password'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
