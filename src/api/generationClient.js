/**
 * API Integration & Science-Based Biomechanical Rule Engine
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
 * Focus Area anatomical mapping for intelligent split routing and volume prioritization.
 */
export const FOCUS_AREA_METADATA = {
  Chest: {
    compatibleCategories: ['full', 'upper', 'push'],
    patterns: ['horizontal_push'],
    muscles: ['pectorals'],
    preferredSubPattern: 'chest_isolation',
  },
  Back: {
    compatibleCategories: ['full', 'upper', 'pull'],
    patterns: ['vertical_pull', 'horizontal_pull'],
    muscles: ['lats', 'upper_back'],
    preferredSubPattern: 'horizontal_row',
  },
  Shoulders: {
    compatibleCategories: ['full', 'upper', 'push', 'pull'],
    patterns: ['vertical_push', 'horizontal_pull'],
    muscles: ['lateral_deltoid', 'anterior_deltoid', 'posterior_deltoid'],
    preferredSubPattern: 'lateral_raise',
  },
  Arms: {
    compatibleCategories: ['full', 'upper', 'push', 'pull'],
    patterns: ['elbow_flexion', 'elbow_extension'],
    muscles: ['biceps', 'triceps', 'forearms'],
    preferredSubPattern: 'supinated_curl',
  },
  Legs: {
    compatibleCategories: ['full', 'lower'],
    patterns: ['squat', 'hinge', 'lunge'],
    muscles: ['quads', 'hamstrings', 'calves'],
    preferredSubPattern: 'quad_isolation',
  },
  Glutes: {
    compatibleCategories: ['full', 'lower'],
    patterns: ['hinge', 'lunge'],
    muscles: ['glutes'],
    preferredSubPattern: 'glute_thrust',
  },
  Core: {
    compatibleCategories: ['full', 'upper', 'lower', 'push', 'pull'],
    patterns: ['core_stability'],
    muscles: ['abs', 'obliques'],
    preferredSubPattern: 'anti_extension',
  },
};

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
 * Resolves a substitution name or catalog exercise against safe candidates for the user's setup.
 */
export function getSafeSubstitutions(
  exercise,
  {
    location = 'Commercial Gym',
    exclusionZones = [],
    dislikedExerciseIds = [],
    existingDayCatalogIds = [],
  } = {}
) {
  const safePool = filterCandidateExercises({
    location,
    exclusionZones,
    dislikedExerciseIds,
  });

  if (safePool.length === 0) return [];

  const currentId = exercise?.catalogId || exercise?.id;
  const currentName = (exercise?.name || '').toLowerCase();
  const excludedSet = new Set([...(existingDayCatalogIds || []), currentId]);

  const rawSubs = Array.isArray(exercise?.substitutions) ? exercise.substitutions : [];
  const validSubNames = [];
  const seenNames = new Set([currentName]);

  // 1. Keep any declared substitutions that exist in safePool (or match safely)
  rawSubs.forEach((subName) => {
    if (!subName) return;
    const normalizedSub = subName.toLowerCase().trim();
    if (seenNames.has(normalizedSub)) return;

    const matchedSafe = safePool.find(
      (item) =>
        item.name.toLowerCase() === normalizedSub ||
        item.name.toLowerCase().includes(normalizedSub) ||
        normalizedSub.includes(item.name.toLowerCase())
    );

    if (matchedSafe && !seenNames.has(matchedSafe.name.toLowerCase())) {
      validSubNames.push(matchedSafe.name);
      seenNames.add(matchedSafe.name.toLowerCase());
    }
  });

  // 2. Top up with biomechanically matched safe exercises from the same movement pattern / category
  if (validSubNames.length < 2) {
    const patternMatches = safePool
      .filter(
        (item) =>
          item.id !== currentId &&
          !seenNames.has(item.name.toLowerCase()) &&
          (item.movementPattern === exercise?.movementPattern ||
            item.category === exercise?.category)
      )
      .sort((a, b) => {
        const aSamePattern = a.movementPattern === exercise?.movementPattern ? 1 : 0;
        const bSamePattern = b.movementPattern === exercise?.movementPattern ? 1 : 0;
        if (bSamePattern !== aSamePattern) return bSamePattern - aSamePattern;
        const aUnused = !excludedSet.has(a.id) ? 1 : 0;
        const bUnused = !excludedSet.has(b.id) ? 1 : 0;
        return bUnused - aUnused;
      });

    for (const candidate of patternMatches) {
      if (validSubNames.length >= 3) break;
      validSubNames.push(candidate.name);
      seenNames.add(candidate.name.toLowerCase());
    }
  }

  return validSubNames.slice(0, 3);
}

