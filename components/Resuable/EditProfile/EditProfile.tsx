'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

import ProfileImage from '@/components/Shared/ProfileImage';
import { useAppSelector } from '@/rtk/hooks';

export default function EditProfile() {
    const user = useAppSelector((state) => state.auth.user)

    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        date_of_birth: user?.date_of_birth || '',
        avatar: user?.avatar || '',
        phone_number: user?.phone_number || '',
        whatsapp_number: (user as any)?.whatsapp_number || '',
        gender: user?.gender || '',
        address: user?.address || ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleSaveChanges = () => {
        // Handle save logic here
        // console.log('Saving changes:', formData);
        // You can add API call here to save the data
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Public Profile Section */}
            <Card className="border-0 pb-5">

                {/* Profile Picture Section */}
                <ProfileImage />

                <CardContent className="mb-4">
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full py-5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full py-5"
                            />
                        </div>

                        {
                            user?.role === 'user' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth" className="text-sm font-medium">
                                            Date of Birth
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full justify-start text-left font-normal py-5 ${!formData.date_of_birth ? 'text-muted-foreground' : ''}`}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.date_of_birth
                                                        ? format(new Date(formData.date_of_birth), 'PPP')
                                                        : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date_of_birth ? new Date(formData.date_of_birth) : undefined}
                                                    onSelect={(date) => {
                                                        if (!date) return;
                                                        const iso = format(date, 'yyyy-MM-dd');
                                                        handleInputChange('date_of_birth', iso);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Phone Number</Label>
                                        <div className="rp2-container">
                                            <PhoneInput
                                                country={"us"}
                                                enableSearch
                                                value={formData.phone_number as unknown as string}
                                                onChange={(value: string) => handleInputChange('phone_number', value || '')}
                                                inputProps={{ name: 'phone', required: false }}
                                                containerClass="w-full"
                                                inputClass="!w-full !px-12 !h-10 !text-sm !bg-background !border !border-input !rounded-md !px-3 !py-2 focus:!outline-none"
                                                buttonClass="!h-10 !border !border-input !rounded-l-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">WhatsApp Number (for international students)</Label>
                                        <div className="rp2-container">
                                            <PhoneInput
                                                country={"us"}
                                                enableSearch
                                                countryCodeEditable={false}
                                                value={formData.whatsapp_number as unknown as string}
                                                onChange={(value: string) => handleInputChange('whatsapp_number', value || '')}
                                                placeholder="+1555 123 4567"
                                                containerClass="w-full"
                                                inputClass="!w-full !px-12 !h-10 !text-sm !bg-background !border !border-input !rounded-md !px-3 !py-2 focus:!outline-none"
                                                buttonClass="!h-10 !border !border-input !rounded-l-md"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Include country code for international WhatsApp communication</p>
                                    </div>
                                </>
                            )
                        }


                        {/*  */}
                    </div>
                </CardContent>

                {/* Save Changes Button */}
                <div className="flex justify-end px-5">
                    <Button
                        onClick={handleSaveChanges}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-6 md:px-8 py-2 rounded-lg font-medium w-full md:w-auto"
                    >
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    )
}
