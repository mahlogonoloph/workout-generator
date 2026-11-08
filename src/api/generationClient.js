/**
 * API Integration & Biomechanical Rule Engine
 * Powered by the wger Open-Source Exercise Taxonomy + Movement Pattern Split Engine + User Feedback Loop.
 */
import {
  WGER_EXERCISE_CATALOG,
  MOVEMENT_PATTERNS,
  MUSCLE_GROUPS,
  SPLIT_TEMPLATES,
} from '../data/wgerExerciseCatalog.js';

export { WGER_EXERCISE_CATALOG, MOVEMENT_PATTERNS, MUSCLE_GROUPS };

/**
 * Filters catalog exercises by environment, joint exclusions, and user-disliked exercises.
 */
export function filterCandidateExercises({
  location = 'Commercial Gym',
  exclusionZones = [],
  dislikedExerciseIds = [],
}) {
  const normalizedExclusions = (exclusionZones || []).map((z) => z.toLowerCase());
  const dislikedSet = new Set(dislikedExerciseIds || []);

  // 1. Filter by environment/location
  const locationPool = WGER_EXERCISE_CATALOG.filter((ex) =>
    (ex.locations || []).includes(location)
  );

  const poolToFilter = locationPool.length > 0 ? locationPool : WGER_EXERCISE_CATALOG;

  // 2. Filter out joint stress exclusions & user-disliked exercises
  const safePool = poolToFilter.filter((item) => {
    if (dislikedSet.has(item.id) || dislikedSet.has(item.name)) {
      return false;
    }
    const stresses = (item.jointStress || []).map((s) => s.toLowerCase());
    return !stresses.some((stress) => normalizedExclusions.includes(stress));
  });

  // Return safe exercises only. Under NO circumstances return poolToFilter when safePool is empty!
  return safePool;
}

/**
 * Calculates sets, reps, and rest intervals based on goal, exercise tier, and user intensity feedback.
 */
export function getPrescription(primaryGoal, tier = 'compound', intensityRating = 'optimal') {
  const normalized = (primaryGoal || '').toLowerCase();
  let baseSets = 3;
  let reps = '8-12';
  let restSeconds = 90;

  if (normalized.includes('strength') || normalized.includes('power')) {
    baseSets = tier === 'compound' ? 4 : 3;
    reps = tier === 'compound' ? '4-6' : '8-10';
    restSeconds = tier === 'compound' ? 150 : 90;
  } else if (normalized.includes('fat') || normalized.includes('tone') || normalized.includes('weight')) {
    baseSets = 3;
    reps = '12-15';
    restSeconds = 60;
  } else if (normalized.includes('endurance') || normalized.includes('stamina')) {
    baseSets = 3;
    reps = '15-20';
    restSeconds = 45;
  } else if (normalized.includes('longevity') || normalized.includes('mobility')) {
    baseSets = 3;
    reps = '10-12';
    restSeconds = 75;
  } else {
    // Hypertrophy / Muscle Default
    baseSets = tier === 'compound' ? 4 : 3;
    reps = tier === 'compound' ? '6-10' : '10-15';
    restSeconds = tier === 'compound' ? 105 : 75;
  }

  // Apply Feedback Loop Intensity Calibration
  if (intensityRating === 'too_easy') {
    baseSets += 1;
    restSeconds = Math.max(45, restSeconds - 15);
  } else if (intensityRating === 'too_hard') {
    baseSets = Math.max(2, baseSets - 1);
    restSeconds += 20;
  }

  return { sets: baseSets, reps, restSeconds };
}

/**
 * Formats muscle keys into human-readable anatomical labels.
 */
export function formatMuscleLabels(primary = [], secondary = []) {
  const primaryLabels = primary.map((m) => MUSCLE_GROUPS[m]?.label || m);
  const secondaryLabels = secondary.map((m) => MUSCLE_GROUPS[m]?.label || m);
  return { primaryLabels, secondaryLabels };
}

/**
 * Hydrates a catalog exercise entry into a scheduled workout exercise object.
 */