/**
 * Calculates science-based sets, reps/hold time, rest intervals, and target RIR
 * based on goal, exercise tier, user intensity feedback, and isometric vs dynamic mechanics.
 */
export function getPrescription(
  primaryGoal,
  tier = 'compound',
  intensityRating = 'optimal',
  options = {}
) {
  const normalized = (primaryGoal || '').toLowerCase();
  const exercise = options?.exercise || null;
  const isTimeBased =
    options?.prescriptionType === 'time' || exercise?.prescriptionType === 'time';
  const timeMap = exercise?.timePrescription || null;

  let baseSets = 3;
  let reps = '8-12';
  let restSeconds = 90;
  let targetRir = '1-2 RIR';

  if (normalized.includes('strength') || normalized.includes('power')) {
    baseSets = tier === 'compound' ? 4 : 3;
    reps = isTimeBased
      ? timeMap?.strength || '30-45s'
      : tier === 'compound'
      ? '4-6'
      : '8-10';
    // Evidence-based ATP-PCr & neural recovery (2.5-3 min for heavy compounds)
    restSeconds = tier === 'compound' ? 165 : 90;
    targetRir = tier === 'compound' ? '1-2 RIR (RPE 8.5)' : '2 RIR (RPE 8)';
  } else if (
    normalized.includes('fat') ||
    normalized.includes('tone') ||
    normalized.includes('weight')
  ) {
    baseSets = 3;
    reps = isTimeBased ? timeMap?.hypertrophy || '45-60s' : tier === 'compound' ? '8-12' : '12-15';
    restSeconds = tier === 'compound' ? 90 : 60;
    targetRir = '1-2 RIR (RPE 8.5)';
  } else if (normalized.includes('endurance') || normalized.includes('stamina')) {
    baseSets = 3;
    reps = isTimeBased ? timeMap?.endurance || '60-75s' : '15-20';
    restSeconds = tier === 'compound' ? 60 : 45;
    targetRir = '2-3 RIR (RPE 7.5)';
  } else if (normalized.includes('longevity') || normalized.includes('mobility')) {
    baseSets = 3;
    reps = isTimeBased ? timeMap?.default || '45s' : '10-12';
    restSeconds = 75;
    targetRir = '2-3 RIR (RPE 7.5)';
  } else {
    // Hypertrophy / Muscle Default (Schoenfeld / Helms mechanical tension parameters)
    baseSets = tier === 'compound' ? 4 : 3;
    reps = isTimeBased
      ? timeMap?.hypertrophy || '45-60s'
      : tier === 'compound'
      ? '6-10'
      : '10-15';
    // 2+ minutes rest on multi-joint compounds preserves volume load & myofibrillar recruitment
    restSeconds = tier === 'compound' ? 120 : 75;
    targetRir = tier === 'compound' ? '1-2 RIR (RPE 8.5)' : '0-1 RIR (RPE 9.5)';
  }

  // Apply Feedback Loop Intensity Calibration without undermining compound recovery
  if (intensityRating === 'too_easy') {
    baseSets += 1;
    // Keep compound rest >= 105s for Strength/Hypertrophy so added set maintains mechanical tension
    const minRestFloor =
      tier === 'compound' &&
      (normalized.includes('strength') ||
        normalized.includes('power') ||
        normalized.includes('hypertrophy') ||
        normalized.includes('muscle') ||
        !normalized)
        ? 105
        : 45;
    restSeconds = Math.max(minRestFloor, restSeconds - 15);
    targetRir = '0-1 RIR (RPE 9.5)';
  } else if (intensityRating === 'too_hard') {
    baseSets = Math.max(2, baseSets - 1);
    restSeconds += 20;
    targetRir = '2-3 RIR (RPE 7.5)';
  }

  // Apply Focus Muscle Priority +1 set boost when flagged
  if (options?.isFocusBoosted) {
    baseSets = Math.min(6, baseSets + 1);
  }

  return {
    sets: baseSets,
    reps,
    restSeconds,
    targetRir,
    prescriptionType: isTimeBased ? 'time' : 'reps',
  };
}

/**
 * Deterministically estimates weekly working sets and per-session sets for the IntakeScreen
 * so the live architecture preview matches the generated routine.
 */
