import { create } from 'zustand';
import { generateWorkout as apiGenerateWorkout } from '../api/generationClient.js';

/**
 * 1. Global Store Schema (Zustand)
 *
 * interface WorkoutStore {
 *   userProfile: { gender: string; primaryGoal: string; cycleLengthWeeks: number };
 *   logistics: { location: string; frequencyDays: number; durationMinutes: number };
 *   targeting: { focusAreas: string[]; exclusionZones: string[] };
 *   isGenerating: boolean;
 *   generatedRoutine: WorkoutPlan | null;
 *   error: string | null;
 * }
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

export const useWorkoutStore = create((set, get) => ({
  // Exact Store Schema State
  userProfile: { ...initialProfile },
  logistics: { ...initialLogistics },
  targeting: { ...initialTargeting },
  isGenerating: false,
  generatedRoutine: null,
  error: null,

  // Section Level Setters
  setUserProfile: (updates) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates },
    })),

  // Alias for updateProfile
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

  // Backwards compatibility alias for goal
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

  // Backwards compatibility alias for frequency
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

  // Backwards compatibility alias for duration
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
