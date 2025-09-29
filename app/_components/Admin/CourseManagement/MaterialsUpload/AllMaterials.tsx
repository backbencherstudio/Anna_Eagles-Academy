"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAllMaterialsQuery, useDeleteSingleMaterialMutation } from '@/rtk/api/admin/manageMaterialsApis';
import { Edit, Trash2, FileText, Video, Music, File } from 'lucide-react';
import ConfirmDialog from '@/components/Resuable/ConfirmDialog';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Material {
    id: string;
    title: string;
    description: string | null;
    lecture_type: string;
    file_url: string | null;
    created_at: string;
    updated_at: string;
    series: {
        id: string;
        title: string;
    } | null;
    course: {
        id: string;
        title: string;
    } | null;
}

interface AllMaterialsProps {
    activeTab: string;
    onEditMaterial?: (material: Material) => void;
}

const LECTURE_TYPE_CONFIG = {
    'lecture-slides': {
        label: 'Lecture Slides',
        icon: FileText,
        color: 'bg-blue-100 text-blue-800'
    },
    'video-lectures': {
        label: 'Video Lectures',
        icon: Video,
        color: 'bg-red-100 text-red-800'
    },
    'audio-lessons': {
        label: 'Audio Lessons',
        icon: Music,
        color: 'bg-green-100 text-green-800'
    },
    'other-document': {
        label: 'Other Document',
        icon: File,
        color: 'bg-gray-100 text-gray-800'
    }
};

export default function AllMaterials({ activeTab, onEditMaterial }: AllMaterialsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    // ==================== API HOOKS ====================
    const { data: materialsData, isLoading, error } = useGetAllMaterialsQuery({
        search: '',
        page: 1,
        limit: 50,
        lecture_type: activeTab
    });
    const [deleteMaterial, { isLoading: isDeleting }] = useDeleteSingleMaterialMutation();

    // ==================== COMPUTED VALUES ====================
    const materials = useMemo(() => {
        return materialsData?.data?.materials || [];
    }, [materialsData]);

    // ==================== EVENT HANDLERS ====================
    const handleEdit = (material: Material) => {
        if (onEditMaterial) {
            onEditMaterial(material);
        }
    };

    const handleDelete = (material: Material) => {
        setSelectedMaterial(material);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedMaterial) return;

        try {
            const response: any = await deleteMaterial(selectedMaterial.id).unwrap();
            toast.success(response?.message || 'Material deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedMaterial(null);
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to delete material';
            toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to delete material');
        }
    };

    const getFileIcon = (lectureType: string) => {
        const config = LECTURE_TYPE_CONFIG[lectureType as keyof typeof LECTURE_TYPE_CONFIG];
        return config ? config.icon : File;
    };

    const getFileTypeColor = (lectureType: string) => {
        const config = LECTURE_TYPE_CONFIG[lectureType as keyof typeof LECTURE_TYPE_CONFIG];
        return config ? config.color : 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ==================== RENDER HELPERS ====================
    const renderMaterialCard = (material: Material) => {
        const FileIcon = getFileIcon(material.lecture_type);
        const typeColor = getFileTypeColor(material.lecture_type);

        return (
            <Card key={material.id} className=" border border-gray-200 !shadow-none">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-row items-center justify-between gap-5">
                        <div className="flex items-center gap-4 flex-1 bo">
                            <div className="p-2 bg-gray-100 rounded-lg ">
                                <FileIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h3 className="xl:text-lg text-base font-semibold text-gray-900 truncate">
                                        {material.title}
                                    </h3>
                                    <Badge className={`text-xs py-1 px-2 hover:bg-transparent hover:shadow-none hover:border border-gray-200 hidden sm:block ${typeColor} flex-shrink-0 `}>
                                        {material.lecture_type.replace('-', ' ').replace('_', ' ')}
                                    </Badge>
                                </div>

                                {material.description && (
                                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                                        {material.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    {material.series && (
                                        <span>Series: <span className="text-gray-700">{material.series.title}</span></span>
                                    )}
                                    {material.course && (
                                        <span>Course: <span className="text-gray-700">{material.course.title}</span></span>
                                    )}
                                    <span>{formatDate(material.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            {material.file_url && (
                                <Link
                                    href={material.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 hover:underline mr-2"
                                >
                                    View File
                                </Link>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(material)}
                                className="h-8 cursor-pointer w-8 p-0 hover:bg-blue-50"
                            >
                                <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(material)}
                                className="h-8 cursor-pointer w-8 p-0 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // ==================== LOADING & ERROR STATES ====================
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2598] mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading materials...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error loading materials. Please try again.</p>
            </div>
        );
    }

    if (materials.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-500">Upload your first material to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    {materials.length} Material{materials.length !== 1 ? 's' : ''} Found
                </h3>
            </div>

            <div className="space-y-4">
                {materials.map(renderMaterialCard)}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Material"
                description={`Are you sure you want to delete "${selectedMaterial?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
}