export function estimateWeeklyVolume({
  primaryGoal = 'Hypertrophy / Muscle',
  frequencyDays = 4,
  durationMinutes = 60,
  intensityRating = 'optimal',
  focusAreas = [],
} = {}) {
  const days = Math.max(2, Math.min(6, Number(frequencyDays) || 4));
  const mins = Number(durationMinutes) || 60;
  const exerciseCountPerDay = mins >= 75 ? 6 : mins >= 60 ? 5 : mins >= 45 ? 4 : 3;

  const splitDays = SPLIT_TEMPLATES[days] || SPLIT_TEMPLATES[4];
  const compPresc = getPrescription(primaryGoal, 'compound', intensityRating);
  const isoPresc = getPrescription(primaryGoal, 'isolation', intensityRating);

  let totalWeeklySets = 0;
  for (let d = 0; d < days; d++) {
    const template = splitDays[d % splitDays.length];
    // Typically first 2-3 movements are compounds and remaining are accessories/isolations
    const compoundCount = Math.min(exerciseCountPerDay, exerciseCountPerDay <= 3 ? 2 : 3);
    const isolationCount = Math.max(0, exerciseCountPerDay - compoundCount);

    let daySets = compoundCount * compPresc.sets + isolationCount * isoPresc.sets;

    // Account for +1 priority set when user has selected a compatible Focus Muscle
    if (Array.isArray(focusAreas) && focusAreas.length > 0) {
      const hasCompatibleFocus = focusAreas.some((area) => {
        const meta = FOCUS_AREA_METADATA[area];
        return meta && meta.compatibleCategories.includes(template.dayCategory || 'full');
      });
      if (hasCompatibleFocus) {
        daySets += 1;
      }
    }

    totalWeeklySets += daySets;
  }

  return {
    weeklySets: totalWeeklySets,
    avgSetsPerSession: Math.round(totalWeeklySets / days),
    exerciseCountPerDay,
  };
}

/**
 * Generates a goal-specific 4-phase Periodization Blueprint for both UI and PDF export.
 */
