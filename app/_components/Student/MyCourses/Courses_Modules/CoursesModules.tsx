"use client"
import React, { useState, useCallback, useEffect, useMemo } from "react";
import Modules_Sidebar from "./Modules_Sidebar";
import CustomVideoPlayer from "@/components/Resuable/CustomVideoPlayer";
import { useLazyGetSingleEnrolledCourseQuery, useLazyGetSingleLessonQuery, useLazyGetSingleEnrolledSeriesQuery } from "@/rtk/api/users/myCoursesApis";

interface CoursesModulesProps {
  seriesId: string;
  initialLessonId?: string;
}

export default function CoursesModules({ seriesId, initialLessonId }: CoursesModulesProps) {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState({
    video_id: "placeholder",
    video_title: "",
    video_url: "",
    video_duration: "",
    module: ""
  });
  const [videoKey, setVideoKey] = useState(0);

  const [fetchCourse, { data: courseResponse }] = useLazyGetSingleEnrolledCourseQuery();
  const [fetchLesson, { data: lessonResponse }] = useLazyGetSingleLessonQuery();
  const [fetchSeries, { data: seriesResponse }] = useLazyGetSingleEnrolledSeriesQuery();

  const handleLessonSelect = useCallback((lessonId: string) => {
    setCurrentVideo({
      video_id: "loading",
      video_title: "Loading...",
      video_url: "",
      video_duration: "",
      module: ""
    });
    setVideoKey(prev => prev + 1);

    setSelectedItemId(lessonId);
    const [kind, courseId] = lessonId.split("-", 2);

    if (kind === "intro" || kind === "end") {
      setActiveCourseId(courseId);
      fetchCourse(courseId);
    } else {
      fetchLesson(lessonId);
    }
  }, [fetchCourse, fetchLesson]);

  useEffect(() => {
    if (!courseResponse?.data || !selectedItemId) return;
    const course = courseResponse.data as any;
    const [kind] = selectedItemId.split("-", 2);

    if (kind === "intro" || kind === "end") {
      const title = kind === "intro" ? "Introduction" : "Conclusion";
      const url = kind === "intro" ? course.intro_video_url : course.end_video_url;
      if (url) {
        setCurrentVideo({
          video_id: selectedItemId,
          video_title: title,
          video_url: encodeURI(url),
          video_duration: course.video_length || "",
          module: course.title,
        });
        setVideoKey(prev => prev + 1);
      }
    }
  }, [courseResponse?.data, selectedItemId]);

  useEffect(() => {
    if (!lessonResponse?.data || !selectedItemId) return;
    const lesson = lessonResponse.data as any;

    const [kind] = selectedItemId.split("-", 2);
    if (kind !== "intro" && kind !== "end") {
      if (lesson.file_url) {
        setCurrentVideo({
          video_id: lesson.id,
          video_title: lesson.title,
          video_url: encodeURI(lesson.file_url),
          video_duration: lesson.video_length || "",
          module: lesson.course?.title || "",
        });
        setVideoKey(prev => prev + 1);
      }
    }
  }, [lessonResponse?.data, selectedItemId]);

  useEffect(() => {
    if (initialLessonId && !selectedItemId) {
      handleLessonSelect(initialLessonId);
    }
  }, [initialLessonId, selectedItemId, handleLessonSelect]);

  // Fetch series data for navigation
  useEffect(() => {
    if (seriesId) {
      fetchSeries(seriesId);
    }
  }, [seriesId, fetchSeries]);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  // Get all lessons for navigation
  const getAllLessons = useCallback(() => {
    if (!seriesResponse?.data?.courses) return [];
    
    const allLessons: any[] = [];
    seriesResponse.data.courses.forEach((course: any) => {
      // Add intro video if exists
      if (course.intro_video_url) {
        allLessons.push({
          id: `intro-${course.id}`,
          title: "Introduction",
          url: course.intro_video_url,
          duration: course.video_length,
          is_unlocked: true,
          kind: 'intro',
          courseId: course.id
        });
      }

      // Add lesson files
      course.lesson_files.forEach((lesson: any) => {
        allLessons.push({
          id: lesson.id,
          title: lesson.title,
          url: lesson.url,
          duration: lesson.video_length,
          is_unlocked: lesson.is_unlocked,
          kind: 'lesson',
          courseId: course.id
        });
      });

      // Add end video if exists
      if (course.end_video_url) {
        allLessons.push({
          id: `end-${course.id}`,
          title: "Conclusion",
          url: course.end_video_url,
          duration: course.video_length,
          is_unlocked: true,
          kind: 'end',
          courseId: course.id
        });
      }
    });
    
    return allLessons;
  }, [seriesResponse?.data]);

  const handlePreviousTrack = useCallback(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    
    if (currentIndex > 0) {
      const previousLesson = allLessons[currentIndex - 1];
      if (previousLesson.is_unlocked) {
        handleLessonSelect(previousLesson.id);
      }
    }
  }, [selectedItemId, getAllLessons, handleLessonSelect]);

  const handleNextTrack = useCallback(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      if (nextLesson.is_unlocked) {
        handleLessonSelect(nextLesson.id);
      }
    }
  }, [selectedItemId, getAllLessons, handleLessonSelect]);

  // Check if previous/next buttons should be disabled
  const isPreviousDisabled = useMemo(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    return currentIndex <= 0;
  }, [selectedItemId, getAllLessons]);

  const isNextDisabled = useMemo(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    return currentIndex >= allLessons.length - 1;
  }, [selectedItemId, getAllLessons]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isTheaterMode]);

  return (
    <div className={`flex max-w-7xl mx-auto gap-6 transition-all duration-500 ease-in-out ${isTheaterMode ? 'flex-col max-w-full px-0' : 'flex-col xl:flex-row '}`}>
      <div className={`bg-white h-fit rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-0' : 'flex-1 w-full min-w-0 p-2 lg:p-6'}`}>
        <CustomVideoPlayer
          videoData={currentVideo}
          className={isTheaterMode ? "" : "mb-4"}
          key={`${currentVideo.video_id}-${videoKey}`}
          isTheaterMode={isTheaterMode}
          onTheaterModeToggle={toggleTheaterMode}
          onPreviousTrack={handlePreviousTrack}
          onNextTrack={handleNextTrack}
          showVideoInfo={true}
          preload="metadata"
          showBuffering={true}
          autoPlay={true}
          showVolumeControls={true}
          showSkipControls={false}
          allowSeeking={true}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
        />
      </div>


      <Modules_Sidebar
        isTheaterMode={isTheaterMode}
        seriesId={seriesId}
        onLessonSelect={handleLessonSelect}
        selectedLessonId={selectedItemId}
      />
    </div>
  );
}