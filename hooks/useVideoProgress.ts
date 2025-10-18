import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSetVideoProgressMutation } from '@/rtk/api/users/myCoursesApis';
import { setVideoProgress, setSavingProgress, setProgressError, clearProgressError, clearVideoProgress, clearAllProgress } from '@/rtk/slices/users/videoProgressSlice';
import { RootState } from '@/rtk';

// Video progress interface
export interface VideoProgress {
  currentTime: number;
  duration: number;
  timestamp: number;
  percentage: number;
}

// Hook for managing video progress
export const useVideoProgress = () => {
  const dispatch = useDispatch();
  const [setVideoProgressMutation] = useSetVideoProgressMutation();
  
  // Get progress data from Redux store
  const progressData = useSelector((state: RootState) => state.videoProgress.progressData);
  const isSaving = useSelector((state: RootState) => state.videoProgress.isSaving);
  const lastSaved = useSelector((state: RootState) => state.videoProgress.lastSaved);
  const error = useSelector((state: RootState) => state.videoProgress.error);

  // Save video progress to backend API
  const saveVideoProgress = useCallback(async (lessonId: string, currentTime: number, duration: number) => {
    if (duration > 0 && currentTime > 0) {
      const completionPercentage = Math.round((currentTime / duration) * 100);
      
      const progressData = {
        lesson_id: lessonId,
        time_spent: Math.round(currentTime),
        last_position: Math.round(currentTime),
        completion_percentage: completionPercentage,
      };

      try {
        dispatch(setSavingProgress(true));
        dispatch(clearProgressError());
        
        // Update local Redux state immediately for UI responsiveness
        dispatch(setVideoProgress(progressData));
        
        // Send to backend API
        await setVideoProgressMutation({
          lesson_id: lessonId,
          progress: completionPercentage
        }).unwrap();
        
        dispatch(setSavingProgress(false));
        return progressData;
      } catch (error: any) {
        console.error('Error saving video progress:', error);
        dispatch(setProgressError(error?.message || 'Failed to save progress'));
        dispatch(setSavingProgress(false));
        return null;
      }
    }
    return null;
  }, [dispatch, setVideoProgressMutation]);

  // Load video progress from Redux store
  const loadVideoProgress = useCallback((lessonId: string): VideoProgress | null => {
    const saved = progressData[lessonId];
    if (saved) {
      return {
        currentTime: saved.last_position,
        duration: saved.time_spent + (saved.last_position - saved.time_spent), // Estimate duration
        timestamp: lastSaved[lessonId] || Date.now(),
        percentage: saved.completion_percentage
      };
    }
    return null;
  }, [progressData, lastSaved]);

  // Clear video progress
  const clearVideoProgressData = useCallback((lessonId: string) => {
    dispatch(clearVideoProgress(lessonId));
  }, [dispatch]);

  // Get all video progress for a course
  const getAllVideoProgress = useCallback((course: any) => {
    const progress: { [key: string]: VideoProgress } = {};
    
    if (!course?.modules) return progress;

    course.modules.forEach((mod: any) => {
      mod.videos.forEach((vid: any) => {
        const savedProgress = loadVideoProgress(vid.video_id);
        if (savedProgress) {
          progress[vid.video_id] = savedProgress;
        }
      });
    });
    
    return progress;
  }, [loadVideoProgress]);

  // Get continue watching videos
  const getContinueWatchingVideos = useCallback((course: any, limit: number = 8) => {
    if (!course?.modules) return [];

    const allVideos = course.modules.flatMap((mod: any) =>
      mod.videos.map((vid: any) => ({
        ...vid,
        module: mod.module_title,
        module_id: mod.module_id,
      }))
    );

    const videosWithProgress = allVideos
      .map((vid: any) => {
        const progress = loadVideoProgress(vid.video_id);
        if (progress && progress.currentTime > 0 && progress.percentage < 95) {
          return {
            ...vid,
            progress,
            lastWatched: progress.timestamp,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.lastWatched - a.lastWatched) // Sort by most recently watched
      .slice(0, limit);

    return videosWithProgress;
  }, [loadVideoProgress]);

  // Find video position in course structure
  const findVideoPosition = useCallback((course: any, videoId: string) => {
    if (!course?.modules) return null;

    for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
      const module = course.modules[moduleIndex];
      for (let videoIndex = 0; videoIndex < module.videos.length; videoIndex++) {
        if (module.videos[videoIndex].video_id === videoId) {
          return { moduleIndex, videoIndex };
        }
      }
    }
    return null;
  }, []);

  // Check if video is completed (95% or more watched)
  const isVideoCompleted = useCallback((lessonId: string): boolean => {
    const progress = loadVideoProgress(lessonId);
    return progress ? progress.percentage >= 95 : false;
  }, [loadVideoProgress]);

  // Get course completion percentage
  const getCourseCompletion = useCallback((course: any): number => {
    if (!course?.modules) return 0;

    let totalVideos = 0;
    let completedVideos = 0;

    course.modules.forEach((mod: any) => {
      mod.videos.forEach((vid: any) => {
        totalVideos++;
        if (isVideoCompleted(vid.video_id)) {
          completedVideos++;
        }
      });
    });

    return totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  }, [isVideoCompleted]);

  // Throttle utility function
  const throttle = useCallback((func: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func(...args);
      }
    };
  }, []);

  // Create throttled save function
  const throttledSaveProgress = useMemo(() => 
    throttle(saveVideoProgress, 3000), 
    [saveVideoProgress, throttle]
  );

  return {
    saveVideoProgress,
    loadVideoProgress,
    clearVideoProgress: clearVideoProgressData,
    getAllVideoProgress,
    getContinueWatchingVideos,
    findVideoPosition,
    isVideoCompleted,
    getCourseCompletion,
    throttledSaveProgress,
    // Redux state
    progressData,
    isSaving,
    error,
    lastSaved,
  };
}; 