export function buildPeriodizationPlan(primaryGoal = 'Hypertrophy / Muscle', cycleLengthWeeks = 8) {
  const normalized = (primaryGoal || '').toLowerCase();
  const totalWeeks = Math.max(4, Number(cycleLengthWeeks) || 8);

  if (normalized.includes('strength') || normalized.includes('power')) {
    return {
      title: `${totalWeeks}-Week Strength & Neural Periodization`,
      subtitle:
        'Linear intensity progression: prioritize bar speed, 2.5–3 min compound recovery, and progressive load increments while keeping 1–2 reps in reserve.',
      phases: [
        {
          badge: 'Phase 1 • Weeks 1–3',
          title: 'Neural Groove & Force Base',
          metrics: '4 Sets • 2 RIR (RPE 8)',
          desc: 'Master bracing and crisp concentric bar speed on primary compound lifts.',
          isDeload: false,
        },
        {
          badge: 'Phase 2 • Weeks 4–6',
          title: 'Progressive Load Accumulation',
          metrics: '4 Sets • 1–2 RIR (RPE 8.5)',
          desc: 'Add +2.5kg/+5lbs to main lifts each week once top of the 4–6 rep range is hit.',
          isDeload: false,
        },
        {
          badge: 'Phase 3 • Week 7',
          title: 'Peak Strength Realization',
          metrics: '4–5 Sets • 1 RIR (RPE 9)',
          desc: 'Heavy top working sets with full 3-minute ATP-PCr recovery intervals.',
          isDeload: false,
        },
        {
          badge: `Phase 4 • Week ${totalWeeks}`,
          title: 'CNS & Joint Deload',
          metrics: '2 Sets • 60% Load (RPE 6)',
          desc: 'Halve set volume and reduce axial spinal/joint loading to supercompensate.',
          isDeload: true,
        },
      ],
    };
  }

  if (normalized.includes('endurance') || normalized.includes('stamina')) {
    return {
      title: `${totalWeeks}-Week Muscular Endurance & Work Capacity`,
      subtitle:
        'Metabolic density progression: systematically expand lactate buffering, local capillary density, and recovery efficiency between bouts.',
      phases: [
        {
          badge: 'Phase 1 • Weeks 1–3',
          title: 'Aerobic & Structural Base',
          metrics: '3 Sets • 15–20 Reps • 60s Rest',
          desc: 'Establish smooth breathing cadence and full range-of-motion stamina.',
          isDeload: false,
        },
        {
          badge: 'Phase 2 • Weeks 4–6',
          title: 'Work Density & Threshold',
          metrics: '3–4 Sets • 45s Rest Intervals',
          desc: 'Compress rest intervals and push toward the top of the 15–20 rep window.',
          isDeload: false,
        },
        {
          badge: 'Phase 3 • Week 7',
          title: 'Peak Stamina Output',
          metrics: '4 Sets • 1–2 RIR • Max Density',
          desc: 'Sustained high-output sets with strict posture under metabolic fatigue.',
          isDeload: false,
        },
        {
          badge: `Phase 4 • Week ${totalWeeks}`,
          title: 'Active Recovery & Mobility',
          metrics: '2 Sets • Easy Tempo (RPE 6)',
          desc: 'Restore glycogen stores, connective tissue hydration, and joint mobility.',
          isDeload: true,
        },
      ],
    };
  }

  if (normalized.includes('longevity') || normalized.includes('mobility')) {
    return {
      title: `${totalWeeks}-Week Joint Resilience & Longevity Blueprint`,
      subtitle:
        'Controlled eccentric and end-range progression: build tendon stiffness, scapular/hip stability, and pain-free strength through full ROM.',
      phases: [
        {
          badge: 'Phase 1 • Weeks 1–3',
          title: 'End-Range Control & Alignment',
          metrics: '3 Sets • 3s Eccentric • 2–3 RIR',
          desc: 'Focus on 1-second isometric pauses in the stretched position of each lift.',
          isDeload: false,
        },
        {
          badge: 'Phase 2 • Weeks 4–6',
          title: 'Tendon & Postural Strengthening',
          metrics: '3–4 Sets • 2 RIR (RPE 8)',
          desc: 'Gradually increase resistance only when full range of motion is effortless.',
          isDeload: false,
        },
        {
          badge: 'Phase 3 • Week 7',
          title: 'Resilient Capacity Peak',
          metrics: '3–4 Sets • 1–2 RIR (RPE 8.5)',
          desc: 'Consolidate unilateral balance, anti-rotation core stability, and joint control.',
          isDeload: false,
        },
        {
          badge: `Phase 4 • Week ${totalWeeks}`,
          title: 'Tissue Unloading & Flow',
          metrics: '2 Sets • Light Load (RPE 6)',
          desc: 'Prioritize synovial joint nourishment, decompression, and tissue recovery.',
          isDeload: true,
        },
      ],
    };
  }

  if (normalized.includes('fat') || normalized.includes('tone') || normalized.includes('weight')) {
    return {
      title: `${totalWeeks}-Week Metabolic Conditioning & Lean Mass Retention`,
      subtitle:
        'High-density resistance progression: preserve and sculpt lean muscle tissue while maximizing caloric expenditure and EPOC.',
      phases: [
        {
          badge: 'Phase 1 • Weeks 1–3',
          title: 'Metabolic Base & Technique',
          metrics: '3 Sets • 10–15 Reps • 2 RIR',
          desc: 'Keep rest intervals crisp (60–75s) while maintaining strict mechanical tension.',
          isDeload: false,
        },
        {
          badge: 'Phase 2 • Weeks 4–6',
          title: 'Density & Progressive Overload',
          metrics: '3–4 Sets • 1–2 RIR (RPE 8.5)',
          desc: 'Add 1–2 reps per set or +2.5kg/+5lbs to preserve muscle in a caloric deficit.',
          isDeload: false,
        },
        {
          badge: 'Phase 3 • Week 7',
          title: 'Peak Metabolic Output',
          metrics: '4 Sets • 1 RIR (RPE 9)',
          desc: 'High-effort working sets with minimal wasted transition time between movements.',
          isDeload: false,
        },
        {
          badge: `Phase 4 • Week ${totalWeeks}`,
          title: 'Systemic Deload & Reset',
          metrics: '2 Sets • 60% Load (RPE 6)',
          desc: 'Lower cortisol and systemic fatigue while maintaining movement habits.',
          isDeload: true,
        },
      ],
    };
  }

  // Default: Hypertrophy / Muscle
  return {
    title: `${totalWeeks}-Week Science-Based Hypertrophy Blueprint`,
    subtitle:
      'Double-progression overload: build reps to the top of the target range at 1–2 RIR before adding weight. Prioritize controlled 2–3s eccentrics and full muscle stretch.',
    phases: [
      {
        badge: 'Phase 1 • Weeks 1–3',
        title: 'MEV & Lengthened Hypertrophy',
        metrics: '3–4 Sets • 2 RIR (RPE 8)',
        desc: 'Control 2–3s eccentrics and pause briefly in the lengthened stretch position.',
        isDeload: false,
      },
      {
        badge: 'Phase 2 • Weeks 4–6',
        title: 'Double-Progression Overload',
        metrics: '4 Sets • 1–2 RIR (RPE 8.5)',
        desc: 'Add +1–2 reps per set weekly; increase load by +2.5kg/+5lbs once top rep is hit.',
        isDeload: false,
      },
      {
        badge: 'Phase 3 • Week 7',
        title: 'Peak MRV Overreaching',
        metrics: '4–5 Sets • 0–1 RIR (RPE 9–9.5)',
        desc: 'Push isolation movements to 0–1 RIR and compounds to 1 RIR for peak stimulus.',
        isDeload: false,
      },
      {
        badge: `Phase 4 • Week ${totalWeeks}`,
        title: 'Active Deload & Resensitization',
        metrics: '2 Sets • 50–60% Load (RPE 6)',
        desc: 'Dissipate cumulative fatigue, restore joint health, and resensitize mTOR signaling.',
        isDeload: true,
      },
    ],
  };
}

