import { useCallback, useMemo } from 'react';

// Video progress interface
export interface VideoProgress {
  currentTime: number;
  duration: number;
  timestamp: number;
  percentage: number;
}

// Hook for managing video progress
export const useVideoProgress = () => {
  // Save video progress to localStorage
  const saveVideoProgress = useCallback((videoId: string, currentTime: number, duration: number) => {
    if (duration > 0 && currentTime > 0) {
      const progress: VideoProgress = {
        currentTime,
        duration,
        timestamp: Date.now(),
        percentage: (currentTime / duration) * 100
      };
      
      try {
        localStorage.setItem(`video_progress_${videoId}`, JSON.stringify(progress));
        return progress;
      } catch (error) {
        console.error('Error saving video progress:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Load video progress from localStorage
  const loadVideoProgress = useCallback((videoId: string): VideoProgress | null => {
    try {
      const saved = localStorage.getItem(`video_progress_${videoId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
    return null;
  }, []);

  // Clear video progress
  const clearVideoProgress = useCallback((videoId: string) => {
    try {
      localStorage.removeItem(`video_progress_${videoId}`);
    } catch (error) {
      console.error('Error clearing video progress:', error);
    }
  }, []);

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
  const isVideoCompleted = useCallback((videoId: string): boolean => {
    const progress = loadVideoProgress(videoId);
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
    clearVideoProgress,
    getAllVideoProgress,
    getContinueWatchingVideos,
    findVideoPosition,
    isVideoCompleted,
    getCourseCompletion,
    throttledSaveProgress,
  };
}; 