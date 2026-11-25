import { NativeModules, Platform } from 'react-native';

export const WIDGET_SNAPSHOT_VERSION = 1;

/**
 * Builds a minimal, non-PII JSON snapshot for native home screen widgets.
 * Explicitly excludes userProfile.gender, exclusionZones, or any sensitive fields.
 */
export function buildWidgetSnapshot({
  generatedRoutine,
  activeCycle,
  cycleLengthWeeks = 8,
}) {
  const schedule = generatedRoutine?.schedule || [];
  if (!activeCycle?.isActive || schedule.length === 0) {
    return {
      version: WIDGET_SNAPSHOT_VERSION,
      isActive: false,
      dayTitle: 'No Active Program',
      weekLabel: '',
      dayIndex: 0,
      totalDays: 0,
      lastCompletedAt: null,
      exercises: [],
    };
  }

  const safeIndex = Math.max(
    0,
    Math.min(activeCycle.currentDayIndex || 0, schedule.length - 1)
  );
  const currentDay = schedule[safeIndex];
  const exercises = (currentDay?.exercises || []).map((ex) => ({
    id: String(ex.catalogId || ex.id || ''),
    name: String(ex.name || 'Exercise'),
    prescription: `${ex.sets ?? 3} × ${ex.reps ?? '8-12'}`,
  }));

  return {
    version: WIDGET_SNAPSHOT_VERSION,
    isActive: true,
    dayTitle: currentDay?.dayLabel || `Day ${safeIndex + 1}`,
    weekLabel: `Week ${activeCycle.currentWeek || 1} of ${cycleLengthWeeks}`,
    dayIndex: safeIndex,
    totalDays: schedule.length,
    lastCompletedAt: activeCycle.lastCompletedAt || null,
    exercises,
  };
}

/**
 * Syncs the minimal widget snapshot to native shared storage (App Group / SharedPreferences)
 * when a native widget bridge is installed (Stage 2 EAS build). Safe no-op on Web/Expo Go.
 */
export function syncWidgetSnapshot(state) {
  try {
    if (Platform.OS === 'web') return;
    const bridge = NativeModules?.FigWidgetBridge;
    if (!bridge || typeof bridge.updateSnapshot !== 'function') {
      return;
    }

    const snapshot = buildWidgetSnapshot({
      generatedRoutine: state.generatedRoutine,
      activeCycle: state.activeCycle,
      cycleLengthWeeks: state.userProfile?.cycleLengthWeeks || 8,
    });
    bridge.updateSnapshot(JSON.stringify(snapshot));
  } catch {
    // Non-fatal: widget sync must never break in-app workout flows
  }
}

/**
 * Allowlists a deep-linked exerciseId against the active day's exercises.
 * Returns the matched exercise ID or null if invalid/unrecognized.
 */
export function validateExerciseDeepLink(exerciseId, day) {
  if (typeof exerciseId !== 'string' || !exerciseId.trim()) return null;
  const cleanId = exerciseId.trim();
  const exercises = day?.exercises || [];
  const match = exercises.find(
    (ex) => String(ex.catalogId || ex.id) === cleanId
  );
  return match ? String(match.catalogId || match.id) : null;
}
