"use client"
import React, { useState, useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useGetSingleEnrolledSeriesQuery } from "@/rtk/api/users/myCoursesApis";

interface LessonFile {
  id: string;
  title: string;
  url: string;
  doc: string | null;
  kind: string;
  alt: string;
  position: number;
  video_length: string;
  lesson_progress: {
    lesson_id: string;
    id: string;
    is_completed: boolean;
    is_viewed: boolean;
    completed_at: string | null;
    viewed_at: string | null;
    time_spent: number | null;
    last_position: number | null;
    completion_percentage: number;
  } | null;
  is_unlocked: boolean;
}

interface Course {
  id: string;
  title: string;
  position: number;
  price: string;
  video_length: string;
  intro_video_url: string | null;
  end_video_url: string | null;
  lesson_files: LessonFile[];
  course_progress: {
    course_id: string;
    id: string;
    status: string;
    completion_percentage: number;
    is_completed: boolean;
    started_at: string;
    completed_at: string | null;
  };
}

interface ModulesSidebarProps {
  isTheaterMode: boolean;
  seriesId: string;
  onLessonSelect?: (lessonId: string) => void;
  selectedLessonId?: string | null;
}



export default function Modules_Sidebar({
  isTheaterMode,
  seriesId,
  onLessonSelect,
  selectedLessonId
}: ModulesSidebarProps) {
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Fetch series data directly in sidebar
  const { data: seriesResponse, isLoading, error } = useGetSingleEnrolledSeriesQuery(seriesId);
  const seriesData = seriesResponse?.data;

  // Convert courses to modules format (always run this logic)
  const modules = seriesData?.courses?.map((course: Course, index: number) => {
    const lessons = [];

    // Add intro video if exists
    if (course.intro_video_url) {
      lessons.push({
        id: `intro-${course.id}`,
        title: "Introduction",
        url: course.intro_video_url,
        duration: course.video_length,
        is_unlocked: true,
        lesson_progress: null,
        position: 0,
        kind: 'intro'
      });
    }

    // Add lesson files
    course.lesson_files.forEach((lesson: LessonFile) => {
      lessons.push({
        id: lesson.id,
        title: lesson.title,
        url: lesson.url,
        duration: lesson.video_length,
        is_unlocked: lesson.is_unlocked,
        lesson_progress: lesson.lesson_progress,
        position: lesson.position,
        kind: 'lesson'
      });
    });

    // Add end video if exists
    if (course.end_video_url) {
      lessons.push({
        id: `end-${course.id}`,
        title: "Conclusion",
        url: course.end_video_url,
        duration: course.video_length,
        is_unlocked: true,
        lesson_progress: null,
        position: lessons.length,
        kind: 'end'
      });
    }

    return {
      module_id: course.id,
      module_title: course.title,
      videos: lessons,
      course_progress: course.course_progress
    };
  }) || [];

  // Open first module by default when data loads
  useEffect(() => {
    if (seriesData && modules.length > 0 && openModules.length === 0) {
      setOpenModules([modules[0].module_id]);
    }
  }, [seriesData, modules.length, openModules.length]);

  // Auto-select the first available intro video when nothing is selected
  useEffect(() => {
    if (!onLessonSelect || selectedLessonId) return;
    if (!modules || modules.length === 0) return;

    const firstModule = modules[0];
    if (!firstModule || !firstModule.videos) return;

    const firstIntro = firstModule.videos.find((v: any) => v.kind === 'intro' && v.is_unlocked);
    const fallbackEnd = firstModule.videos.find((v: any) => v.kind === 'end' && v.is_unlocked);
    const toSelect = firstIntro || fallbackEnd;

    if (toSelect) {
      onLessonSelect(toSelect.id);
    }
  }, [modules, onLessonSelect, selectedLessonId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full xl:w-96 p-6'}`}>
        <div className="font-semibold text-lg mb-4">Modules</div>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full xl:w-96 p-6'}`}>
        <div className="font-semibold text-lg mb-4">Modules</div>
        <div className="text-red-500 text-center py-8">Error loading course data</div>
      </div>
    );
  }

  // If no series data, show empty state
  if (!seriesData) {
    return (
      <div className={`bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full xl:w-96 p-6'}`}>
        <div className="font-semibold text-lg mb-4">Modules</div>
        <div className="text-gray-500 text-center py-8">No course data available</div>
      </div>
    );
  }

  return (
    <div className={`bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full xl:w-96 p-6'}`}>
      <div className="font-semibold text-lg mb-4">Modules</div>
      <Accordion.Root
        type="single"
        className="flex flex-col gap-3"
        value={openModules[0] || ""}
        onValueChange={(value) => setOpenModules(value ? [value] : [])}
        collapsible
      >
        {modules.map((mod: any, modIdx: number) => (
          <Accordion.Item key={mod.module_id} value={mod.module_id} className="bg-[#FAFAFA] rounded-xl shadow-sm">
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center cursor-pointer justify-between px-4 py-3 font-medium text-base rounded-xl focus:outline-none group">
                <div>
                  <h1 className="text-md font-normal">{mod.module_title}</h1>
                  {/* <span className="ml-2 text-xs text-gray-400">
                    ({mod.videos.length} {mod.videos.length > 1 ? "Courses" : "Course"})
                  </span> */}
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="px-2 pb-3 pt-1">
              <div className="flex flex-col gap-2">
                {mod.videos.map((vid: any, vidIdx: number) => {
                  const isCompleted = vid.lesson_progress?.is_completed || false;
                  const completionPercentage = vid.lesson_progress?.completion_percentage || 0;
                  const isUnlocked = vid.is_unlocked;

                  const handleLessonClick = () => {
                    if (!isUnlocked) return;
                    if (onLessonSelect) {
                      onLessonSelect(vid.id);
                    }
                  };

                  const isSelected = selectedLessonId === vid.id;

                  return (
                    <div
                      key={vid.id}
                      onClick={handleLessonClick}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition font-medium text-sm w-full ${isUnlocked
                        ? isSelected
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 cursor-pointer'
                          : 'bg-[#FEF9F2] text-gray-700 cursor-pointer hover:bg-[#FDF4E7]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isUnlocked ? 'bg-gray-200' : 'bg-gray-300'}`}>
                        {isUnlocked ? (
                          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="14" fill={isCompleted ? "#10B981" : "#F1C27D"} />
                            <path d="M11 10V18L18 14L11 10Z" fill="#fff" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>

                      <div className="flex-1 text-left">
                        <div className="font-medium">{vid.title}</div>
                        {vid.lesson_progress && (
                          <div className="text-xs text-gray-500 mt-1">
                            {completionPercentage}% completed
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-500 mt-1">
                          {vid.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