export function hydrateExerciseForSchedule(ex, dayIndex, slotIndex, primaryGoal, intensityRating) {
  const prescription = getPrescription(primaryGoal, ex.tier, intensityRating);
  const patternMeta = Object.values(MOVEMENT_PATTERNS).find((p) => p.id === ex.movementPattern);
  const { primaryLabels, secondaryLabels } = formatMuscleLabels(
    ex.primaryMuscles,
    ex.secondaryMuscles
  );

  return {
    id: `ex-${dayIndex}-${slotIndex + 1}-${ex.id}`,
    catalogId: ex.id,
    wgerId: ex.wgerId,
    name: ex.name,
    category: ex.category,
    movementPattern: ex.movementPattern,
    movementPatternLabel: patternMeta?.label || ex.movementPattern,
    tier: ex.tier || 'compound',
    difficulty: ex.difficulty || 'intermediate',
    equipment: ex.equipment || [],
    primaryMuscles: ex.primaryMuscles || [],
    secondaryMuscles: ex.secondaryMuscles || [],
    primaryMuscleLabels: primaryLabels,
    secondaryMuscleLabels: secondaryLabels,
    jointStress: ex.jointStress || [],
    svgType: ex.svgType || 'squat',
    svgAccuracy: ex.svgAccuracy || 'exact',
    svgNote: ex.svgNote || null,
    formCues: ex.formCues || [],
    sets: prescription.sets,
    reps: prescription.reps,
    restSeconds: prescription.restSeconds,
    substitutions: ex.substitutions || ['Dumbbell Alternative', 'Bodyweight Variation'],
  };
}

/**
 * Scores an exercise candidate based on Movement Pattern slot, User Feedback, Focus Areas, and Weekly Variety.
 */
function scoreCandidate(ex, {
  targetPattern,
  slotIndex,
  likedSet,
  focusAreas,
  usedInDaySet,
  usedInWeekCounts,
  preferSimpler,
}) {
  if (usedInDaySet.has(ex.id)) return -9999;

  let score = 0;

  // 1. Movement pattern match
  if (ex.movementPattern === targetPattern) {
    score += 100;
  } else if (
    (targetPattern === 'squat' && ex.movementPattern === 'lunge') ||
    (targetPattern === 'lunge' && ex.movementPattern === 'squat')
  ) {
    score += 45;
  }

  // 2. Tier ordering: early slots in the workout prefer compound lifts; later slots prefer isolation/accessory
  if (slotIndex <= 2 && ex.tier === 'compound') {
    score += 25;
  } else if (slotIndex >= 3 && (ex.tier === 'isolation' || ex.tier === 'accessory')) {
    score += 20;
  }

  // 3. User Feedback Loop: Boost liked exercises
  if (likedSet.has(ex.id) || likedSet.has(ex.name)) {
    score += 45;
  }

  // 4. User Feedback Loop: Complexity preference
  if (preferSimpler && ex.difficulty === 'beginner') {
    score += 20;
  }

  // 5. Focus Areas boost
  if (focusAreas && focusAreas.length > 0) {
    const normalizedFocus = focusAreas.map((f) => f.toLowerCase());
    const catMatch = normalizedFocus.includes((ex.category || '').toLowerCase());
    const muscleMatch = (ex.primaryMuscles || []).some((m) =>
      normalizedFocus.some((f) => f.includes(m) || (MUSCLE_GROUPS[m]?.label || '').toLowerCase().includes(f))
    );
    if (catMatch || muscleMatch) {
      score += 30;
    }
  }

  // 6. Weekly variety penalty: avoid repeating the exact same exercise every day
  const timesUsedThisWeek = usedInWeekCounts.get(ex.id) || 0;
  score -= timesUsedThisWeek * 40;

  return score;
}

/**
 * Finds the best replacement exercise when a user swaps an exercise with a feedback reason.
 */
