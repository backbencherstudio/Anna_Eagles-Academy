'use client'
import { useUserData } from '@/context/UserDataContext';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import ProfileImage from '@/components/Shared/ProfileImage';

export default function ProfilePage() {
    const { user } = useUserData();

    const [formData, setFormData] = useState({
        name: user?.name || 'Peter Parker',
        email: user?.email || 'peter.parker@example.com',
        title: 'Jr. Web/Mobile Developer',
        avatar: user?.profileImage || ''
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
            <Card className="border-0 p-4">
                <CardHeader className="">
                    <CardTitle className="text-lg md:text-xl font-semibold">Public Profile</CardTitle>
                    <CardDescription className="text-md text-gray-400 leading-relaxed">This will be displayed on your profile.</CardDescription>
                </CardHeader>
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
                                className="w-full"
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
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter your professional title"
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>

                {/* Profile Picture Section */}
                <ProfileImage />

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
    );
}
