import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Rect,
  G,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { MUSCLE_GROUPS } from '../data/wgerExerciseCatalog';

/**
 * Renders both:
 * 1) A Biomechanical Exercise Posture & Force-Vector SVG Diagram (so users immediately see how to perform the movement)
 * 2) A wger-inspired Anatomical Muscle Map highlighting Primary (#C84663) & Secondary (#E09F67) muscles
 */
export default function ExerciseIllustrationSvg({
  svgType = 'squat',
  primaryMuscles = [],
  secondaryMuscles = [],
  compact = false,
}) {
  const isMuscleActive = (muscleKey) => {
    if (primaryMuscles.includes(muscleKey)) return '#C84663'; // Primary Fig Crimson
    if (secondaryMuscles.includes(muscleKey)) return '#E09F67'; // Secondary Bronze/Amber
    return 'rgba(250, 244, 240, 0.12)'; // Inactive anatomical region
  };

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Left Panel: Exercise Biomechanics & Posture Vector */}
      <View style={styles.diagramBox}>
        <View style={styles.diagramLabelTag}>
          <Text style={styles.diagramLabelText}>FORM & PATH</Text>
        </View>
        <Svg width={compact ? 92 : 120} height={compact ? 84 : 104} viewBox="0 0 120 104">
          {/* Subtle floor/grid baseline */}
          <Line
            x1="12"
            y1="92"
            x2="108"
            y2="92"
            stroke="rgba(250, 244, 240, 0.16)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          {renderMovementVector(svgType)}
        </Svg>
      </View>

      {/* Right Panel: wger-Style Anatomical Muscle Highlight Map */}
      <View style={styles.anatomyBox}>
        <View style={styles.diagramLabelTag}>
          <Text style={styles.diagramLabelText}>TARGET MUSCLES</Text>
        </View>
        <Svg width={compact ? 76 : 96} height={compact ? 84 : 104} viewBox="0 0 96 104">
          {/* Head & Neck */}
          <Circle cx="48" cy="14" r="6.5" fill="rgba(250, 244, 240, 0.22)" />
          <Rect x="45.5" y="21" width="5" height="4" rx="1" fill="rgba(250, 244, 240, 0.2)" />

          {/* Upper Traps / Upper Back */}
          <Path
            d="M34 25 Q48 21 62 25 L59 30 L37 30 Z"
            fill={isMuscleActive('upper_back')}
          />

          {/* Deltoids (Shoulders - Left & Right) */}
          <Circle
            cx="31"
            cy="31"
            r="5.5"
            fill={
              primaryMuscles.some((m) => m.includes('deltoid'))
                ? '#C84663'
                : secondaryMuscles.some((m) => m.includes('deltoid'))
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />
          <Circle
            cx="65"
            cy="31"
            r="5.5"
            fill={
              primaryMuscles.some((m) => m.includes('deltoid'))
                ? '#C84663'
                : secondaryMuscles.some((m) => m.includes('deltoid'))
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />

          {/* Pectorals (Chest) */}
          <Rect x="37" y="27" width="10" height="9" rx="2.5" fill={isMuscleActive('pectorals')} />
          <Rect x="49" y="27" width="10" height="9" rx="2.5" fill={isMuscleActive('pectorals')} />

          {/* Lats (Wings on sides of torso) */}
          <Path d="M35 36 L39 36 L40 50 L36 46 Z" fill={isMuscleActive('lats')} />
          <Path d="M61 36 L57 36 L56 50 L60 46 Z" fill={isMuscleActive('lats')} />

          {/* Biceps / Triceps (Upper Arms) */}
          <Rect
            x="25"
            y="36"
            width="6"
            height="13"
            rx="3"
            fill={
              primaryMuscles.includes('biceps') || primaryMuscles.includes('triceps')
                ? '#C84663'
                : secondaryMuscles.includes('biceps') || secondaryMuscles.includes('triceps')
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />
          <Rect
            x="65"
            y="36"
            width="6"
            height="13"
            rx="3"
            fill={
              primaryMuscles.includes('biceps') || primaryMuscles.includes('triceps')
                ? '#C84663'
                : secondaryMuscles.includes('biceps') || secondaryMuscles.includes('triceps')
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />

          {/* Forearms */}
          <Rect x="23.5" y="50" width="5" height="12" rx="2.5" fill={isMuscleActive('forearms')} />
          <Rect x="67.5" y="50" width="5" height="12" rx="2.5" fill={isMuscleActive('forearms')} />

          {/* Core (Abs & Obliques & Lower Back) */}
          <Rect
            x="40.5"
            y="37"
            width="15"
            height="17"
            rx="2.5"
            fill={
              primaryMuscles.includes('abs') ||
              primaryMuscles.includes('obliques') ||
              primaryMuscles.includes('lower_back')
                ? '#C84663'
                : secondaryMuscles.includes('abs') ||
                  secondaryMuscles.includes('obliques') ||
                  secondaryMuscles.includes('lower_back')
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />

          {/* Glutes / Pelvis */}
          <Path
            d="M38 55 L58 55 L60 63 L36 63 Z"
            fill={isMuscleActive('glutes')}
          />

          {/* Quads & Hamstrings (Thighs) */}
          <Rect
            x="36.5"
            y="64"
            width="9.5"
            height="18"
            rx="4"
            fill={
              primaryMuscles.includes('quads') || primaryMuscles.includes('hamstrings')
                ? '#C84663'
                : secondaryMuscles.includes('quads') || secondaryMuscles.includes('hamstrings')
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />
          <Rect
            x="50"
            y="64"
            width="9.5"
            height="18"
            rx="4"
            fill={
              primaryMuscles.includes('quads') || primaryMuscles.includes('hamstrings')
                ? '#C84663'
                : secondaryMuscles.includes('quads') || secondaryMuscles.includes('hamstrings')
                ? '#E09F67'
                : 'rgba(250, 244, 240, 0.12)'
            }
          />

          {/* Calves (Lower Legs) */}
          <Rect x="38" y="83" width="6.5" height="14" rx="3" fill={isMuscleActive('calves')} />
          <Rect x="51.5" y="83" width="6.5" height="14" rx="3" fill={isMuscleActive('calves')} />
        </Svg>
      </View>
    </View>
  );
}

/**
 * Renders the specific movement illustration & force vector path per exercise type
 */
function renderMovementVector(svgType) {
  const boneColor = '#FAF4F0';
  const jointColor = '#C84663';
  const equipColor = '#96839B';
  const vectorColor = '#C84663';
  const secondaryLimb = 'rgba(250, 244, 240, 0.45)';

  switch (svgType) {
    case 'bench_press':
      return (
        <G>
          {/* Flat Bench */}
          <Rect x="22" y="68" width="58" height="5" rx="2" fill={equipColor} />
          <Line x1="30" y1="73" x2="30" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="72" y1="73" x2="72" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Lifter supine on bench */}
          <Circle cx="28" cy="60" r="5.5" fill={boneColor} />
          <Line x1="35" y1="63" x2="72" y2="63" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Legs planted */}
          <Line x1="72" y1="63" x2="88" y2="70" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="88" y1="70" x2="88" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms pressing vertical */}
          <Line x1="44" y1="63" x2="44" y2="36" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="44" cy="63" r="3" fill={jointColor} />
          {/* Barbell & Plates */}
          <Line x1="32" y1="34" x2="56" y2="34" stroke={jointColor} strokeWidth="3" />
          <Rect x="40" y="27" width="8" height="14" rx="2" fill={jointColor} />
          {/* Upward Press Vector Arrow */}
          <Line x1="64" y1="54" x2="64" y2="24" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="64,18 60,26 68,26" fill={vectorColor} />
        </G>
      );

    case 'incline_press':
      return (
        <G>
          {/* Incline Bench */}
          <Line x1="28" y1="45" x2="62" y2="74" stroke={equipColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="62" y1="74" x2="78" y2="70" stroke={equipColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="40" y1="58" x2="40" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="68" y1="74" x2="68" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Lifter */}
          <Circle cx="36" cy="40" r="5.5" fill={boneColor} />
          <Line x1="40" y1="46" x2="62" y2="68" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="62" y1="68" x2="82" y2="68" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="82" y1="68" x2="86" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arm pressing overhead on incline */}
          <Line x1="46" y1="52" x2="48" y2="25" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="46" cy="52" r="3" fill={jointColor} />
          <Rect x="42" y="20" width="12" height="6" rx="2" fill={jointColor} />
          {/* Vector */}
          <Line x1="64" y1="48" x2="64" y2="20" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="64,14 60,22 68,22" fill={vectorColor} />
        </G>
      );

    case 'pushup':
      return (
        <G>
          {/* Rigid plank body */}
          <Circle cx="88" cy="46" r="5.5" fill={boneColor} />
          <Line x1="82" y1="50" x2="24" y2="86" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Arms supporting on floor */}
          <Line x1="76" y1="54" x2="70" y2="72" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="70" y1="72" x2="76" y2="91" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="76" cy="54" r="3" fill={jointColor} />
          <Circle cx="70" cy="72" r="2.5" fill={jointColor} />
          {/* Up/Down Push Vector */}
          <Line x1="58" y1="44" x2="58" y2="24" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="58,18 54,26 62,26" fill={vectorColor} />
        </G>
      );

    case 'dip':
      return (
        <G>
          {/* Parallel Dip Bars */}
          <Line x1="34" y1="54" x2="86" y2="54" stroke={equipColor} strokeWidth="3.5" />
          <Line x1="40" y1="54" x2="40" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="80" y1="54" x2="80" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Figure suspended */}
          <Circle cx="64" cy="22" r="5.5" fill={boneColor} />
          <Line x1="62" y1="29" x2="54" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Bent knees */}
          <Line x1="54" y1="58" x2="52" y2="78" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="52" y1="78" x2="40" y2="76" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Bent Elbow Dipping */}
          <Line x1="60" y1="34" x2="48" y2="42" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="48" y1="42" x2="58" y2="54" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="48" cy="42" r="3" fill={jointColor} />
          {/* Vector */}
          <Line x1="82" y1="44" x2="82" y2="20" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="82,14 78,22 86,22" fill={vectorColor} />
        </G>
      );

    case 'overhead_press':
      return (
        <G>
          {/* Standing Lifter */}
          <Circle cx="56" cy="36" r="5.5" fill={boneColor} />
          <Line x1="56" y1="43" x2="56" y2="68" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="56" y1="68" x2="48" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="56" y1="68" x2="64" y2="91" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          {/* Arms Pressing Overhead */}
          <Line x1="56" y1="45" x2="40" y2="34" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="40" y1="34" x2="42" y2="18" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="56" y1="45" x2="72" y2="34" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="72" y1="34" x2="70" y2="18" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="40" cy="34" r="2.8" fill={jointColor} />
          <Circle cx="72" cy="34" r="2.8" fill={jointColor} />
          {/* Overhead Barbell */}
          <Line x1="26" y1="18" x2="86" y2="18" stroke={jointColor} strokeWidth="3" />
          <Rect x="30" y="13" width="5" height="10" rx="1.5" fill={jointColor} />
          <Rect x="77" y="13" width="5" height="10" rx="1.5" fill={jointColor} />
          {/* Upward Vector */}
          <Polygon points="56,6 52,13 60,13" fill={vectorColor} />
        </G>
      );

    case 'lateral_raise':
      return (
        <G>
          {/* Standing Figure Front View */}
          <Circle cx="60" cy="26" r="5.5" fill={boneColor} />
          <Line x1="60" y1="33" x2="60" y2="62" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="60" y1="62" x2="52" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="60" y1="62" x2="68" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms Sweeping Outward */}
          <Line x1="58" y1="36" x2="26" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="62" y1="36" x2="94" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="56" cy="36" r="3" fill={jointColor} />
          <Circle cx="64" cy="36" r="3" fill={jointColor} />
          {/* Dumbbells */}
          <Rect x="20" y="34" width="6" height="8" rx="1.5" fill={jointColor} />
          <Rect x="94" y="34" width="6" height="8" rx="1.5" fill={jointColor} />
          {/* Sweeping Arc Arrows */}
          <Path d="M36 58 Q24 50 24 44" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Path d="M84 58 Q96 50 96 44" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
        </G>
      );

    case 'lat_pulldown':
      return (
        <G>
          {/* Overhead Bar & Cable */}
          <Line x1="60" y1="4" x2="60" y2="20" stroke={equipColor} strokeWidth="2" />
          <Line x1="30" y1="20" x2="90" y2="20" stroke={jointColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Seated / Hanging Figure */}
          <Circle cx="60" cy="40" r="5.5" fill={boneColor} />
          <Line x1="60" y1="47" x2="60" y2="72" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="60" y1="72" x2="76" y2="72" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="76" y1="72" x2="76" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Wide Arms Pulling Down */}
          <Line x1="56" y1="48" x2="38" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="38" y1="38" x2="36" y2="20" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="64" y1="48" x2="82" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="82" y1="38" x2="84" y2="20" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Downward Elbows Vector */}
          <Line x1="28" y1="28" x2="28" y2="48" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="28,53 24,45 32,45" fill={vectorColor} />
          <Line x1="92" y1="28" x2="92" y2="48" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="92,53 88,45 96,45" fill={vectorColor} />
        </G>
      );

    case 'row':
      return (
        <G>
          {/* Hinged Torso Rowing */}
          <Circle cx="76" cy="30" r="5.5" fill={boneColor} />
          <Line x1="70" y1="35" x2="40" y2="54" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Legs */}
          <Line x1="40" y1="54" x2="48" y2="72" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="48" y1="72" x2="44" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arm Pulling Back */}
          <Line x1="64" y1="39" x2="52" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="52" y1="28" x2="62" y2="48" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="52" cy="28" r="3" fill={jointColor} />
          {/* Dumbbell / Barbell */}
          <Rect x="56" y="46" width="12" height="6" rx="2" fill={jointColor} />
          {/* Pull Vector Arrow */}
          <Line x1="74" y1="68" x2="64" y2="54" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="61,49 62,58 69,53" fill={vectorColor} />
        </G>
      );

    case 'squat':
      return (
        <G>
          {/* Squatting Figure at Parallel */}
          <Circle cx="66" cy="24" r="5.5" fill={boneColor} />
          {/* Barbell on Upper Traps */}
          <Circle cx="60" cy="31" r="5" fill={jointColor} />
          {/* Torso */}
          <Line x1="60" y1="31" x2="42" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="42" cy="58" r="3.5" fill={jointColor} />
          {/* Thigh parallel to floor */}
          <Line x1="42" y1="58" x2="70" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="70" cy="60" r="3" fill={jointColor} />
          {/* Shin driving to mid-foot */}
          <Line x1="70" y1="60" x2="58" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Upward Drive Vector */}
          <Line x1="26" y1="64" x2="26" y2="26" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="26,18 22,27 30,27" fill={vectorColor} />
        </G>
      );

    case 'leg_press':
      return (
        <G>
          {/* 45 Degree Sled Frame */}
          <Line x1="24" y1="86" x2="54" y2="86" stroke={equipColor} strokeWidth="4" />
          <Line x1="24" y1="86" x2="18" y2="64" stroke={equipColor} strokeWidth="4" />
          {/* Seated Lifter */}
          <Circle cx="24" cy="56" r="5" fill={boneColor} />
          <Line x1="26" y1="63" x2="36" y2="82" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Legs Pressing 45 deg Sled */}
          <Line x1="36" y1="82" x2="50" y2="60" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="50" y1="60" x2="72" y2="44" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="50" cy="60" r="3" fill={jointColor} />
          {/* Sled Footplate */}
          <Line x1="66" y1="34" x2="80" y2="54" stroke={jointColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Diagonal Press Vector */}
          <Line x1="76" y1="40" x2="94" y2="24" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="98,20 89,23 95,29" fill={vectorColor} />
        </G>
      );

    case 'hinge':
      return (
        <G>
          {/* Hip Hinge (RDL) Figure */}
          <Circle cx="78" cy="32" r="5.5" fill={boneColor} />
          {/* Flat Neutral Spine */}
          <Line x1="72" y1="36" x2="36" y2="50" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="36" cy="50" r="3.5" fill={jointColor} />
          {/* Slight knee bend, hips pushed back */}
          <Line x1="36" y1="50" x2="52" y2="70" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="52" y1="70" x2="50" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms hanging vertically with Barbell along shins */}
          <Line x1="66" y1="39" x2="64" y2="68" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="64" cy="70" r="5.5" fill={jointColor} />
          {/* Hip Push-Back Vector */}
          <Line x1="32" y1="50" x2="16" y2="50" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="12,50 19,46 19,54" fill={vectorColor} />
        </G>
      );

    case 'glute_bridge':
      return (
        <G>
          {/* Bench Support */}
          <Rect x="18" y="64" width="20" height="27" rx="3" fill={equipColor} />
          {/* Bridged Figure */}
          <Circle cx="24" cy="56" r="5" fill={boneColor} />
          <Line x1="30" y1="60" x2="68" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="68" cy="58" r="4" fill={jointColor} />
          {/* Vertical Shins */}
          <Line x1="68" y1="58" x2="84" y2="62" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="84" y1="62" x2="84" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Hip Drive Upward Arrow */}
          <Line x1="64" y1="50" x2="64" y2="26" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="64,20 60,28 68,28" fill={vectorColor} />
        </G>
      );

    case 'lunge':
      return (
        <G>
          {/* Split Stance Lunge Figure */}
          <Circle cx="58" cy="22" r="5.5" fill={boneColor} />
          <Line x1="58" y1="29" x2="56" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Front Leg (90 deg) */}
          <Line x1="56" y1="58" x2="78" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="78" y1="60" x2="78" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="78" cy="60" r="3" fill={jointColor} />
          {/* Rear Leg (90 deg knee near floor) */}
          <Line x1="56" y1="58" x2="48" y2="82" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Line x1="48" y1="82" x2="26" y2="86" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="48" cy="82" r="3" fill={jointColor} />
          {/* Vertical Drive Vector */}
          <Line x1="94" y1="60" x2="94" y2="26" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="94,20 90,28 98,28" fill={vectorColor} />
        </G>
      );

    case 'bicep_curl':
      return (
        <G>
          {/* Standing Figure */}
          <Circle cx="52" cy="20" r="5.5" fill={boneColor} />
          <Line x1="52" y1="27" x2="52" y2="60" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="52" y1="60" x2="48" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="52" y1="60" x2="58" y2="91" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          {/* Upper Arm Pinned */}
          <Line x1="52" y1="30" x2="54" y2="50" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="54" cy="50" r="3" fill={jointColor} />
          {/* Forearm Curling Upward */}
          <Line x1="54" y1="50" x2="72" y2="36" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="74" cy="34" r="4" fill={jointColor} />
          {/* Curling Arc Vector */}
          <Path d="M72 58 Q84 46 78 30" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="76,26 75,34 82,31" fill={vectorColor} />
        </G>
      );

    case 'tricep_ext':
      return (
        <G>
          {/* Cable Column */}
          <Line x1="88" y1="10" x2="88" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="88" y1="14" x2="66" y2="48" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Standing Figure */}
          <Circle cx="46" cy="20" r="5.5" fill={boneColor} />
          <Line x1="46" y1="27" x2="44" y2="60" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="44" y1="60" x2="42" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Pinned Elbow + Extending Forearm */}
          <Line x1="46" y1="30" x2="48" y2="48" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="48" cy="48" r="3" fill={jointColor} />
          <Line x1="48" y1="48" x2="64" y2="64" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Downward Extension Vector */}
          <Path d="M68 44 Q74 56 66 68" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="64,72 64,64 71,68" fill={vectorColor} />
        </G>
      );

    case 'core_hang':
      return (
        <G>
          {/* Pull-Up Bar */}
          <Line x1="36" y1="12" x2="84" y2="12" stroke={equipColor} strokeWidth="4" strokeLinecap="round" />
          {/* Hanging Figure Raising Legs */}
          <Line x1="54" y1="12" x2="54" y2="30" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="54" cy="24" r="5" fill={boneColor} />
          <Line x1="54" y1="30" x2="54" y2="56" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="54" cy="56" r="3.5" fill={jointColor} />
          {/* Legs Raised to 90 deg */}
          <Line x1="54" y1="56" x2="84" y2="52" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Upward Arc Vector */}
          <Path d="M64 82 Q88 74 88 56" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="88,50 84,58 92,58" fill={vectorColor} />
        </G>
      );

    case 'core_floor':
      return (
        <G>
          {/* Supine / Dead Bug / Plank Core Bracing */}
          <Circle cx="26" cy="76" r="5.5" fill={boneColor} />
          <Line x1="33" y1="80" x2="68" y2="80" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="50" cy="80" r="3.5" fill={jointColor} />
          {/* Raised Contralateral Limbs */}
          <Line x1="38" y1="80" x2="34" y2="52" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="68" y1="80" x2="68" y2="56" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="56" x2="86" y2="56" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="80" x2="96" y2="74" stroke={secondaryLimb} strokeWidth="3.5" strokeLinecap="round" />
          {/* Core Compression Vector */}
          <Line x1="50" y1="60" x2="50" y2="74" stroke={vectorColor} strokeWidth="2" strokeDasharray="2,2" />
          <Polygon points="50,76 46,69 54,69" fill={vectorColor} />
        </G>
      );

    case 'cable_fly':
    default:
      return (
        <G>
          {/* Standing Cable Fly / Press */}
          <Circle cx="60" cy="24" r="5.5" fill={boneColor} />
          <Line x1="60" y1="31" x2="60" y2="62" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="60" y1="62" x2="50" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="60" y1="62" x2="70" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Cable Lines from Sides */}
          <Line x1="16" y1="34" x2="46" y2="42" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          <Line x1="104" y1="34" x2="74" y2="42" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Arms Hugging Inward */}
          <Path d="M56 35 Q42 38 52 46" stroke={boneColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Path d="M64 35 Q78 38 68 46" stroke={boneColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Circle cx="54" cy="46" r="3" fill={jointColor} />
          <Circle cx="66" cy="46" r="3" fill={jointColor} />
        </G>
      );
  }
}