export function findReplacementExercise({
  currentExercise,
  storeState,
  existingDayCatalogIds = [],
  reason = 'dislike',
}) {
  const userProfile = storeState?.userProfile || {};
  const logistics = storeState?.logistics || {};
  const targeting = storeState?.targeting || {};
  const feedback = storeState?.feedback || {};

  const primaryGoal = userProfile.primaryGoal || 'Hypertrophy / Muscle';
  const location = logistics.location || 'Commercial Gym';
  const exclusionZones = targeting.exclusionZones || [];
  const dislikedIds = [...(feedback.dislikedExerciseIds || []), currentExercise.catalogId];
  const likedSet = new Set(feedback.likedExerciseIds || []);
  const intensityRating = feedback.intensityRating || 'optimal';

  const candidates = filterCandidateExercises({
    location,
    exclusionZones,
    dislikedExerciseIds: dislikedIds,
  });

  const excludedToday = new Set([...existingDayCatalogIds, currentExercise.catalogId]);

  const unusedCandidates = candidates.filter((ex) => !excludedToday.has(ex.id));

  const scored = unusedCandidates
    .map((ex) => {
      let score = 0;

      // Match movement pattern first, then category
      if (ex.movementPattern === currentExercise.movementPattern) {
        score += 100;
      } else if (ex.category === currentExercise.category) {
        score += 65;
      }

      // Match primary muscle
      const sharesPrimaryMuscle = (ex.primaryMuscles || []).some((m) =>
        (currentExercise.primaryMuscles || []).includes(m)
      );
      if (sharesPrimaryMuscle) score += 35;

      // Reason-specific intelligence
      if (reason === 'joint_pain') {
        if (!ex.jointStress || ex.jointStress.length === 0) {
          score += 60;
        } else {
          score -= 40;
        }
      } else if (reason === 'too_hard') {
        if (ex.difficulty === 'beginner') score += 50;
      } else if (reason === 'equipment_busy') {
        const currentEquip = (currentExercise.equipment || [])[0];
        const nextEquip = (ex.equipment || [])[0];
        if (currentEquip && nextEquip && currentEquip !== nextEquip) {
          score += 45;
        }
      }

      if (likedSet.has(ex.id)) score += 35;

      return { ex, score };
    })
    .sort((a, b) => b.score - a.score);

  let chosen = scored[0]?.ex;

  // If no unused candidate found, pick any safe candidate from candidates not identical to current
  if (!chosen) {
    chosen = candidates.find((ex) => ex.id !== currentExercise.catalogId) || candidates[0];
  }

  // If candidates was empty (e.g. all safe exercises in location were disliked),
  // fallback to safe pool ignoring disliked exercises, but strictly obeying exclusionZones!
  if (!chosen) {
    const safePool = filterCandidateExercises({
      location,
      exclusionZones,
      dislikedExerciseIds: [],
    });
    chosen =
      safePool.find((ex) => !excludedToday.has(ex.id)) ||
      safePool.find((ex) => ex.id !== currentExercise.catalogId) ||
      safePool[0] ||
      null;
  }

  // If no safe exercise exists, return null to avoid injecting contraindicated movements
  if (!chosen) {
    return null;
  }

  return hydrateExerciseForSchedule(
    chosen,
    1,
    0,
    primaryGoal,
    intensityRating
  );
}

/**
 * Generates a biomechanically balanced workout plan using the Movement Pattern Taxonomy
 * and User Feedback Loop.
 */
