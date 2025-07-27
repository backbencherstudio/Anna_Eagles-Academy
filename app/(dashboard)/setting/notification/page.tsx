'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail } from 'lucide-react';

interface NotificationSettings {
    pushNotifications: boolean;
    emailNotifications: boolean;
    emailCategories: {
        messagesMentions: boolean;
        reminderSchedules: boolean;
        interestingPromo: boolean;
        coursesUpdates: boolean;
        certificationAchievements: boolean;
    };
}

export default function NotificationPage() {
    const [settings, setSettings] = useState<NotificationSettings>({
        pushNotifications: false,
        emailNotifications: true,
        emailCategories: {
            messagesMentions: true,
            reminderSchedules: true,
            interestingPromo: false,
            coursesUpdates: true,
            certificationAchievements: true,
        }
    });

    const handlePushNotificationChange = (checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            pushNotifications: checked
        }));
    };

    const handleEmailNotificationChange = (checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            emailNotifications: checked
        }));
    };

    const handleEmailCategoryChange = (category: keyof NotificationSettings['emailCategories'], checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            emailCategories: {
                ...prev.emailCategories,
                [category]: checked
            }
        }));
    };

    const handleSaveChanges = () => {
        // console.log('Saving notification settings:', settings);
        // Add your API call here to save the settings
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Push Notification</CardTitle>
                    <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={handlePushNotificationChange}
                        className="data-[state=checked]:bg-[#F1C27D] cursor-pointer"
                    />
                </div>
            </CardHeader>
            <CardContent className="-mt-5">
                <p className="text-md text-gray-400 leading-relaxed">
                    Receive push notifications to stay updated on activities even when you're away from Courses.
                    You have the flexibility to disable them at any time. This preference applies to any account
                    accessed through this browser.
                </p>
            </CardContent>

            {/* Email Notification Section */}
            <div className="border-0">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900 ">Email Notification</CardTitle>
                        <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={handleEmailNotificationChange}
                            className="data-[state=checked]:bg-[#F1C27D] cursor-pointer"
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-md text-gray-400 leading-relaxed">
                        Get emails to find out what's going on when you're not on Courses. You can turn them off anytime.
                    </p>

                    {/* Email Categories */}
                    {settings.emailNotifications && (
                        <div className="space-y-0 pt-3">
                            <Separator />
                            <div className="space-y-0">
                                <div className="flex items-center justify-between py-3">
                                    <label
                                        htmlFor="messagesMentions"
                                        className="text-sm  font-medium cursor-pointer"
                                    >
                                        Messages mentions
                                    </label>
                                    <Checkbox
                                        id="messagesMentions"
                                        checked={settings.emailCategories.messagesMentions}
                                        onCheckedChange={(checked) =>
                                            handleEmailCategoryChange('messagesMentions', checked as boolean)
                                        }
                                        className="cursor-pointer data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D]"
                                    />
                                </div>
                                <Separator />

                                <div className="flex items-center justify-between py-3">
                                    <label
                                        htmlFor="reminderSchedules"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Reminder schedules
                                    </label>
                                    <Checkbox
                                        id="reminderSchedules"
                                        checked={settings.emailCategories.reminderSchedules}
                                        onCheckedChange={(checked) =>
                                            handleEmailCategoryChange('reminderSchedules', checked as boolean)
                                        }
                                        className="cursor-pointer data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D]"
                                    />
                                </div>
                                <Separator />

                                <div className="flex items-center justify-between py-3">
                                    <label
                                        htmlFor="interestingPromo"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Our interesting promo
                                    </label>
                                    <Checkbox
                                        id="interestingPromo"
                                        checked={settings.emailCategories.interestingPromo}
                                        onCheckedChange={(checked) =>
                                            handleEmailCategoryChange('interestingPromo', checked as boolean)
                                        }
                                        className="cursor-pointer data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D]"
                                    />
                                </div>
                                <Separator />

                                <div className="flex items-center justify-between py-3">
                                    <label
                                        htmlFor="coursesUpdates"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Courses Updates
                                    </label>
                                    <Checkbox
                                        id="coursesUpdates"
                                        checked={settings.emailCategories.coursesUpdates}
                                        onCheckedChange={(checked) =>
                                            handleEmailCategoryChange('coursesUpdates', checked as boolean)
                                        }
                                        className="cursor-pointer data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D]"
                                    />
                                </div>
                                <Separator />

                                <div className="flex items-center justify-between py-3">
                                    <label
                                        htmlFor="certificationAchievements"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Certification Achievements
                                    </label>
                                    <Checkbox
                                        id="certificationAchievements"
                                        checked={settings.emailCategories.certificationAchievements}
                                        onCheckedChange={(checked) =>
                                            handleEmailCategoryChange('certificationAchievements', checked as boolean)
                                        }
                                        className="cursor-pointer data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D]"
                                    />
                                </div>
                                <Separator />
                            </div>
                        </div>
                    )}
                </CardContent>

            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end pt-4 px-5">
                <Button
                    onClick={handleSaveChanges}
                    className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white px-6 py-2 rounded-lg font-medium text-sm"
                >
                    Save Changes
                </Button>
            </div>
        </Card>
    );
}
