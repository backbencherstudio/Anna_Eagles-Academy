"use client"
import React, { useState, useCallback, useEffect, useMemo } from "react";
import Modules_Sidebar from "./Modules_Sidebar";
import CustomVideoPlayer from "@/components/Resuable/VideoPlayer/CustomVideoPlayer";
import { useLazyGetSingleEnrolledCourseQuery, useLazyGetSingleLessonQuery, useLazyGetSingleEnrolledSeriesQuery, usePostLessonIdTokenMutation, useLazyGetDrmLessonVideoPlaybackQuery } from "@/rtk/api/users/myCoursesApis";
import { setCookie } from "@/lib/tokenUtils";
import axiosClient from "@/lib/axisoClients";

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
    module: "",
    video_type: "lesson" as 'intro' | 'end' | 'lesson'
  });
  const [videoKey, setVideoKey] = useState(0);
  const drmRefreshTimerRef = React.useRef<number | null>(null);

  const [fetchCourse, { data: courseResponse }] = useLazyGetSingleEnrolledCourseQuery();
  const [fetchLesson, { data: lessonResponse }] = useLazyGetSingleLessonQuery();
  const [fetchSeries, { data: seriesResponse }] = useLazyGetSingleEnrolledSeriesQuery();
  const [postLessonIdToken] = usePostLessonIdTokenMutation();
  const [triggerDrmPlaylist] = useLazyGetDrmLessonVideoPlaybackQuery();

  const handleLessonSelect = useCallback((lessonId: string) => {
    // Prevent double click - if same lesson already selected, ignore
    if (selectedItemId === lessonId) {
      return;
    }

    // Always fetch fresh data, even if clicking the same lesson
    setCurrentVideo({
      video_id: "loading",
      video_title: "Loading...",
      video_url: "",
      video_duration: "",
      module: "",
      video_type: "lesson"
    });
    setVideoKey(prev => prev + 1);

    setSelectedItemId(lessonId);
    
    // Update URL with selected video ID
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('watch', lessonId);
      window.history.pushState({}, '', url.toString());
    }
    
    const [kind, courseId] = lessonId.split("-", 2);

    if (kind === "intro" || kind === "end") {
      setActiveCourseId(courseId);
      fetchCourse(courseId);
    } else {
      // Fetch metadata for header display
      fetchLesson(lessonId);

      // DRM flow: get token, store in cookie, warm playlist, then set DRM URL to play
      (async () => {
        try {
          const tokenResp: any = await postLessonIdToken({ lesson_id: lessonId }).unwrap();
          const token: string | undefined = tokenResp?.data?.token;
          const expiresIn: number | undefined = tokenResp?.data?.expiresIn;
          if (token) {
            // store DRM token in cookie and localStorage for Shaka request headers
            const maxAge = typeof expiresIn === 'number' ? Math.max(1, expiresIn - 5) : 55;
            setCookie('drm_token', token, { maxAgeSeconds: maxAge });
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.setItem('drm_token', token);
              }
            } catch { /* no-op */ }

            // Fire playlist request to validate token (response not used for play)
            try {
              triggerDrmPlaylist({ lessonId: lessonId, token });
            } catch (_) { }

            // Build DRM playlist URL for player
            const base = (axiosClient.defaults.baseURL || '').replace(/\/$/, '');
            const playlistUrl = `${base}/api/student/series/lessons/${lessonId}/drm/playlist`;

            setCurrentVideo((prev) => {
              const newData = {
                ...prev,
                video_id: lessonId,
                video_url: encodeURI(playlistUrl),
                video_type: 'lesson' as const,
              };
              setVideoKey(Date.now());
              return newData;
            });

            // Setup periodic DRM token refresh slightly before expiry
            try {
              if (drmRefreshTimerRef.current) {
                window.clearInterval(drmRefreshTimerRef.current);
              }
              const intervalMs = Math.max(10000, ((expiresIn || 60) - 10) * 1000);
              drmRefreshTimerRef.current = window.setInterval(async () => {
                try {
                  const refreshResp: any = await postLessonIdToken({ lesson_id: lessonId }).unwrap();
                  const newToken: string | undefined = refreshResp?.data?.token;
                  const newExpires: number | undefined = refreshResp?.data?.expiresIn;
                  if (newToken) {
                    const newMaxAge = typeof newExpires === 'number' ? Math.max(1, newExpires - 5) : 55;
                    setCookie('drm_token', newToken, { maxAgeSeconds: newMaxAge });
                    try { if (typeof window !== 'undefined') { window.localStorage.setItem('drm_token', newToken); } } catch { }
                  }
                } catch { /* ignore refresh errors */ }
              }, intervalMs) as unknown as number;
            } catch { /* no-op */ }
          }
        } catch (_) {
          // ignore token errors, player will show error if needed
        }
      })();
    }
  }, [fetchCourse, fetchLesson, postLessonIdToken, triggerDrmPlaylist, selectedItemId]);

  useEffect(() => {
    if (!courseResponse?.data || !selectedItemId) return;
    const course = courseResponse.data as any;
    const [kind, courseId] = selectedItemId.split("-", 2);

    if (kind === "intro" || kind === "end") {
      const title = kind === "intro" ? "Introduction" : "Conclusion";
      const url = kind === "intro" ? course.intro_video_url : course.end_video_url;
      // Use intro_video_length or end_video_length instead of video_length
      const duration = kind === "intro" ? course.intro_video_length : course.end_video_length;

      if (url) {
        const courseProgress = course.course_progress;
        const lastPosition = kind === "intro"
          ? courseProgress?.intro_video_last_position
          : courseProgress?.end_video_last_position;
        
        const isCompleted = kind === "intro"
          ? courseProgress?.intro_video_completed || false
          : courseProgress?.end_video_completed || false;

        const newVideoData = {
          video_id: courseId,
          video_title: title,
          video_url: encodeURI(url),
          video_duration: duration || "",
          module: `${course.series?.title || course.title} - ${course.title}`,
          video_type: (kind === "intro" ? "intro" : "end") as 'intro' | 'end',
          last_position: lastPosition || 0,
          is_completed: isCompleted,
        };

        // Only update if URL actually changed
        setCurrentVideo((prev) => {
          if (prev.video_url !== newVideoData.video_url) {
            setVideoKey(Date.now());
            return newVideoData;
          }
          return prev;
        });
      }
    }
  }, [courseResponse, selectedItemId]);

  useEffect(() => {
    if (!lessonResponse?.data || !selectedItemId) return;
    const lesson = lessonResponse.data as any;
    const [kind] = selectedItemId.split("-", 2);
    if (kind !== "intro" && kind !== "end") {
      {
        // Get series title from the series data if available
        const seriesTitle = seriesResponse?.data?.title || lesson.series?.title || "";
        const courseTitle = lesson.course?.title || "";
        const moduleText = seriesTitle ? `${seriesTitle} - ${courseTitle}` : courseTitle;

        const newVideoData = {
          video_id: lesson.id,
          video_title: lesson.title,
          // Always use DRM playlist URL for playback
          video_url: encodeURI(`${(axiosClient.defaults.baseURL || '').replace(/\/$/, '')}/api/student/series/lessons/${lesson.id}/drm/playlist`),
          video_duration: lesson.video_length || "",
          module: moduleText,
          video_type: "lesson" as 'lesson',
          last_position: lesson.progress?.last_position || 0,
          is_completed: lesson.progress?.is_completed || false,
        };

        // Only update if URL actually changed
        setCurrentVideo((prev) => {
          if (prev.video_url !== newVideoData.video_url) {
            setVideoKey(Date.now());
            return newVideoData;
          }
          return prev;
        });
      }
    }
  }, [lessonResponse?.data, selectedItemId, seriesResponse?.data]);

  // Handle initial lesson selection from URL
  useEffect(() => {
    if (initialLessonId && !selectedItemId) {
      // Prevent double selection by checking if already selected
      const [kind, courseId] = initialLessonId.split("-", 2);

      // Set loading state
      setCurrentVideo({
        video_id: "loading",
        video_title: "Loading...",
        video_url: "",
        video_duration: "",
        module: "",
        video_type: "lesson"
      });
      setVideoKey(prev => prev + 1);
      setSelectedItemId(initialLessonId);

      // Fetch the lesson/course data
      if (kind === "intro" || kind === "end") {
        setActiveCourseId(courseId);
        fetchCourse(courseId);
      } else {
        fetchLesson(initialLessonId);
      }
    }
  }, [initialLessonId, selectedItemId, fetchCourse, fetchLesson]);

  // Fetch series data for navigation
  useEffect(() => {
    if (seriesId) {
      fetchSeries(seriesId);
    }
    return () => {
      if (drmRefreshTimerRef.current) {
        window.clearInterval(drmRefreshTimerRef.current);
        drmRefreshTimerRef.current = null;
      }
    };
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
          duration: course.intro_video_length,
          is_unlocked: course.course_progress?.intro_video_unlocked ?? true,
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
          duration: course.end_video_length,
          is_unlocked: course.course_progress?.end_video_unlocked ?? false,
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

  // Auto-play next video when current video ends - DISABLED
  const handleVideoEnd = useCallback(() => {
    // Don't automatically play next video when current video ends
    // User will need to manually select next video
    // handleNextTrack();
  }, []);

  // Check if previous/next buttons should be disabled
  const isPreviousDisabled = useMemo(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    if (currentIndex <= 0) return true;
    
    // Check if previous video is unlocked
    const previousLesson = allLessons[currentIndex - 1];
    return !previousLesson?.is_unlocked;
  }, [selectedItemId, getAllLessons]);

  const isNextDisabled = useMemo(() => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedItemId);
    if (currentIndex >= allLessons.length - 1) return true;
    
    // Check if next video is unlocked
    const nextLesson = allLessons[currentIndex + 1];
    return !nextLesson?.is_unlocked;
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
    <div className={`flex max-w-[1400px] mx-auto gap-6 transition-all duration-500 ease-in-out ${isTheaterMode ? 'flex-col max-w-full px-0' : 'flex-col xl:flex-row '}`}>
      <div className={`bg-white h-fit rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-0' : 'flex-1 w-full min-w-0 p-2 lg:p-6'}`}>
        <CustomVideoPlayer
          videoData={currentVideo}
          className={isTheaterMode ? "" : "mb-4"}
          key={`${currentVideo.video_id}-${videoKey}-${selectedItemId}`}
          isTheaterMode={isTheaterMode}
          onTheaterModeToggle={toggleTheaterMode}
          autoPlay={false}
          onVideoEnd={handleVideoEnd}
          onPreviousVideo={handlePreviousTrack}
          onNextVideo={handleNextTrack}
          hasPreviousVideo={!isPreviousDisabled}
          hasNextVideo={!isNextDisabled}
          allowSeeking={true}  // Set to false to disable seeking
        // Optional features - all enabled by default, uncomment to disable
        // showVolumeControl={false}   // Hide volume control
        // showPlaybackSpeed={false}   // Hide playback speed
        // showSkipControls={false}    // Hide skip buttons
        showFullscreen={true}      // Hide fullscreen button
        // showProgressBar={false}    // Hide progress bar

        // showSettings={true}                    
        // showTheaterMode={true}                
        // showPictureInPicture={true}            

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