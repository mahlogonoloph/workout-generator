import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  generateWorkout as apiGenerateWorkout,
  findReplacementExercise,
  getPrescription,
  hydrateExerciseForSchedule,
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

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
  userProfile: { ...initialProfile },
  logistics: { ...initialLogistics },
  targeting: { ...initialTargeting },
  feedback: { ...initialFeedback },
  isGenerating: false,
  generatedRoutine: null,
  originalGeneratedRoutine: null,
  isEdited: false,
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

      if (!replacement) {
        return state;
      }

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
        isEdited: true,
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
   * Updates prescription (sets, reps, restSeconds) for a specific exercise in a day.
   */
  updateExercisePrescription: ({ dayIndex, exerciseIndex, sets, reps, restSeconds }) =>
    set((state) => {
      const routine = state.generatedRoutine;
      if (!routine || !routine.schedule || !routine.schedule[dayIndex]) return state;
      const day = routine.schedule[dayIndex];
      const currentEx = day.exercises[exerciseIndex];
      if (!currentEx) return state;

      const updatedExercises = [...day.exercises];
      updatedExercises[exerciseIndex] = {
        ...currentEx,
        sets: sets !== undefined ? Number(sets) : currentEx.sets,
        reps: reps !== undefined ? String(reps) : currentEx.reps,
        restSeconds: restSeconds !== undefined ? Number(restSeconds) : currentEx.restSeconds,
      };

      const updatedSchedule = [...routine.schedule];
      updatedSchedule[dayIndex] = {
        ...day,
        exercises: updatedExercises,
      };

      return {
        isEdited: true,
        generatedRoutine: {
          ...routine,
          schedule: updatedSchedule,
        },
      };
    }),

  /**
   * Deletes an exercise from a specific day in the routine.
   */
  deleteExercise: ({ dayIndex, exerciseIndex }) =>
    set((state) => {
      const routine = state.generatedRoutine;
      if (!routine || !routine.schedule || !routine.schedule[dayIndex]) return state;
      const day = routine.schedule[dayIndex];
      if (!day.exercises || !day.exercises[exerciseIndex]) return state;

      const updatedExercises = day.exercises.filter((_, idx) => idx !== exerciseIndex);
      const updatedSchedule = [...routine.schedule];
      updatedSchedule[dayIndex] = {
        ...day,
        exercises: updatedExercises,
      };

      return {
        isEdited: true,
        generatedRoutine: {
          ...routine,
          schedule: updatedSchedule,
        },
      };
    }),

  /**
   * Adds an exercise selected from the catalog to a specific day.
   */
  addExerciseToDay: ({ dayIndex, catalogExercise }) =>
    set((state) => {
      const routine = state.generatedRoutine;
      if (!routine || !routine.schedule || !routine.schedule[dayIndex]) return state;
      const day = routine.schedule[dayIndex];
      const currentExercises = day.exercises || [];

      const primaryGoal = state.userProfile?.primaryGoal || 'Hypertrophy / Muscle';
      const intensityRating = state.feedback?.intensityRating || 'optimal';
      const dayNumber = day.dayNumber || dayIndex + 1;
      const slotIndex = currentExercises.length;

      const hydrated = hydrateExerciseForSchedule(
        catalogExercise,
        dayNumber,
        slotIndex,
        primaryGoal,
        intensityRating
      );

      const updatedSchedule = [...routine.schedule];
      updatedSchedule[dayIndex] = {
        ...day,
        exercises: [...currentExercises, hydrated],
      };

      return {
        isEdited: true,
        generatedRoutine: {
          ...routine,
          schedule: updatedSchedule,
        },
      };
    }),

  /**
   * Reorders exercises within a day (moves item from fromIndex to toIndex).
   */
  reorderExercise: ({ dayIndex, fromIndex, toIndex }) =>
    set((state) => {
      const routine = state.generatedRoutine;
      if (!routine || !routine.schedule || !routine.schedule[dayIndex]) return state;
      const day = routine.schedule[dayIndex];
      const exercises = [...(day.exercises || [])];

      if (
        fromIndex < 0 ||
        fromIndex >= exercises.length ||
        toIndex < 0 ||
        toIndex >= exercises.length ||
        fromIndex === toIndex
      ) {
        return state;
      }

      const [moved] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, moved);

      const updatedSchedule = [...routine.schedule];
      updatedSchedule[dayIndex] = {
        ...day,
        exercises,
      };

      return {
        isEdited: true,
        generatedRoutine: {
          ...routine,
          schedule: updatedSchedule,
        },
      };
    }),

  /**
   * Reverts all manual customizations back to the original AI-generated routine blueprint.
   */
  resetToOriginalRoutine: () =>
    set((state) => {
      if (!state.originalGeneratedRoutine) return state;
      return {
        generatedRoutine: JSON.parse(JSON.stringify(state.originalGeneratedRoutine)),
        isEdited: false,
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
  setGeneratedRoutine: (generatedRoutine) =>
    set((state) => ({
      generatedRoutine,
      originalGeneratedRoutine:
        state.originalGeneratedRoutine ||
        (generatedRoutine ? JSON.parse(JSON.stringify(generatedRoutine)) : null),
      isEdited: false,
    })),

  // Reset Action
  resetStore: () =>
    set({
      userProfile: { ...initialProfile },
      logistics: { ...initialLogistics },
      targeting: { ...initialTargeting },
      feedback: { ...initialFeedback },
      isGenerating: false,
      generatedRoutine: null,
      originalGeneratedRoutine: null,
      isEdited: false,
      error: null,
    }),

  // Async Generation Action: calls API client and updates store
  generateWorkoutPlan: async () => {
    set({ isGenerating: true, error: null });
    try {
      const currentState = get();
      const plan = await apiGenerateWorkout(currentState);
      set({
        generatedRoutine: plan,
        originalGeneratedRoutine: JSON.parse(JSON.stringify(plan)),
        isEdited: false,
        isGenerating: false,
        error: null,
      });
      return { success: true, plan };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to generate a safe workout plan.';
      set({ isGenerating: false, error: errorMessage });
      return { success: false, error: err?.message || errorMessage };
    }
  },

  generateRoutine: async () => {
    return get().generateWorkoutPlan();
  },
}),
    {
      name: 'fig-workout-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        logistics: state.logistics,
        targeting: state.targeting,
        feedback: state.feedback,
        generatedRoutine: state.generatedRoutine,
        originalGeneratedRoutine: state.originalGeneratedRoutine,
        isEdited: state.isEdited,
      }),
    }
  )
);

export default useWorkoutStore;