/**
 * Generates raw inline SVG markup for embedding in the PDF export (`generateWorkoutPdf.js`)
 * so downloaded PDFs also display the exercise diagram!
 */
export function getExercisePdfSvgMarkup(svgType = 'squat') {
  const stroke = '#361D40';
  const accent = '#C84663';
  const muted = '#96839B';

  const paths = {
    bench_press: `
      <rect x="10" y="38" width="36" height="3" fill="${muted}" />
      <circle cx="15" cy="33" r="3.5" fill="${stroke}" />
      <line x1="20" y1="35" x2="44" y2="35" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="26" y1="35" x2="26" y2="16" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
      <rect x="22" y="12" width="8" height="6" rx="1" fill="${accent}" />
      <line x1="38" y1="28" x2="38" y2="12" stroke="${accent}" stroke-width="1.5" stroke-dasharray="2,2" />
    `,
    incline_press: `
      <line x1="14" y1="24" x2="38" y2="42" stroke="${muted}" stroke-width="3" />
      <circle cx="20" cy="20" r="3.5" fill="${stroke}" />
      <line x1="23" y1="24" x2="38" y2="38" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="28" y1="28" x2="28" y2="12" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
      <rect x="24" y="9" width="8" height="4" rx="1" fill="${accent}" />
    `,
    pushup: `
      <circle cx="48" cy="24" r="3.5" fill="${stroke}" />
      <line x1="44" y1="27" x2="12" y2="44" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="40" y1="29" x2="40" y2="44" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="40" cy="29" r="2.5" fill="${accent}" />
    `,
    overhead_press: `
      <circle cx="30" cy="20" r="3.5" fill="${stroke}" />
      <line x1="30" y1="24" x2="30" y2="44" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="18" y1="10" x2="42" y2="10" stroke="${accent}" stroke-width="2.5" />
      <line x1="30" y1="26" x2="22" y2="10" stroke="${stroke}" stroke-width="2" />
      <line x1="30" y1="26" x2="38" y2="10" stroke="${stroke}" stroke-width="2" />
    `,
    lat_pulldown: `
      <line x1="14" y1="10" x2="46" y2="10" stroke="${accent}" stroke-width="2.5" />
      <circle cx="30" cy="24" r="3.5" fill="${stroke}" />
      <line x1="30" y1="28" x2="30" y2="44" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="28" y1="30" x2="18" y2="10" stroke="${stroke}" stroke-width="2" />
      <line x1="32" y1="30" x2="42" y2="10" stroke="${stroke}" stroke-width="2" />
    `,
    row: `
      <circle cx="42" cy="18" r="3.5" fill="${stroke}" />
      <line x1="38" y1="21" x2="20" y2="32" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="20" y1="32" x2="24" y2="45" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="34" y1="23" x2="34" y2="36" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" />
      <rect x="30" y="35" width="8" height="4" rx="1" fill="${accent}" />
    `,
    squat: `
      <circle cx="36" cy="14" r="3.5" fill="${stroke}" />
      <circle cx="32" cy="18" r="3" fill="${accent}" />
      <line x1="32" y1="18" x2="22" y2="32" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="22" y1="32" x2="38" y2="33" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="38" y1="33" x2="32" y2="46" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
    `,
    hinge: `
      <circle cx="44" cy="18" r="3.5" fill="${stroke}" />
      <line x1="40" y1="21" x2="20" y2="28" stroke="${stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="20" y1="28" x2="26" y2="46" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="36" y1="23" x2="36" y2="38" stroke="${stroke}" stroke-width="2" />
      <circle cx="36" cy="39" r="3.5" fill="${accent}" />
    `,
  };

  const inner = paths[svgType] || paths.squat;
  return `<svg width="52" height="48" viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg" style="background:#FAF6F8;border:1px solid #EAD8DF;border-radius:6px;">
    <line x1="6" y1="46" x2="54" y2="46" stroke="#EAD8DF" stroke-width="1" />
    ${inner}
  </svg>`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  containerCompact: {
    padding: 8,
  },
  diagramBox: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 17, 36, 0.55)',
    borderRadius: 10,
    paddingTop: 18,
    paddingBottom: 4,
    position: 'relative',
  },
  anatomyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 17, 36, 0.55)',
    borderRadius: 10,
    paddingTop: 18,
    paddingBottom: 4,
    position: 'relative',
  },
  diagramLabelTag: {
    position: 'absolute',
    top: 5,
    left: 8,
  },
  diagramLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.7,
  },
});