/**
 * Generates an environment- and joint-safe Warmup Routine.
 */
export function buildWarmupRoutine({ location = 'Commercial Gym', exclusionZones = [] } = {}) {
  const normalizedExclusions = (exclusionZones || []).map((z) => z.toLowerCase());
  const isBodyweight = location === 'Bodyweight Only';
  const isHome = location === 'Home Gym';

  const cardioPrimer = isBodyweight
    ? '5 minutes brisk dynamic calisthenics (marching high knees, step jacks, and arm swings) to raise core temperature and synovial joint lubrication.'
    : isHome
    ? '5–7 minutes brisk jump rope, shadowboxing, or dynamic marching to elevate heart rate and core muscle temperature before loading.'
    : '5–7 minutes light incline treadmill walk, stationary bike, or rower to elevate core temperature and synovial joint fluid.';

  const mobility = [
    'Thoracic Open-Book Rotations & Cat-Cow Spinal Segmentation (6 reps/side)',
    normalizedExclusions.includes('shoulders')
      ? 'Pain-Free Scapular Wall Slides & Pendulum Arm Circles (12 controlled reps)'
      : isBodyweight
      ? 'Prone Y-T-W Scapular Activations & Arm Circles (12 reps)'
      : 'Scapular Band/Cable Pull-Aparts & Shoulder Dislocates (15 reps)',
    normalizedExclusions.includes('knees')
      ? 'Supine Glute Bridge Iso-Holds & Hip Airplane Hinges (8 reps/side)'
      : 'Deep Prying Goblet/Bodyweight Squat Hold with Ankle Rocks (30s pause)',
    'Contralateral Dead-Bug / Bird-Dog Core Bracing (6 reps/side + 2 ramp-up warmup sets on first lift)',
  ];

  return {
    cardioPrimer,
    dynamicMobility: mobility,
  };
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
export function hydrateExerciseForSchedule(
  ex,
  dayIndex,
  slotIndex,
  primaryGoal,
  intensityRating,
  options = {}
) {
  const prescription = getPrescription(primaryGoal, ex.tier, intensityRating, {
    exercise: ex,
    isFocusBoosted: options?.isFocusBoosted,
  });
  const patternMeta = Object.values(MOVEMENT_PATTERNS).find((p) => p.id === ex.movementPattern);
  const { primaryLabels, secondaryLabels } = formatMuscleLabels(
    ex.primaryMuscles,
    ex.secondaryMuscles
  );

  const safeSubstitutions = getSafeSubstitutions(ex, {
    location: options?.location || 'Commercial Gym',
    exclusionZones: options?.exclusionZones || [],
    dislikedExerciseIds: options?.dislikedExerciseIds || [],
    existingDayCatalogIds: options?.existingDayCatalogIds || [],
  });

  return {
    id: `ex-${dayIndex}-${slotIndex + 1}-${ex.id}`,
    catalogId: ex.id,
    wgerId: ex.wgerId,
    name: ex.name,
    category: ex.category,
    movementPattern: ex.movementPattern,
    movementPatternLabel: patternMeta?.label || ex.movementPattern,
    subPattern: ex.subPattern || null,
    tier: ex.tier || 'compound',
    difficulty: ex.difficulty || 'intermediate',
    stretchBiased: Boolean(ex.stretchBiased),
    prescriptionType: prescription.prescriptionType,
    timePrescription: ex.timePrescription || null,
    targetRir: prescription.targetRir,
    isFocusBoosted: Boolean(options?.isFocusBoosted),
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
    substitutions:
      safeSubstitutions.length > 0
        ? safeSubstitutions
        : (ex.substitutions || []).slice(0, 3),
  };
}

/**
 * Checks whether an exercise directly trains any of the user's selected focusAreas.
 */
export function exerciseMatchesFocusArea(ex, focusAreas = []) {
  if (!focusAreas || focusAreas.length === 0) return false;
  return focusAreas.some((area) => {
    const meta = FOCUS_AREA_METADATA[area];
    if (meta) {
      if ((ex.primaryMuscles || []).some((m) => meta.muscles.includes(m))) {
        return true;
      }
      if ((ex.category || '').toLowerCase() === area.toLowerCase()) {
        return true;
      }
    }
    const norm = area.toLowerCase();
    return (
      (ex.category || '').toLowerCase() === norm ||
      (ex.primaryMuscles || []).some(
        (m) => m.includes(norm) || (MUSCLE_GROUPS[m]?.label || '').toLowerCase().includes(norm)
      )
    );
  });
}

/**
 * Scores an exercise candidate based on Movement Pattern slot, Sub-Pattern diversity,
 * Compound-to-Isolation progression, Stretch-Mediated Hypertrophy, User Feedback,
 * Focus Areas, and Weekly Variety.
 */
function scoreCandidate(
  ex,
  {
    targetPattern,
    slotIndex,
    patternOccurrenceToday = 0,
    usedSubPatternsToday = new Set(),
    preferredSubPattern = null,
    primaryGoal = 'Hypertrophy / Muscle',
    likedSet,
    focusAreas,
    usedInDaySet,
    usedInWeekCounts,
    preferSimpler,
  }
) {
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

  // 2. Science-based Tier & Sub-Pattern progression within the session:
  // First time a movement pattern appears today -> prefer multi-joint compound primary lifts.
  // Second time the same movement pattern appears today -> prefer isolation/accessory & distinct sub-pattern
  // (e.g., Overhead Press -> Lateral Raise; RDL -> Leg Curl; Squat -> Leg Extension; Split Squat -> Calf Raise).
  if (patternOccurrenceToday === 0) {
    if (
      targetPattern === 'elbow_flexion' ||
      targetPattern === 'elbow_extension' ||
      targetPattern === 'core_stability'
    ) {
      if (ex.tier === 'isolation' || ex.tier === 'accessory') score += 20;
    } else {
      if (ex.tier === 'compound') score += 32;
      // Prevent Calf Raises or Wall Sits from taking the primary slot 1 Squat/Lunge compound spot
      if (ex.subPattern === 'calves' || ex.subPattern === 'quad_isolation') {
        score -= 35;
      }
      if (targetPattern === 'vertical_push' && ex.subPattern === 'overhead_press') {
        score += 18;
      }
      if (targetPattern === 'horizontal_pull' && ex.subPattern === 'horizontal_row') {
        score += 18;
      }
      if (targetPattern === 'hinge' && ex.subPattern === 'hip_hinge') {
        score += 15;
      }
    }
  } else {
    // 2nd+ occurrence of this movement pattern in the same workout:
    if (ex.tier === 'isolation' || ex.tier === 'accessory') {
      score += 36;
    }
    if (ex.subPattern && !usedSubPatternsToday.has(ex.subPattern)) {
      score += 35;
    } else if (ex.subPattern && usedSubPatternsToday.has(ex.subPattern)) {
      score -= 25;
    }
  }

  // Explicit preferredSubPattern bonus (e.g. when routing a Focus Area like Glutes -> glute_thrust or Shoulders -> lateral_raise)
  if (preferredSubPattern && ex.subPattern === preferredSubPattern) {
    score += 28;
  }

  // 3. Stretch-Mediated Hypertrophy bonus for Hypertrophy / Muscle goal
  const goalNorm = (primaryGoal || '').toLowerCase();
  if (
    (goalNorm.includes('hypertrophy') || goalNorm.includes('muscle')) &&
    ex.stretchBiased
  ) {
    score += 12;
  }

  // 4. User Feedback Loop: Boost liked exercises
  if (likedSet.has(ex.id) || likedSet.has(ex.name)) {
    score += 45;
  }

  // 5. User Feedback Loop: Complexity preference
  if (preferSimpler && ex.difficulty === 'beginner') {
    score += 22;
  }

  // 6. Focus Areas boost
  if (exerciseMatchesFocusArea(ex, focusAreas)) {
    score += 32;
  }

  // 7. Weekly variety penalty: avoid repeating the exact same exercise every day
  const timesUsedThisWeek = usedInWeekCounts.get(ex.id) || 0;
  score -= timesUsedThisWeek * 42;

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

      // Match movement pattern & sub-pattern first, then category
      if (ex.movementPattern === currentExercise.movementPattern) {
        score += 100;
        if (currentExercise.subPattern && ex.subPattern === currentExercise.subPattern) {
          score += 25;
        }
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

  return hydrateExerciseForSchedule(chosen, 1, 0, primaryGoal, intensityRating, {
    location,
    exclusionZones,
    dislikedExerciseIds: dislikedIds,
    existingDayCatalogIds,
  });
}

/**
 * Generates a biomechanically balanced, science-based workout plan using the
 * Movement Pattern Taxonomy, Duration-Aware Templates, Focus Muscle Routing, and User Feedback Loop.
 */
export async function generateWorkout(storeState, options = {}) {
  const userProfile = storeState?.userProfile || storeState?.biometrics || {};
  const logistics = storeState?.logistics || {};
  const targeting = storeState?.targeting || {};
  const feedback = storeState?.feedback || storeState?.feedbackProfile || {};

  const primaryGoal = userProfile.primaryGoal || userProfile.goal || 'Hypertrophy / Muscle';
  const cycleLengthWeeks = Number(userProfile.cycleLengthWeeks || logistics.cycleWeeks) || 8;
  const location = logistics.location || 'Commercial Gym';
  const frequencyDays = Math.max(
    2,
    Math.min(6, Number(logistics.frequencyDays || logistics.frequency || logistics.daysPerWeek) || 4)
  );
  const durationMinutes = Number(logistics.durationMinutes || logistics.duration) || 60;
  const exclusionZones = Array.isArray(targeting.exclusionZones) ? targeting.exclusionZones : [];
  const focusAreas = Array.isArray(targeting.focusAreas) ? targeting.focusAreas : [];

  const likedSet = new Set(feedback.likedExerciseIds || []);
  const dislikedExerciseIds = feedback.dislikedExerciseIds || [];
  const intensityRating = feedback.intensityRating || 'optimal';
  const preferSimpler = feedback.preferSimplerMovements || false;

  // Brief transition delay for UX polish unless instant option is requested
  if (!options?.instant) {
    await new Promise((resolve) => setTimeout(resolve, 650));
  }

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

  const effectiveExerciseCount = Math.min(exerciseCountPerDay, safePool.length);
  if (effectiveExerciseCount < 2) {
    throw new Error(safetyErrorMessage);
  }

  const splitDays = SPLIT_TEMPLATES[frequencyDays] || SPLIT_TEMPLATES[4];
  const usedInWeekCounts = new Map();
  const schedule = [];

  for (let d = 0; d < frequencyDays; d++) {
    const dayIndex = d + 1;
    const template = splitDays[d % splitDays.length];
    const dayCategory = template.dayCategory || 'full';

    // 1. Use duration-specific balanced pattern array so 30m/45m sessions never cut out antagonist planes
    const basePatterns =
      template.patternsByCount?.[effectiveExerciseCount] ||
      template.patterns.slice(0, effectiveExerciseCount);
    const activePatterns = [...basePatterns];

    // 2. Find focus areas that are anatomically compatible with today's split category (Upper vs Lower vs Full)
    const compatibleFocusAreas = focusAreas.filter((area) => {
      const meta = FOCUS_AREA_METADATA[area];
      return meta && meta.compatibleCategories.includes(dayCategory);
    });

    const activeFocusArea =
      compatibleFocusAreas.length > 0
        ? compatibleFocusAreas[d % compatibleFocusAreas.length]
        : null;
    const activeFocusMeta = activeFocusArea ? FOCUS_AREA_METADATA[activeFocusArea] : null;

    // If user selected a compatible Focus Muscle and none of its patterns are on today's card (or 75m slot),
    // route the final accessory slot to directly hit that Focus Muscle!
    if (activeFocusMeta) {
      const focusPattern = activeFocusMeta.patterns[0];
      const alreadyHasFocusPattern = activePatterns.some((p) =>
        activeFocusMeta.patterns.includes(p)
      );

      if (activePatterns.length < effectiveExerciseCount) {
        activePatterns.push(focusPattern);
      } else if (!alreadyHasFocusPattern && activePatterns.length >= 3) {
        // Replace final accessory slot with focus pattern while preserving primary compounds in slots 0..1
        activePatterns[activePatterns.length - 1] = focusPattern;
      }
    }

    const finalPatterns = activePatterns.slice(0, effectiveExerciseCount);
    const usedInDaySet = new Set();
    const usedSubPatternsToday = new Set();
    const patternCountsToday = new Map();
    const selectedRawEntries = [];

    finalPatterns.forEach((pattern, slotIdx) => {
      const availableSafe = safePool.filter((candidate) => !usedInDaySet.has(candidate.id));
      const occurrence = patternCountsToday.get(pattern) || 0;

      // Check if this slot can satisfy the active focus area's preferred sub-pattern
      const preferredSubPattern =
        activeFocusMeta &&
        activeFocusMeta.patterns.includes(pattern) &&
        occurrence >= 1
          ? activeFocusMeta.preferredSubPattern
          : null;

      const ranked = availableSafe
        .map((candidate) => ({
          candidate,
          score: scoreCandidate(candidate, {
            targetPattern: pattern,
            slotIndex: slotIdx,
            patternOccurrenceToday: occurrence,
            usedSubPatternsToday,
            preferredSubPattern,
            primaryGoal,
            likedSet,
            focusAreas: compatibleFocusAreas,
            usedInDaySet,
            usedInWeekCounts,
            preferSimpler,
          }),
        }))
        .sort((a, b) => b.score - a.score);

      const selected = ranked[0]?.candidate || availableSafe[0] || null;
      if (selected) {
        usedInDaySet.add(selected.id);
        if (selected.subPattern) {
          usedSubPatternsToday.add(selected.subPattern);
        }
        patternCountsToday.set(pattern, occurrence + 1);
        usedInWeekCounts.set(selected.id, (usedInWeekCounts.get(selected.id) || 0) + 1);
        selectedRawEntries.push({ selected, slotIdx });
      }
    });

    if (selectedRawEntries.length < 2) {
      throw new Error(safetyErrorMessage);
    }

    // 3. Identify the top exercise matching the user's Focus Area today to receive a +1 priority set boost
    let focusBoostedCatalogId = null;
    if (compatibleFocusAreas.length > 0) {
      const matchingEntry = selectedRawEntries.find(({ selected }) =>
        exerciseMatchesFocusArea(selected, compatibleFocusAreas)
      );
      if (matchingEntry) {
        focusBoostedCatalogId = matchingEntry.selected.id;
      }
    }

    const existingDayCatalogIds = selectedRawEntries.map((e) => e.selected.id);
    const dayExercises = selectedRawEntries.map(({ selected, slotIdx }) =>
      hydrateExerciseForSchedule(selected, dayIndex, slotIdx, primaryGoal, intensityRating, {
        isFocusBoosted: selected.id === focusBoostedCatalogId,
        location,
        exclusionZones,
        dislikedExerciseIds,
        existingDayCatalogIds,
      })
    );

    // Ensure Compound lifts are sequenced before Isolation/Core accessories within the session
    const tierOrderWeight = (ex) => {
      if (ex.movementPattern === 'core_stability') return 3;
      if (ex.tier === 'compound') return 1;
      return 2;
    };
    dayExercises.sort((a, b) => tierOrderWeight(a) - tierOrderWeight(b));
    // Re-index IDs cleanly after sorting
    dayExercises.forEach((ex, idx) => {
      ex.id = `ex-${dayIndex}-${idx + 1}-${ex.catalogId}`;
    });

    schedule.push({
      dayNumber: dayIndex,
      dayLabel: `Day ${dayIndex}: ${template.label}`,
      dayCategory,
      exercises: dayExercises,
    });
  }

  const workoutPlan = {
    id: `plan_${Date.now()}`,
    programName: `${cycleLengthWeeks}-Week ${primaryGoal} Blueprint`,
    taxonomyVersion: 'wger-v3-science-biomechanical',
    periodizationPlan: buildPeriodizationPlan(primaryGoal, cycleLengthWeeks),
    warmupRoutine: buildWarmupRoutine({ location, exclusionZones }),
    schedule,
  };

  return workoutPlan;
}

export default generateWorkout;
