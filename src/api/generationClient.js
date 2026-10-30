/**
 * API Integration Layer: Antigravity LLM Output Generator
 * Fulfills the WorkoutPlan API Response Schema.
 */

/**
 * Exercise database with equipment locations, target muscles, and fallback substitutions.
 */
const EXERCISE_CATALOG = {
  'Commercial Gym': [
    {
      name: 'Barbell Bench Press',
      category: 'Chest',
      substitutions: ['Dumbbell Flat Bench Press', 'Machine Chest Press', 'Weighted Dips'],
      jointStress: ['Shoulders', 'Wrists'],
    },
    {
      name: 'Incline Dumbbell Press',
      category: 'Chest',
      substitutions: ['Incline Barbell Bench Press', 'Low-to-High Cable Flyes', 'Smith Machine Incline Press'],
      jointStress: ['Shoulders'],
    },
    {
      name: 'Cable Chest Flyes',
      category: 'Chest',
      substitutions: ['Pec Deck Machine', 'Dumbbell Flyes', 'Banded Push-Ups'],
      jointStress: [],
    },
    {
      name: 'Wide-Grip Lat Pulldown',
      category: 'Back',
      substitutions: ['Pull-Ups', 'Assisted Chin-Up Machine', 'Single-Arm Neutral Cable Pulldown'],
      jointStress: ['Shoulders'],
    },
    {
      name: 'Barbell Bent-Over Row',
      category: 'Back',
      substitutions: ['Chest-Supported T-Bar Row', 'Seated Cable Row', 'One-Arm Dumbbell Row'],
      jointStress: ['Lower Back'],
    },
    {
      name: 'Seated Cable Row',
      category: 'Back',
      substitutions: ['Machine Row', 'Meadows Row', 'Incline Dumbbell Row'],
      jointStress: ['Lower Back'],
    },
    {
      name: 'Barbell Back Squat',
      category: 'Legs',
      substitutions: ['Leg Press', 'Hack Squat', 'Goblet Squat'],
      jointStress: ['Knees', 'Lower Back'],
    },
    {
      name: 'Romanian Deadlift',
      category: 'Legs',
      substitutions: ['Dumbbell Romanian Deadlift', 'Seated Leg Curl', 'Barbell Good Mornings'],
      jointStress: ['Lower Back'],
    },
    {
      name: 'Leg Press',
      category: 'Legs',
      substitutions: ['Bulgarian Split Squat', 'Smith Machine Squat', 'Walking Dumbbell Lunges'],
      jointStress: ['Knees'],
    },
    {
      name: 'Standing Overhead Barbell Press',
      category: 'Shoulders',
      substitutions: ['Seated Dumbbell Shoulder Press', 'Machine Overhead Press', 'Landmine Press'],
      jointStress: ['Shoulders', 'Lower Back'],
    },
    {
      name: 'Dumbbell Lateral Raise',
      category: 'Shoulders',
      substitutions: ['Cable Lateral Raise', 'Machine Lateral Raise', 'Resistance Band Lateral Raise'],
      jointStress: [],
    },
    {
      name: 'Face Pulls',
      category: 'Shoulders',
      substitutions: ['Rear Delt Fly Machine', 'Prone Incline Dumbbell Rear Fly', 'Band Pull-Aparts'],
      jointStress: [],
    },
    {
      name: 'Cable Triceps Rope Pushdown',
      category: 'Arms',
      substitutions: ['Straight Bar Tricep Pushdown', 'Overhead Cable Triceps Extension', 'Skull Crushers'],
      jointStress: ['Elbows'],
    },
    {
      name: 'Incline Dumbbell Bicep Curl',
      category: 'Arms',
      substitutions: ['Barbell EZ-Curl', 'Standing Cable Curl', 'Hammer Curls'],
      jointStress: ['Elbows'],
    },
    {
      name: 'Hanging Leg Raise',
      category: 'Core',
      substitutions: ['Captain’s Chair Knee Raise', 'Cable Woodchopper', 'Ab Wheel Rollout'],
      jointStress: ['Lower Back'],
    },
  ],
  'Home Gym': [
    {
      name: 'Dumbbell Floor Press',
      category: 'Chest',
      substitutions: ['Push-Ups with Elevators', 'Dumbbell Deficit Push-Up', 'Band-Resisted Push-Ups'],
      jointStress: ['Shoulders'],
    },
    {
      name: 'One-Arm Dumbbell Row',
      category: 'Back',
      substitutions: ['Two-Arm Dumbbell Bent-Over Row', 'Inverted Towel Door Rows', 'Resistance Band Rows'],
      jointStress: ['Lower Back'],
    },
    {
      name: 'Goblet Squat',
      category: 'Legs',
      substitutions: ['Dumbbell Front Squat', 'Bulgarian Split Squat', 'Tempo Air Squats'],
      jointStress: ['Knees'],
    },
    {
      name: 'Dumbbell Romanian Deadlift',
      category: 'Legs',
      substitutions: ['Single-Leg Dumbbell Deadlift', 'Glute Bridge with Dumbbell', 'Slider Hamstring Curls'],
      jointStress: ['Lower Back'],
    },
    {
      name: 'Standing Dumbbell Overhead Press',
      category: 'Shoulders',
      substitutions: ['Half-Kneeling Single-Arm Press', 'Pike Push-Ups', 'Seated Dumbbell Press'],
      jointStress: ['Shoulders'],
    },
    {
      name: 'Dumbbell Lateral Raise',
      category: 'Shoulders',
      substitutions: ['Water Bottle / Light Band Lateral Raise', 'Thumbs-Up Y-Raises', 'Scaption Raise'],
      jointStress: [],
    },
    {
      name: 'Dumbbell Bicep Curl to Hammer Curl',
      category: 'Arms',
      substitutions: ['Resistance Band Bicep Curl', 'Isometric Towel Bicep Curl'],
      jointStress: ['Elbows'],
    },
    {
      name: 'Overhead Dumbbell Triceps Extension',
      category: 'Arms',
      substitutions: ['Bench/Chair Dips', 'Diamond Push-Ups', 'Floor Tricep Extensions'],
      jointStress: ['Elbows'],
    },
    {
      name: 'Dead Bug with Dumbbell Hold',
      category: 'Core',
      substitutions: ['Plank to Downward Dog', 'Hollow Body Hold', 'Bicycle Crunches'],
      jointStress: [],
    },
  ],
  'Bodyweight Only': [
    {
      name: 'Standard Push-Ups',
      category: 'Chest',
      substitutions: ['Knee Push-Ups', 'Incline Push-Ups', 'Decline Push-Ups'],
      jointStress: ['Wrists', 'Shoulders'],
    },
    {
      name: 'Inverted Rows (or Doorframe Rows)',
      category: 'Back',
      substitutions: ['Towel Doorframe Rows', 'Prone Back Extensions', 'Scapular Pull-Ups'],
      jointStress: ['Elbows'],
    },
    {
      name: 'Bodyweight Air Squats',
      category: 'Legs',
      substitutions: ['Assisted Box Squats', '1.5 Rep Tempo Squats', 'Wall Sit'],
      jointStress: ['Knees'],
    },
    {
      name: 'Walking Forward Lunges',
      category: 'Legs',
      substitutions: ['Reverse Lunges', 'Step-Ups on Sturdy Chair', 'Glute Bridges'],
      jointStress: ['Knees'],
    },
    {
      name: 'Pike Push-Ups',
      category: 'Shoulders',
      substitutions: ['Elevated Feet Pike Push-Ups', 'Handstand Wall Hold', 'Bear Crawl Holds'],
      jointStress: ['Shoulders', 'Wrists'],
    },
    {
      name: 'Tricep Bench Dips',
      category: 'Arms',
      substitutions: ['Diamond Push-Ups', 'Close-Grip Push-Ups', 'Plank Press-Ups'],
      jointStress: ['Shoulders'],
    },
    {
      name: 'Hollow Body Hold',
      category: 'Core',
      substitutions: ['Dead Bug', 'Forearm Plank', 'Bird-Dog Hold'],
      jointStress: [],
    },
    {
      name: 'Side Plank Hip Lifts',
      category: 'Core',
      substitutions: ['Static Side Plank', 'Russian Twists', 'Bicycle Crunches'],
      jointStress: ['Shoulders'],
    },
  ],
};