export async function generateWorkout(storeState) {
  const userProfile = storeState?.userProfile || {};
  const logistics = storeState?.logistics || {};
  const targeting = storeState?.targeting || {};
  const feedback = storeState?.feedback || {};

  const primaryGoal = userProfile.primaryGoal || userProfile.goal || 'Hypertrophy / Muscle';
  const cycleLengthWeeks = Number(userProfile.cycleLengthWeeks) || 8;
  const location = logistics.location || 'Commercial Gym';
  const frequencyDays = Math.max(2, Math.min(6, Number(logistics.frequencyDays || logistics.frequency) || 4));
  const durationMinutes = Number(logistics.durationMinutes || logistics.duration) || 60;
  const exclusionZones = Array.isArray(targeting.exclusionZones) ? targeting.exclusionZones : [];
  const focusAreas = Array.isArray(targeting.focusAreas) ? targeting.focusAreas : [];

  const likedSet = new Set(feedback.likedExerciseIds || []);
  const dislikedExerciseIds = feedback.dislikedExerciseIds || [];
  const intensityRating = feedback.intensityRating || 'optimal';
  const preferSimpler = feedback.preferSimplerMovements || false;

  // Brief transition delay for UX polish
  await new Promise((resolve) => setTimeout(resolve, 650));

  const safePool = filterCandidateExercises({
    location,
    exclusionZones,
    dislikedExerciseIds,
  });

  // Determine number of exercises per session based on duration
  const exerciseCountPerDay =
    durationMinutes >= 75 ? 6 : durationMinutes >= 60 ? 5 : durationMinutes >= 45 ? 4 : 3;

  const safetyErrorMessage = `We could not find safe exercises for environment "${location}" that avoid joint stress on: ${exclusionZones.join(', ')}. Please adjust your exclusions or choose another location.`;

  // Explicit safety check: throw if safePool is empty or cannot satisfy minimum exercises (at least 2 per day)
  if (safePool.length === 0 || safePool.length < 2) {
    throw new Error(safetyErrorMessage);
  }

  // If safePool.length is less than exerciseCountPerDay, only use safe exercises available in safePool
  const effectiveExerciseCount = Math.min(exerciseCountPerDay, safePool.length);
  if (effectiveExerciseCount < 2) {
    throw new Error(safetyErrorMessage);
  }

  // Map focus areas to bonus movement pattern if 6 exercises requested
  const focusPatternMap = {
    Chest: 'horizontal_push',
    Back: 'horizontal_pull',
    Shoulders: 'vertical_push',
    Legs: 'squat',
    Glutes: 'hinge',
    Arms: 'elbow_flexion',
    Core: 'core_stability',
  };

  const splitDays = SPLIT_TEMPLATES[frequencyDays] || SPLIT_TEMPLATES[4];
  const usedInWeekCounts = new Map();
  const schedule = [];

  for (let d = 0; d < frequencyDays; d++) {
    const dayIndex = d + 1;
    const template = splitDays[d % splitDays.length];
    const patternsForDay = [...template.patterns];

    // If session is 75m (6 exercises) or user has a focus area, append a targeted pattern
    if (patternsForDay.length < effectiveExerciseCount) {
      const focusArea = focusAreas[d % Math.max(1, focusAreas.length)];
      const bonusPattern = focusPatternMap[focusArea] || 'core_stability';
      patternsForDay.push(bonusPattern);
    }

    const activePatterns = patternsForDay.slice(0, effectiveExerciseCount);
    const usedInDaySet = new Set();
    const dayExercises = [];

    activePatterns.forEach((pattern, slotIdx) => {
      // Pick only from safePool candidates not already in usedInDaySet
      const availableSafe = safePool.filter((candidate) => !usedInDaySet.has(candidate.id));

      const ranked = availableSafe
        .map((candidate) => ({
          candidate,
          score: scoreCandidate(candidate, {
            targetPattern: pattern,
            slotIndex: slotIdx,
            likedSet,
            focusAreas,
            usedInDaySet,
            usedInWeekCounts,
            preferSimpler,
          }),
        }))
        .sort((a, b) => b.score - a.score);

      const selected = ranked[0]?.candidate || availableSafe[0] || null;
      if (selected) {
        usedInDaySet.add(selected.id);
        usedInWeekCounts.set(selected.id, (usedInWeekCounts.get(selected.id) || 0) + 1);
        dayExercises.push(
          hydrateExerciseForSchedule(selected, dayIndex, slotIdx, primaryGoal, intensityRating)
        );
      }
    });

    if (dayExercises.length < 2) {
      throw new Error(safetyErrorMessage);
    }

    schedule.push({
      dayNumber: dayIndex,
      dayLabel: `Day ${dayIndex}: ${template.label}`,
      exercises: dayExercises,
    });
  }

  const workoutPlan = {
    id: `plan_${Date.now()}`,
    programName: `${cycleLengthWeeks}-Week ${primaryGoal} Blueprint`,
    taxonomyVersion: 'wger-v2-biomechanical',
    warmupRoutine: {
      cardioPrimer:
        '5-7 minutes light dynamic cardio (incline treadmill walk, assault bike, or jump rope) to elevate core temperature and synovial joint fluid.',
      dynamicMobility: [
        'World’s Greatest Stretch with thoracic rotations (5 reps/side)',
        'Scapular Band Pull-Aparts & Shoulder Dislocates (15 reps)',
        'Deep Prying Goblet/Bodyweight Squat Hold (30s bottom pause)',
        'Cat-Cow to Contralateral Bird-Dog Reach (8 reps/side)',
      ],
    },
    schedule,
  };

  return workoutPlan;
}

export default generateWorkout;
