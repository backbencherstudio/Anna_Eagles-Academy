import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useSetIntroVideoProgressMutation, 
  useSetEndVideoProgressMutation, 
  useSetLessonVideoProgressMutation 
} from '@/rtk/api/users/myCoursesApis';
import { setVideoProgress, setSavingProgress, setProgressError, clearProgressError } from '@/rtk/slices/users/videoProgressSlice';
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
  const [setIntroVideoProgress] = useSetIntroVideoProgressMutation();
  const [setEndVideoProgress] = useSetEndVideoProgressMutation();
  const [setLessonVideoProgress] = useSetLessonVideoProgressMutation();
  
  // Get progress data from Redux store for loading saved progress
  const progressData = useSelector((state: RootState) => state.videoProgress.progressData);
  
  // Ref to track if saving is in progress
  const savingInProgressRef = useRef<{ [key: string]: boolean }>({});

  // Save video progress to backend API based on video type
  const saveVideoProgress = useCallback(async (
    videoId: string, 
    currentTime: number, 
    duration: number,
    videoType: 'intro' | 'end' | 'lesson'
  ) => {
    if (duration <= 0 || currentTime <= 0) return null;
    
    // Prevent duplicate saves
    if (savingInProgressRef.current[videoId]) return null;
    
    const completionPercentage = Math.round((currentTime / duration) * 100);
    const timeSpent = Math.round(currentTime);
    const lastPosition = Math.round(currentTime);
    
    const progressDataToSave = {
      lesson_id: videoId,
      time_spent: timeSpent,
      last_position: lastPosition,
      completion_percentage: completionPercentage,
    };

    try {
      savingInProgressRef.current[videoId] = true;
      dispatch(setSavingProgress(true));
      dispatch(clearProgressError());
      
      // Update local Redux state immediately for UI responsiveness
      dispatch(setVideoProgress(progressDataToSave));
      
      // Send to backend API based on video type
      let result;
      switch (videoType) {
        case 'intro':
          result = await setIntroVideoProgress({
            course_id: videoId,
            time_spent: timeSpent,
            last_position: lastPosition,
            completion_percentage: completionPercentage,
          }).unwrap();
          break;
        case 'end':
          result = await setEndVideoProgress({
            course_id: videoId,
            time_spent: timeSpent,
            last_position: lastPosition,
            completion_percentage: completionPercentage,
          }).unwrap();
          break;
        case 'lesson':
          result = await setLessonVideoProgress({
            lesson_id: videoId,
            time_spent: timeSpent,
            last_position: lastPosition,
            completion_percentage: completionPercentage,
          }).unwrap();
          break;
      }
      
      dispatch(setSavingProgress(false));
      savingInProgressRef.current[videoId] = false;
      return result;
    } catch (error: any) {
      console.error('Error saving video progress:', error);
      dispatch(setProgressError(error?.message || 'Failed to save progress'));
      dispatch(setSavingProgress(false));
      savingInProgressRef.current[videoId] = false;
      return null;
    }
  }, [dispatch, setIntroVideoProgress, setEndVideoProgress, setLessonVideoProgress]);

  // Load video progress from Redux store
  const loadVideoProgress = useCallback((lessonId: string): VideoProgress | null => {
    const saved = progressData[lessonId];
    if (saved) {
      return {
        currentTime: saved.last_position,
        duration: saved.time_spent + (saved.last_position - saved.time_spent),
        timestamp: Date.now(),
        percentage: saved.completion_percentage
      };
    }
    return null;
  }, [progressData]);

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

  // Create throttled save function (saves every 5 seconds)
  const throttledSaveProgress = useMemo(() => 
    throttle((videoId: string, currentTime: number, duration: number, videoType: 'intro' | 'end' | 'lesson') => {
      return saveVideoProgress(videoId, currentTime, duration, videoType);
    }, 5000), 
    [saveVideoProgress, throttle]
  );

  return {
    saveVideoProgress,
    loadVideoProgress,
    throttledSaveProgress,
  };
}; 