'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Calendar as CalendarIcon, ChevronDownIcon, Edit3, X, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

import ProfileImage from '@/components/Shared/ProfileImage';
import { useAppSelector, useAppDispatch } from '@/rtk/hooks';
import { useUpdateProfileMutation } from '@/rtk/api/authApi';
import { updateUserProfile } from '@/rtk/slices/authSlice';
import toast from 'react-hot-toast';

export default function EditProfile() {
    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()
    const [open, setOpen] = React.useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

    // Parse the date_of_birth from ISO string to Date object
    const parseDateOfBirth = (dateString: string | undefined) => {
        if (!dateString) return undefined;
        try {
            return new Date(dateString);
        } catch {
            return undefined;
        }
    };

    const [date, setDate] = React.useState<Date | undefined>(
        parseDateOfBirth(user?.date_of_birth)
    )

    // Pure Redux approach - no local state for form data
    const [editingData, setEditingData] = useState<Record<string, string>>({});
    const [originalData, setOriginalData] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setEditingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditClick = () => {
        // Store current Redux data as original
        const currentData = {
            name: user?.name || '',
            email: user?.email || '',
            date_of_birth: user?.date_of_birth || '',
            avatar: user?.avatar || '',
            phone_number: user?.phone_number || '',
            whatsapp_number: user?.whatsapp_number || '',
            gender: user?.gender || '',
            address: user?.address || ''
        };
        setOriginalData(currentData);
        setEditingData(currentData);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setEditingData(originalData);
        setDate(parseDateOfBirth(originalData.date_of_birth));
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        try {
            // Prepare update data (exclude email as it should not be updated)
            const updateData = {
                name: editingData.name,
                date_of_birth: editingData.date_of_birth,
                phone_number: editingData.phone_number,
                whatsapp_number: editingData.whatsapp_number,
                gender: editingData.gender,
                address: editingData.address,
                avatar: editingData.avatar
            };
            const result = await updateProfile(updateData).unwrap();
            
            console.log('Update result:', result);
            
            // Update Redux store immediately with the response data
            if (result.user) {
                dispatch(updateUserProfile(result.user));
            } else {
                // If no user data in response, update with the data we sent
                dispatch(updateUserProfile(updateData));
            }
            
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            // Clear editing data - Redux will handle the update automatically
            setEditingData({});
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Public Profile Section */}
            <Card className="border-0 pb-5">


                {/* Profile Picture Section */}
                <ProfileImage />


                {/* Header with Edit Button */}
                <div className="flex justify-between items-center p-5 pb-0">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing ? (
                        <Button
                            onClick={handleEditClick}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Edit3 className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleCancelClick}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                size="sm"
                                disabled={isUpdating}
                                className="flex items-center gap-2 bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer disabled:opacity-50"
                            >
                                <Check className="h-4 w-4" />
                                {isUpdating ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    )}
                </div>
                {/* Edit Profile Section */}
                <CardContent className="mb-4">
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={isEditing ? editingData.name : user?.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full py-5"
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full py-5"
                                disabled={true}
                            />
                        </div>

                        {
                            (user?.role === 'user' || user?.type === 'student') && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="px-1">
                                            Date of birth
                                        </Label>
                                        <Popover open={open && isEditing} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-full cursor-pointer justify-between font-normal"
                                                    disabled={!isEditing}
                                                >
                                                    {date ? format(date, 'PPP') : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    captionLayout="dropdown"
                                                    onSelect={(selectedDate) => {
                                                        setDate(selectedDate)
                                                        if (selectedDate) {
                                                            handleInputChange('date_of_birth', selectedDate.toISOString())
                                                        }
                                                        setOpen(false)
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>

                                    </div>

                                    {/* Gender Dropdown */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-medium">
                                            Gender
                                        </Label>
                                        <Select
                                            value={isEditing ? editingData.gender : user?.gender || ''}
                                            onValueChange={(value) => handleInputChange('gender', value)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className="w-full py-5">
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Phone Number</Label>
                                        <div className="rp2-container">
                                            <PhoneInput
                                                country={"us"}
                                                enableSearch
                                                value={isEditing ? editingData.phone_number : user?.phone_number || ''}
                                                onChange={(value: string) => handleInputChange('phone_number', value || '')}
                                                inputProps={{ name: 'phone', required: false, disabled: !isEditing }}
                                                containerClass="w-full"
                                                inputClass="!w-full !px-12 !h-10 !text-sm !bg-background !border !border-input !rounded-md !px-3 !py-2 focus:!outline-none"
                                                buttonClass="!h-10 !border !border-input !rounded-l-md"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">WhatsApp Number <span className="text-xs text-muted-foreground">(for international students)</span></Label>
                                        <div className="rp2-container">
                                            <PhoneInput
                                                country={"us"}
                                                enableSearch
                                                countryCodeEditable={false}
                                                value={isEditing ? editingData.whatsapp_number : user?.whatsapp_number || ''}
                                                onChange={(value: string) => handleInputChange('whatsapp_number', value || '')}
                                                placeholder="+1555 123 4567"
                                                containerClass="w-full"
                                                inputClass="!w-full !px-12 !h-10 !text-sm !bg-background !border !border-input !rounded-md !px-3 !py-2 focus:!outline-none"
                                                buttonClass="!h-10 !border !border-input !rounded-l-md"
                                                inputProps={{ name: 'whatsapp', required: false, disabled: !isEditing }}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Include country code for international WhatsApp communication</p>
                                    </div>

                                    {/* address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm font-medium">
                                            Address <span className="text-xs text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="address"
                                            value={isEditing ? editingData.address : user?.address || ''}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your address (optional)"
                                            className="w-full py-5"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </>
                            )
                        }


                        {/*  */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