function filterSafeExercises(pool, exclusionZones) {
  if (!exclusionZones || exclusionZones.length === 0) return pool;
  const normalized = exclusionZones.map((z) => z.toLowerCase());

  return pool.filter((item) => {
    const stresses = (item.jointStress || []).map((s) => s.toLowerCase());
    return !stresses.some((stress) => normalized.includes(stress));
  });
}

function getPrescription(primaryGoal) {
  const normalized = (primaryGoal || '').toLowerCase();
  if (normalized.includes('strength') || normalized.includes('power')) {
    return { sets: 4, reps: '4-6', restSeconds: 150 };
  }
  if (normalized.includes('fat_loss') || normalized.includes('tone') || normalized.includes('weight')) {
    return { sets: 3, reps: '12-15', restSeconds: 60 };
  }
  if (normalized.includes('endurance') || normalized.includes('stamina')) {
    return { sets: 3, reps: '15-20', restSeconds: 45 };
  }
  // Default to Hypertrophy
  return { sets: 4, reps: '8-12', restSeconds: 90 };
}

/**
 * Generates an LLM workout plan complying with WorkoutPlan schema:
 *
 * interface WorkoutPlan {
 *   id: string;
 *   programName: string;
 *   warmupRoutine: {
 *     cardioPrimer: string;
 *     dynamicMobility: string[];
 *   };
 *   schedule: WorkoutDay[];
 * }
 */
