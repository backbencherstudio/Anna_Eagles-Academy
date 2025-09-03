import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageProps {
    onLanguageChange?: (languageCode: string) => void;
    className?: string;
}

export default function Language({ onLanguageChange, className = "" }: LanguageProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    // Language options
    const languageOptions = [
        { code: 'en', name: 'English', countryCode: 'US' },
        { code: 'bn', name: 'Bangla', countryCode: 'BD' },
        { code: 'es', name: 'Español', countryCode: 'ES' },
        { code: 'fr', name: 'Français', countryCode: 'FR' },
        { code: 'de', name: 'Deutsch', countryCode: 'DE' },
        { code: 'it', name: 'Italiano', countryCode: 'IT' },
        { code: 'pt', name: 'Português', countryCode: 'PT' },
        { code: 'nl', name: 'Nederlands', countryCode: 'NL' },
        { code: 'sv', name: 'Svenska', countryCode: 'SE' },
        { code: 'no', name: 'Norsk', countryCode: 'NO' },
        { code: 'da', name: 'Dansk', countryCode: 'DK' },
        { code: 'ro', name: 'Română', countryCode: 'RO' },
        { code: 'uk', name: 'Українська', countryCode: 'UA' },
    ];

    const currentLanguage = languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0];

    const handleLanguageChange = (languageCode: string) => {
        setSelectedLanguage(languageCode);
        // Call the parent callback if provided
        if (onLanguageChange) {
            onLanguageChange(languageCode);
        }
        // Here you can add logic to change the app language
        // For example, using i18n or context
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={`flex  cursor-pointer items-center gap-2 p-2 bg-[#F3F3F4] rounded-full hover:bg-gray-100 border border-gray-200 h-auto ${className}`}
                >
                    <ReactCountryFlag 
                        countryCode={currentLanguage.countryCode} 
                        svg 
                        style={{
                            width: '16px',
                            height: '12px',
                            borderRadius: '2px'
                        }}
                    />
                    <span className="text-sm font-medium text-[#070707] hidden sm:block">
                        {currentLanguage.code.toUpperCase()}
                    </span>
                    <ChevronDown className="h-3 w-3 text-[#070707]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className="w-48 mt-3">
                {languageOptions.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="cursor-pointer flex items-center gap-3"
                    >
                        <ReactCountryFlag 
                            countryCode={language.countryCode} 
                            svg 
                            style={{
                                width: '20px',
                                height: '15px',
                                borderRadius: '2px'
                            }}
                        />
                        <span className="flex-1">{language.name}</span>
                        {selectedLanguage === language.code && (
                            <span className="text-green-600 text-sm">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
