import { create } from 'zustand';
import {
  generateWorkout as apiGenerateWorkout,
  findReplacementExercise,
  getPrescription,
} from '../api/generationClient.js';

/**
 * Global Store Schema (Zustand) with Biomechanical Taxonomy & User Feedback Loop
 */

const initialProfile = {
  gender: '',
  primaryGoal: 'Hypertrophy / Muscle',
  cycleLengthWeeks: 8,
};

const initialLogistics = {
  location: 'Commercial Gym',
  frequencyDays: 4,
  durationMinutes: 60,
};

const initialTargeting = {
  focusAreas: [],
  exclusionZones: [],
};

const initialFeedback = {
  likedExerciseIds: [],
  dislikedExerciseIds: [],
  swapHistory: [], // Array of { fromName, toName, reason, timestamp }
  intensityRating: 'optimal', // 'too_easy' | 'optimal' | 'too_hard'
  preferSimplerMovements: false,
};

export const useWorkoutStore = create((set, get) => ({
  userProfile: { ...initialProfile },
  logistics: { ...initialLogistics },
  targeting: { ...initialTargeting },
  feedback: { ...initialFeedback },
  isGenerating: false,
  generatedRoutine: null,
  error: null,

  // Section Level Setters
  setUserProfile: (updates) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates },
    })),

  updateProfile: (updates) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates },
    })),

  setLogistics: (updates) =>
    set((state) => ({
      logistics: { ...state.logistics, ...updates },
    })),

  updateLogistics: (updates) =>
    set((state) => ({
      logistics: { ...state.logistics, ...updates },
    })),

  setTargeting: (updates) =>
    set((state) => ({
      targeting: { ...state.targeting, ...updates },
    })),

  updateTargeting: (updates) =>
    set((state) => ({
      targeting: { ...state.targeting, ...updates },
    })),

  // Granular Actions for userProfile
  setGender: (gender) =>
    set((state) => ({
      userProfile: { ...state.userProfile, gender },
    })),

  setPrimaryGoal: (primaryGoal) =>
    set((state) => ({
      userProfile: { ...state.userProfile, primaryGoal },
    })),

  setGoal: (goal) =>
    set((state) => ({
      userProfile: { ...state.userProfile, primaryGoal: goal },
    })),

  setCycleLengthWeeks: (cycleLengthWeeks) =>
    set((state) => ({
      userProfile: { ...state.userProfile, cycleLengthWeeks: Number(cycleLengthWeeks) || 8 },
    })),

  setTimeline: (timeline) => {
    const weeksMatch = String(timeline).match(/\d+/);
    const weeks = weeksMatch ? parseInt(weeksMatch[0], 10) : 8;
    return set((state) => ({
      userProfile: { ...state.userProfile, cycleLengthWeeks: weeks },
    }));
  },

  // Granular Actions for logistics
  setLocation: (location) =>
    set((state) => ({
      logistics: { ...state.logistics, location },
    })),

  setFrequencyDays: (frequencyDays) =>
    set((state) => ({
      logistics: { ...state.logistics, frequencyDays: Number(frequencyDays) || 3 },
    })),

  setFrequency: (frequency) => {
    const daysMatch = String(frequency).match(/\d+/);
    const days = daysMatch ? parseInt(daysMatch[0], 10) : 3;
    return set((state) => ({
      logistics: { ...state.logistics, frequencyDays: days },
    }));
  },

  setDurationMinutes: (durationMinutes) =>
    set((state) => ({
      logistics: { ...state.logistics, durationMinutes: Number(durationMinutes) || 60 },
    })),

  setDuration: (duration) => {
    const durationMatch = String(duration).match(/\d+/);
    const mins = durationMatch ? parseInt(durationMatch[0], 10) : 60;
    return set((state) => ({
      logistics: { ...state.logistics, durationMinutes: mins },
    }));
  },

  // Granular Actions for targeting
  setFocusAreas: (focusAreas) =>
    set((state) => ({
      targeting: { ...state.targeting, focusAreas },
    })),

  setExclusionZones: (exclusionZones) =>
    set((state) => ({
      targeting: { ...state.targeting, exclusionZones },
    })),

  toggleFocusArea: (area) =>
    set((state) => {
      const current = state.targeting.focusAreas || [];
      const updated = current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area];
      return {
        targeting: {
          ...state.targeting,
          focusAreas: updated,
        },
      };
    }),

  toggleExclusionZone: (zone) =>
    set((state) => {
      const current = state.targeting.exclusionZones || [];
      const updated = current.includes(zone)
        ? current.filter((item) => item !== zone)
        : [...current, zone];
      return {
        targeting: {
          ...state.targeting,
          exclusionZones: updated,
        },
      };
    }),

  // =========================================================================
  // USER FEEDBACK LOOP ACTIONS
  // =========================================================================

  /**
   * Toggles an exercise as "Liked / Favorite" so future generations prioritize it.
   */
  toggleLikeExercise: (catalogId) =>
    set((state) => {
      if (!catalogId) return state;
      const liked = state.feedback.likedExerciseIds || [];
      const isLiked = liked.includes(catalogId);
      const updatedLiked = isLiked
        ? liked.filter((id) => id !== catalogId)
        : [...liked, catalogId];

      // Also ensure it is removed from disliked if liked
      const updatedDisliked = (state.feedback.dislikedExerciseIds || []).filter(
        (id) => id !== catalogId
      );

      return {
        feedback: {
          ...state.feedback,
          likedExerciseIds: updatedLiked,
          dislikedExerciseIds: updatedDisliked,
        },
      };
    }),

  /**
   * Swaps an exercise on the active routine and updates the user feedback model
   * based on the user's stated reason ('equipment_busy', 'joint_pain', 'too_hard', 'dislike').
   */
  swapExerciseWithFeedback: ({ dayIndex, exerciseIndex, reason = 'dislike' }) =>
    set((state) => {
      const routine = state.generatedRoutine;
      if (!routine || !routine.schedule || !routine.schedule[dayIndex]) {
        return state;
      }

      const day = routine.schedule[dayIndex];
      const currentEx = day.exercises[exerciseIndex];
      if (!currentEx) return state;

      const existingDayCatalogIds = day.exercises.map((e) => e.catalogId || e.id);
      const replacement = findReplacementExercise({
        currentExercise: currentEx,
        storeState: state,
        existingDayCatalogIds,
        reason,
      });

      // Update feedback memory depending on reason
      const shouldBanPermanently =
        reason === 'dislike' || reason === 'joint_pain' || reason === 'too_hard';
      const currentDisliked = state.feedback.dislikedExerciseIds || [];
      const targetCatalogId = currentEx.catalogId || currentEx.id;

      const updatedDisliked =
        shouldBanPermanently && !currentDisliked.includes(targetCatalogId)
          ? [...currentDisliked, targetCatalogId]
          : currentDisliked;

      const updatedLiked = (state.feedback.likedExerciseIds || []).filter(
        (id) => id !== targetCatalogId
      );

      const newSwapEntry = {
        fromId: targetCatalogId,
        fromName: currentEx.name,
        toId: replacement.catalogId,
        toName: replacement.name,
        reason,
        timestamp: Date.now(),
      };

      const updatedExercises = [...day.exercises];
      updatedExercises[exerciseIndex] = {
        ...replacement,
        id: `ex-${day.dayNumber}-${exerciseIndex + 1}-${replacement.catalogId}`,
        swappedFrom: currentEx.name,
        swapReason: reason,
      };

      const updatedSchedule = [...routine.schedule];
      updatedSchedule[dayIndex] = {
        ...day,
        exercises: updatedExercises,
      };

      return {
        feedback: {
          ...state.feedback,
          likedExerciseIds: updatedLiked,
          dislikedExerciseIds: updatedDisliked,
          preferSimplerMovements:
            reason === 'too_hard' ? true : state.feedback.preferSimplerMovements,
          swapHistory: [newSwapEntry, ...(state.feedback.swapHistory || []).slice(0, 19)],
        },
        generatedRoutine: {
          ...routine,
          schedule: updatedSchedule,
        },
      };
    }),

  /**
   * Calibrates program intensity/volume ('too_easy', 'optimal', 'too_hard')
   * and immediately updates sets & rest times on the active routine.
   */
  setIntensityRating: (intensityRating) =>
    set((state) => {
      const primaryGoal = state.userProfile.primaryGoal || 'Hypertrophy / Muscle';
      const routine = state.generatedRoutine;

      let updatedRoutine = routine;
      if (routine && Array.isArray(routine.schedule)) {
        const updatedSchedule = routine.schedule.map((day) => ({
          ...day,
          exercises: (day.exercises || []).map((ex) => {
            const nextPrescription = getPrescription(
              primaryGoal,
              ex.tier || 'compound',
              intensityRating
            );
            return {
              ...ex,
              sets: nextPrescription.sets,
              reps: nextPrescription.reps,
              restSeconds: nextPrescription.restSeconds,
            };
          }),
        }));
        updatedRoutine = { ...routine, schedule: updatedSchedule };
      }

      return {
        feedback: {
          ...state.feedback,
          intensityRating,
        },
        generatedRoutine: updatedRoutine,
      };
    }),

  resetFeedback: () =>
    set({
      feedback: { ...initialFeedback },
    }),

  // Status & Routine Setters
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setGeneratedRoutine: (generatedRoutine) => set({ generatedRoutine }),

  // Reset Action
  resetStore: () =>
    set({
      userProfile: { ...initialProfile },
      logistics: { ...initialLogistics },
      targeting: { ...initialTargeting },
      feedback: { ...initialFeedback },
      isGenerating: false,
      generatedRoutine: null,
      error: null,
    }),

  // Async Generation Action: calls API client and updates store
  generateWorkoutPlan: async () => {
    set({ isGenerating: true, error: null });
    try {
      const currentState = get();
      const plan = await apiGenerateWorkout(currentState);
      set({ generatedRoutine: plan, isGenerating: false, error: null });
      return plan;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to generate workout plan.';
      set({ error: errorMessage, isGenerating: false });
      throw err;
    }
  },
}));

export default useWorkoutStore;