export async function generateWorkout(storeState) {
  const userProfile = storeState?.userProfile || {};
  const logistics = storeState?.logistics || {};
  const targeting = storeState?.targeting || {};

  const primaryGoal = userProfile.primaryGoal || userProfile.goal || 'Hypertrophy / Muscle';
  const cycleLengthWeeks = Number(userProfile.cycleLengthWeeks) || 8;
  const location = logistics.location || 'Commercial Gym';
  const frequencyDays = Math.max(1, Math.min(7, Number(logistics.frequencyDays || logistics.frequency) || 3));
  const durationMinutes = Number(logistics.durationMinutes || logistics.duration) || 60;
  const exclusionZones = Array.isArray(targeting.exclusionZones) ? targeting.exclusionZones : [];
  const focusAreas = Array.isArray(targeting.focusAreas) ? targeting.focusAreas : [];

  // Simulate network latency (800ms - 1200ms)
  await new Promise((resolve) => setTimeout(resolve, 900));

  const basePool = EXERCISE_CATALOG[location] || EXERCISE_CATALOG['Commercial Gym'];
  const safePool = filterSafeExercises(basePool, exclusionZones);
  const prescription = getPrescription(primaryGoal);

  const dayLabels = [
    'Upper Body Power',
    'Lower Body & Core',
    'Push & Shoulder Focus',
    'Pull & Posterior Chain',
    'Full Body Functional Circuit',
    'Upper Body Hypertrophy',
    'Core & Mobility Flow',
  ];

  const schedule = [];
  const exerciseCountPerDay = durationMinutes >= 60 ? 5 : durationMinutes >= 45 ? 4 : 3;

  for (let d = 0; d < frequencyDays; d++) {
    const dayIndex = d + 1;
    const labelTitle = dayLabels[d % dayLabels.length];
    
    // Shuffle/rotate safe exercises to give variety
    const rotatedPool = [
      ...safePool.slice(d % safePool.length),
      ...safePool.slice(0, d % safePool.length),
    ];

    const exercises = rotatedPool.slice(0, exerciseCountPerDay).map((ex, idx) => ({
      id: `ex-${dayIndex}-${idx + 1}`,
      name: ex.name,
      sets: prescription.sets,
      reps: prescription.reps, // e.g., "8-12"
      restSeconds: prescription.restSeconds,
      substitutions: ex.substitutions || ['Dumbbell Alternative', 'Cable Alternative'],
    }));

    schedule.push({
      dayNumber: dayIndex,
      dayLabel: `Day ${dayIndex}: ${labelTitle}`,
      exercises,
    });
  }

  const workoutPlan = {
    id: `plan_${Date.now()}`,
    programName: `${cycleLengthWeeks}-Week Fig ${primaryGoal} Blueprint`,
    warmupRoutine: {
      cardioPrimer: '5-7 minutes light dynamic cardio (treadmill incline walk, assault bike, or jump rope) to raise core body temp.',
      dynamicMobility: [
        'World’s Greatest Stretch with thoracic rotations (5 reps/side)',
        'Arm Circles & Shoulder Band Dislocates (15 reps)',
        'Bodyweight Deep Squats with 3s Bottom Pause (10 reps)',
        'Cat-Cow to Bird-Dog dynamic spinal wave (8 reps/side)',
      ],
    },
    schedule,
  };

  return workoutPlan;
}

export default generateWorkout;
