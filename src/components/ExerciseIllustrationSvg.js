import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Rect,
  G,
  Polygon,
} from 'react-native-svg';
import { Colors } from '../theme/colors';

const KNOWN_SVG_TYPES = new Set([
  'bench_press',
  'floor_press',
  'incline_press',
  'machine_chest_press',
  'cable_fly',
  'pushup',
  'decline_pushup',
  'pike_pushup',
  'dip',
  'overhead_press',
  'lateral_raise',
  'lat_pulldown',
  'pullup',
  'straight_arm_pulldown',
  'db_pullover',
  'row',
  'one_arm_db_row',
  'seated_cable_row',
  'chest_supported_row',
  'inverted_row',
  'face_pull',
  'squat',
  'goblet_squat',
  'air_squat',
  'wall_sit',
  'leg_press',
  'leg_extension',
  'hinge',
  'leg_curl',
  'glute_bridge',
  'lunge',
  'bulgarian_split_squat',
  'calf_raise',
  'bicep_curl',
  'incline_curl',
  'tricep_ext',
  'overhead_tricep_ext',
  'core_hang',
  'core_floor',
  'plank',
]);

/**
 * Renders both:
 * 1) A Biomechanical Exercise Posture & Force-Vector SVG Diagram
 *    - Automatically flags any pattern-level approximation with an amber "≈ PATTERN GUIDE" badge & note
 * 2) A wger-inspired Anatomical Muscle Map highlighting Primary (#C84663) & Secondary (#E09F67) muscles
 */
export default function ExerciseIllustrationSvg({
  svgType = 'squat',
  svgAccuracy = 'exact',
  svgNote = null,
  primaryMuscles = [],
  secondaryMuscles = [],
  compact = false,
}) {
  const isKnownType = KNOWN_SVG_TYPES.has(svgType);
  const isApproximation = svgAccuracy === 'pattern' || !isKnownType || Boolean(svgNote);

  const isMuscleActive = (muscleKey) => {
    if (primaryMuscles.includes(muscleKey)) return '#C84663'; // Primary Fig Crimson
    if (secondaryMuscles.includes(muscleKey)) return '#E09F67'; // Secondary Bronze/Amber
    return 'rgba(250, 244, 240, 0.12)'; // Inactive anatomical region
  };

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.container, compact && styles.containerCompact]}>
        {/* Left Panel: Exercise Biomechanics & Posture Vector */}
        <View
          style={[
            styles.diagramBox,
            isApproximation && styles.diagramBoxApproximation,
          ]}
        >
          <View
            style={[
              styles.diagramLabelTag,
              isApproximation && styles.diagramLabelTagApproximation,
            ]}
          >
            <Text
              style={[
                styles.diagramLabelText,
                isApproximation && styles.diagramLabelTextApproximation,
              ]}
            >
              {isApproximation ? '≈ PATTERN GUIDE' : 'FORM & PATH'}
            </Text>
          </View>
          <Svg
            width={compact ? 92 : 120}
            height={compact ? 84 : 104}
            viewBox="0 0 120 104"
          >
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
          <Svg
            width={compact ? 76 : 96}
            height={compact ? 84 : 104}
            viewBox="0 0 96 104"
          >
            {/* Head & Neck */}
            <Circle cx="48" cy="14" r="6.5" fill="rgba(250, 244, 240, 0.22)" />
            <Rect
              x="45.5"
              y="21"
              width="5"
              height="4"
              rx="1"
              fill="rgba(250, 244, 240, 0.2)"
            />

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
            <Rect
              x="37"
              y="27"
              width="10"
              height="9"
              rx="2.5"
              fill={isMuscleActive('pectorals')}
            />
            <Rect
              x="49"
              y="27"
              width="10"
              height="9"
              rx="2.5"
              fill={isMuscleActive('pectorals')}
            />

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
                  : secondaryMuscles.includes('biceps') ||
                    secondaryMuscles.includes('triceps')
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
                  : secondaryMuscles.includes('biceps') ||
                    secondaryMuscles.includes('triceps')
                  ? '#E09F67'
                  : 'rgba(250, 244, 240, 0.12)'
              }
            />

            {/* Forearms */}
            <Rect
              x="23.5"
              y="50"
              width="5"
              height="12"
              rx="2.5"
              fill={isMuscleActive('forearms')}
            />
            <Rect
              x="67.5"
              y="50"
              width="5"
              height="12"
              rx="2.5"
              fill={isMuscleActive('forearms')}
            />

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
                  : secondaryMuscles.includes('quads') ||
                    secondaryMuscles.includes('hamstrings')
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
                  : secondaryMuscles.includes('quads') ||
                    secondaryMuscles.includes('hamstrings')
                  ? '#E09F67'
                  : 'rgba(250, 244, 240, 0.12)'
              }
            />

            {/* Calves (Lower Legs) */}
            <Rect
              x="38"
              y="83"
              width="6.5"
              height="14"
              rx="3"
              fill={isMuscleActive('calves')}
            />
            <Rect
              x="51.5"
              y="83"
              width="6.5"
              height="14"
              rx="3"
              fill={isMuscleActive('calves')}
            />
          </Svg>
        </View>
      </View>

      {/* Flag Banner when SVG is a Pattern Approximation */}
      {isApproximation && (
        <View style={styles.approxBanner}>
          <Text style={styles.approxIcon}>≈</Text>
          <Text style={styles.approxText}>
            {svgNote ||
              'Visual shows general movement pattern path — follow cues below for exact setup.'}
          </Text>
        </View>
      )}
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

    case 'floor_press':
      return (
        <G>
          {/* Floor Mat directly on ground (no bench) */}
          <Rect x="16" y="88" width="88" height="4" rx="2" fill={equipColor} />
          {/* Lifter lying flat on floor with knees bent */}
          <Circle cx="26" cy="81" r="5.5" fill={boneColor} />
          <Line x1="33" y1="84" x2="68" y2="84" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Bent knees with feet planted on floor */}
          <Line x1="68" y1="84" x2="80" y2="66" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="80" y1="66" x2="92" y2="88" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Triceps paused on floor, forearms vertical pressing dumbbells */}
          <Line x1="42" y1="84" x2="42" y2="56" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="42" cy="84" r="3" fill={jointColor} />
          {/* Dumbbell */}
          <Rect x="35" y="51" width="14" height="6" rx="2" fill={jointColor} />
          {/* Upward Press Vector */}
          <Line x1="58" y1="72" x2="58" y2="34" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="58,28 54,36 62,36" fill={vectorColor} />
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

    case 'machine_chest_press':
      return (
        <G>
          {/* Upright Machine Backrest & Seat */}
          <Line x1="28" y1="22" x2="28" y2="92" stroke={equipColor} strokeWidth="4" />
          <Line x1="28" y1="68" x2="50" y2="68" stroke={equipColor} strokeWidth="4" />
          {/* Seated Lifter */}
          <Circle cx="38" cy="30" r="5.5" fill={boneColor} />
          <Line x1="36" y1="36" x2="36" y2="64" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="36" y1="64" x2="56" y2="66" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="56" y1="66" x2="58" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms Pressing Handles Horizontally Forward */}
          <Line x1="36" y1="42" x2="68" y2="42" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="36" cy="42" r="3" fill={jointColor} />
          {/* Machine Lever Arm */}
          <Line x1="62" y1="16" x2="70" y2="48" stroke={jointColor} strokeWidth="3" />
          {/* Horizontal Forward Press Vector */}
          <Line x1="74" y1="42" x2="98" y2="42" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="104,42 96,38 96,46" fill={vectorColor} />
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

    case 'decline_pushup':
      return (
        <G>
          {/* Box / Bench under feet */}
          <Rect x="14" y="64" width="22" height="28" rx="3" fill={equipColor} />
          {/* Feet elevated on box, torso angled toward hands on floor */}
          <Circle cx="90" cy="60" r="5.5" fill={boneColor} />
          <Line x1="84" y1="62" x2="28" y2="62" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Arms pressing from floor */}
          <Line x1="78" y1="62" x2="74" y2="76" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="74" y1="76" x2="80" y2="91" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="78" cy="62" r="3" fill={jointColor} />
          {/* Upward Press Vector */}
          <Line x1="88" y1="46" x2="88" y2="24" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="88,18 84,26 92,26" fill={vectorColor} />
        </G>
      );

    case 'pike_pushup':
      return (
        <G>
          {/* Inverted V Pike Posture */}
          <Line x1="28" y1="91" x2="54" y2="34" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="54" cy="34" r="4" fill={jointColor} />
          <Line x1="54" y1="34" x2="78" y2="68" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="82" cy="72" r="5" fill={boneColor} />
          {/* Arms pressing floor */}
          <Line x1="74" y1="62" x2="84" y2="91" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Diagonal Pike Press Vector */}
          <Line x1="94" y1="66" x2="80" y2="38" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="77,32 77,41 85,37" fill={vectorColor} />
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
          {/* Seated Figure with thigh pad */}
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

    case 'pullup':
      return (
        <G>
          {/* Fixed Pull-Up Bar */}
          <Line x1="26" y1="14" x2="94" y2="14" stroke={equipColor} strokeWidth="4" strokeLinecap="round" />
          {/* Hanging Body Pulling Upward */}
          <Circle cx="60" cy="24" r="5.5" fill={boneColor} />
          <Line x1="60" y1="31" x2="60" y2="60" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Suspended Legs (crossed ankles off floor) */}
          <Line x1="60" y1="60" x2="58" y2="82" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="58" y1="82" x2="50" y2="76" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Bent Arms Pulling Body Up to Bar */}
          <Line x1="56" y1="34" x2="40" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="40" y1="28" x2="44" y2="14" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="64" y1="34" x2="80" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="80" y1="28" x2="76" y2="14" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Upward Body Pull Vector */}
          <Line x1="28" y1="54" x2="28" y2="26" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="28,20 24,28 32,28" fill={vectorColor} />
        </G>
      );

    case 'straight_arm_pulldown':
      return (
        <G>
          {/* Cable Column & High Pulley */}
          <Line x1="90" y1="10" x2="90" y2="92" stroke={equipColor} strokeWidth="3.5" />
          <Line x1="90" y1="14" x2="62" y2="48" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Hinged Lifter Facing Cable */}
          <Circle cx="44" cy="26" r="5.5" fill={boneColor} />
          <Line x1="42" y1="33" x2="32" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="32" y1="58" x2="36" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Straight Arm Sweeping Arc Down to Thighs */}
          <Line x1="42" y1="35" x2="62" y2="48" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="42" cy="35" r="3" fill={jointColor} />
          {/* Downward Arc Vector */}
          <Path d="M72 30 Q68 50 50 62" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="45,65 54,64 50,57" fill={vectorColor} />
        </G>
      );

    case 'db_pullover':
      return (
        <G>
          {/* Flat Bench */}
          <Rect x="26" y="66" width="54" height="5" rx="2" fill={equipColor} />
          <Line x1="34" y1="71" x2="34" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="72" y1="71" x2="72" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Supine Lifter */}
          <Circle cx="30" cy="58" r="5.5" fill={boneColor} />
          <Line x1="37" y1="61" x2="74" y2="61" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="74" y1="61" x2="88" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Extended Arms Arcing Dumbbell from Behind Head Over Chest */}
          <Line x1="38" y1="59" x2="18" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Rect x="12" y="32" width="10" height="6" rx="2" fill={jointColor} />
          {/* Overhead Pullover Arc Vector */}
          <Path d="M18 28 Q34 14 50 32" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="54,36 51,28 45,33" fill={vectorColor} />
        </G>
      );

    case 'row':
      return (
        <G>
          {/* Hinged Torso Barbell Bent-Over Row */}
          <Circle cx="76" cy="30" r="5.5" fill={boneColor} />
          <Line x1="70" y1="35" x2="40" y2="54" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="40" y1="54" x2="48" y2="72" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="48" y1="72" x2="44" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arm Pulling Barbell to Ribs */}
          <Line x1="64" y1="39" x2="52" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="52" y1="28" x2="62" y2="48" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="52" cy="28" r="3" fill={jointColor} />
          <Circle cx="62" cy="50" r="5.5" fill={jointColor} />
          {/* Pull Vector Arrow */}
          <Line x1="74" y1="70" x2="64" y2="56" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="61,51 62,60 69,55" fill={vectorColor} />
        </G>
      );

    case 'one_arm_db_row':
      return (
        <G>
          {/* Support Bench */}
          <Rect x="52" y="64" width="44" height="5" rx="2" fill={equipColor} />
          <Line x1="58" y1="69" x2="58" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="90" y1="69" x2="90" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Flat Horizontal Back Supported by Front Arm & Knee on Bench */}
          <Circle cx="86" cy="36" r="5" fill={boneColor} />
          <Line x1="78" y1="40" x2="38" y2="42" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Support Arm on Bench */}
          <Line x1="76" y1="40" x2="82" y2="64" stroke={secondaryLimb} strokeWidth="3" strokeLinecap="round" />
          {/* Support Knee on Bench + Back Leg on Floor */}
          <Line x1="42" y1="42" x2="60" y2="64" stroke={secondaryLimb} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="38" y1="42" x2="26" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Working Arm Rowing Single Dumbbell to Hip */}
          <Line x1="70" y1="40" x2="56" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="56" y1="28" x2="58" y2="50" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="56" cy="28" r="3" fill={jointColor} />
          <Rect x="52" y="48" width="12" height="5" rx="1.5" fill={jointColor} />
          {/* Arc Pull Vector toward Hip */}
          <Path d="M68 62 Q58 58 56 44" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="56,38 52,46 60,46" fill={vectorColor} />
        </G>
      );

    case 'seated_cable_row':
      return (
        <G>
          {/* Row Bench & Footplate */}
          <Rect x="20" y="70" width="60" height="4" rx="2" fill={equipColor} />
          <Line x1="78" y1="54" x2="78" y2="74" stroke={equipColor} strokeWidth="4" />
          {/* Cable Column & Horizontal Cable */}
          <Line x1="98" y1="20" x2="98" y2="92" stroke={equipColor} strokeWidth="3.5" />
          <Line x1="98" y1="50" x2="52" y2="50" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Upright Seated Lifter */}
          <Circle cx="36" cy="30" r="5.5" fill={boneColor} />
          <Line x1="36" y1="37" x2="36" y2="68" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Legs Braced Against Footplate */}
          <Line x1="36" y1="68" x2="56" y2="60" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="56" y1="60" x2="76" y2="66" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms Pulling Handle Horizontally to Midsection */}
          <Line x1="36" y1="44" x2="26" y2="52" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="26" y1="52" x2="48" y2="50" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="26" cy="52" r="3" fill={jointColor} />
          {/* Horizontal Row Vector */}
          <Line x1="74" y1="42" x2="50" y2="42" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="44,42 52,38 52,46" fill={vectorColor} />
        </G>
      );

    case 'chest_supported_row':
      return (
        <G>
          {/* 45 deg Incline Bench */}
          <Line x1="32" y1="78" x2="76" y2="38" stroke={equipColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="42" y1="70" x2="42" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="70" y1="44" x2="70" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Lifter Lying Chest-Down on Incline Pad */}
          <Circle cx="80" cy="28" r="5" fill={boneColor} />
          <Line x1="72" y1="34" x2="38" y2="66" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="38" y1="66" x2="24" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arm Rowing Dumbbell Upward */}
          <Line x1="66" y1="40" x2="54" y2="30" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="54" y1="30" x2="62" y2="54" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="54" cy="30" r="3" fill={jointColor} />
          <Rect x="56" y="54" width="12" height="5" rx="1.5" fill={jointColor} />
          {/* Upward Row Vector */}
          <Line x1="84" y1="68" x2="84" y2="44" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="84,38 80,46 88,46" fill={vectorColor} />
        </G>
      );

    case 'inverted_row':
      return (
        <G>
          {/* Rack Uprights & Low Horizontal Bar */}
          <Line x1="42" y1="24" x2="42" y2="92" stroke={equipColor} strokeWidth="3.5" />
          <Circle cx="42" cy="38" r="4" fill={jointColor} />
          {/* Supine Body Hanging Underneath Bar with Heels on Floor */}
          <Circle cx="30" cy="48" r="5" fill={boneColor} />
          <Line x1="36" y1="52" x2="88" y2="88" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Arms Pulling Chest Up to Low Bar */}
          <Line x1="42" y1="55" x2="42" y2="38" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="42" cy="55" r="3" fill={jointColor} />
          {/* Upward Pull Vector */}
          <Line x1="62" y1="58" x2="52" y2="38" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="49,32 49,41 57,37" fill={vectorColor} />
        </G>
      );

    case 'face_pull':
      return (
        <G>
          {/* High-Chest Cable Column */}
          <Line x1="94" y1="12" x2="94" y2="92" stroke={equipColor} strokeWidth="3.5" />
          <Line x1="94" y1="30" x2="54" y2="30" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Standing Lifter */}
          <Circle cx="36" cy="26" r="5.5" fill={boneColor} />
          <Line x1="36" y1="33" x2="36" y2="64" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="36" y1="64" x2="30" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="36" y1="64" x2="42" y2="91" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          {/* High Elbows Pulling Rope to Forehead */}
          <Line x1="36" y1="36" x2="24" y2="30" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="24" y1="30" x2="46" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="24" cy="30" r="3" fill={jointColor} />
          {/* Horizontal Face Pull Vector */}
          <Line x1="78" y1="22" x2="54" y2="22" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="48,22 56,18 56,26" fill={vectorColor} />
        </G>
      );

    case 'squat':
      return (
        <G>
          {/* Squatting Figure at Parallel with Barbell on Traps */}
          <Circle cx="66" cy="24" r="5.5" fill={boneColor} />
          <Circle cx="60" cy="31" r="5" fill={jointColor} />
          <Line x1="60" y1="31" x2="42" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="42" cy="58" r="3.5" fill={jointColor} />
          <Line x1="42" y1="58" x2="70" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="70" cy="60" r="3" fill={jointColor} />
          <Line x1="70" y1="60" x2="58" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Upward Drive Vector */}
          <Line x1="26" y1="64" x2="26" y2="26" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="26,18 22,27 30,27" fill={vectorColor} />
        </G>
      );

    case 'goblet_squat':
      return (
        <G>
          {/* Upright Squat Holding Dumbbell at Chest/Sternum */}
          <Circle cx="62" cy="22" r="5.5" fill={boneColor} />
          <Line x1="58" y1="29" x2="44" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="44" cy="58" r="3.5" fill={jointColor} />
          <Line x1="44" y1="58" x2="72" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="72" y1="58" x2="62" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Tucked Elbows Holding Goblet Dumbbell in Front of Chest */}
          <Line x1="58" y1="32" x2="66" y2="44" stroke={boneColor} strokeWidth="3" strokeLinecap="round" />
          <Line x1="66" y1="44" x2="74" y2="34" stroke={boneColor} strokeWidth="3" strokeLinecap="round" />
          <Rect x="72" y="28" width="7" height="12" rx="2" fill={jointColor} />
          {/* Upward Drive Vector */}
          <Line x1="26" y1="64" x2="26" y2="26" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="26,18 22,27 30,27" fill={vectorColor} />
        </G>
      );

    case 'air_squat':
      return (
        <G>
          {/* Bodyweight Squat with Arms Reaching Forward as Counterbalance */}
          <Circle cx="62" cy="24" r="5.5" fill={boneColor} />
          <Line x1="58" y1="31" x2="42" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="42" cy="58" r="3.5" fill={jointColor} />
          <Line x1="42" y1="58" x2="70" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="70" y1="60" x2="60" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arms Extended Forward */}
          <Line x1="58" y1="33" x2="90" y2="33" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Upward Vector */}
          <Line x1="26" y1="64" x2="26" y2="26" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="26,18 22,27 30,27" fill={vectorColor} />
        </G>
      );

    case 'wall_sit':
      return (
        <G>
          {/* Vertical Wall on Left */}
          <Line x1="28" y1="14" x2="28" y2="92" stroke={equipColor} strokeWidth="4.5" />
          {/* Lifter Back Flat Against Wall, 90 deg Hips & 90 deg Knees */}
          <Circle cx="36" cy="28" r="5.5" fill={boneColor} />
          <Line x1="35" y1="35" x2="35" y2="62" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="35" cy="62" r="3.5" fill={jointColor} />
          {/* Horizontal Thigh */}
          <Line x1="35" y1="62" x2="66" y2="62" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="66" cy="62" r="3.5" fill={jointColor} />
          {/* Vertical Shin */}
          <Line x1="66" y1="62" x2="66" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Isometric 90° Right-Angle Indicator & Hold Arrows */}
          <Path d="M58 62 L58 70 L66 70" stroke={vectorColor} strokeWidth="1.5" fill="none" />
          <Line x1="50" y1="52" x2="38" y2="52" stroke={vectorColor} strokeWidth="2" strokeDasharray="2,2" />
          <Polygon points="35,52 41,49 41,55" fill={vectorColor} />
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

    case 'leg_extension':
      return (
        <G>
          {/* Seated Leg Extension Machine Chair */}
          <Line x1="28" y1="28" x2="28" y2="62" stroke={equipColor} strokeWidth="4" />
          <Line x1="28" y1="62" x2="58" y2="62" stroke={equipColor} strokeWidth="4" />
          <Line x1="42" y1="62" x2="42" y2="92" stroke={equipColor} strokeWidth="3.5" />
          {/* Seated Lifter */}
          <Circle cx="36" cy="24" r="5.5" fill={boneColor} />
          <Line x1="35" y1="31" x2="35" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Thigh on Seat + Knee Pivot */}
          <Line x1="35" y1="58" x2="60" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="60" cy="58" r="3.5" fill={jointColor} />
          {/* Lower Leg Extending Forward & Upward with Ankle Roller Pad */}
          <Line x1="60" y1="58" x2="86" y2="46" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="84" cy="47" r="4" fill={jointColor} />
          {/* Upward Extension Arc Vector */}
          <Path d="M68 82 Q88 74 90 52" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="90,46 86,54 94,54" fill={vectorColor} />
        </G>
      );

    case 'leg_curl':
      return (
        <G>
          {/* Seated Leg Curl Machine */}
          <Line x1="28" y1="28" x2="28" y2="62" stroke={equipColor} strokeWidth="4" />
          <Line x1="28" y1="62" x2="58" y2="62" stroke={equipColor} strokeWidth="4" />
          <Line x1="42" y1="62" x2="42" y2="92" stroke={equipColor} strokeWidth="3.5" />
          {/* Seated Lifter */}
          <Circle cx="36" cy="24" r="5.5" fill={boneColor} />
          <Line x1="35" y1="31" x2="35" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="35" y1="58" x2="62" y2="58" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="62" cy="58" r="3.5" fill={jointColor} />
          {/* Lower Leg Curling Backward & Down Under Seat */}
          <Line x1="62" y1="58" x2="54" y2="84" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="54" cy="82" r="4" fill={jointColor} />
          {/* Downward/Backward Hamstring Curl Arc */}
          <Path d="M88 58 Q82 78 62 84" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="56,85 64,81 64,89" fill={vectorColor} />
        </G>
      );

    case 'hinge':
      return (
        <G>
          {/* Hip Hinge (RDL) Figure */}
          <Circle cx="78" cy="32" r="5.5" fill={boneColor} />
          <Line x1="72" y1="36" x2="36" y2="50" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="36" cy="50" r="3.5" fill={jointColor} />
          <Line x1="36" y1="50" x2="52" y2="70" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="52" y1="70" x2="50" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="66" y1="39" x2="64" y2="68" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="64" cy="70" r="5.5" fill={jointColor} />
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
          <Line x1="56" y1="58" x2="78" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="78" y1="60" x2="78" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="78" cy="60" r="3" fill={jointColor} />
          <Line x1="56" y1="58" x2="48" y2="82" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Line x1="48" y1="82" x2="26" y2="86" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="48" cy="82" r="3" fill={jointColor} />
          <Line x1="94" y1="60" x2="94" y2="26" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="94,20 90,28 98,28" fill={vectorColor} />
        </G>
      );

    case 'bulgarian_split_squat':
      return (
        <G>
          {/* Rear Bench Elevating Back Foot */}
          <Rect x="14" y="66" width="18" height="25" rx="3" fill={equipColor} />
          {/* Lifter in Split Squat */}
          <Circle cx="60" cy="22" r="5.5" fill={boneColor} />
          <Line x1="60" y1="29" x2="56" y2="58" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Front Working Leg */}
          <Line x1="56" y1="58" x2="78" y2="60" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="78" y1="60" x2="78" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="78" cy="60" r="3" fill={jointColor} />
          {/* Rear Foot Resting on Bench */}
          <Line x1="56" y1="58" x2="46" y2="78" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Line x1="46" y1="78" x2="24" y2="66" stroke={secondaryLimb} strokeWidth="4" strokeLinecap="round" />
          <Circle cx="46" cy="78" r="3" fill={jointColor} />
          {/* Vertical Drive Vector */}
          <Line x1="94" y1="60" x2="94" y2="26" stroke={vectorColor} strokeWidth="2" strokeDasharray="3,2" />
          <Polygon points="94,20 90,28 98,28" fill={vectorColor} />
        </G>
      );

    case 'calf_raise':
      return (
        <G>
          {/* Calf Block / Step */}
          <Rect x="34" y="84" width="32" height="8" rx="2" fill={equipColor} />
          {/* Standing Tall Figure on Balls of Feet */}
          <Circle cx="54" cy="14" r="5.5" fill={boneColor} />
          <Line x1="54" y1="21" x2="54" y2="50" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          {/* Straight Legs */}
          <Line x1="54" y1="50" x2="54" y2="76" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Plantarflexed Foot (Heel Raised High Above Step) */}
          <Circle cx="54" cy="76" r="3" fill={jointColor} />
          <Line x1="54" y1="76" x2="44" y2="84" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Upward Heel Raise Vector */}
          <Line x1="74" y1="84" x2="74" y2="60" stroke={vectorColor} strokeWidth="2.2" strokeDasharray="3,2" />
          <Polygon points="74,54 70,62 78,62" fill={vectorColor} />
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

    case 'incline_curl':
      return (
        <G>
          {/* 45-60 deg Incline Bench */}
          <Line x1="26" y1="34" x2="56" y2="70" stroke={equipColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="56" y1="70" x2="74" y2="68" stroke={equipColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="36" y1="48" x2="36" y2="92" stroke={equipColor} strokeWidth="3" />
          <Line x1="64" y1="70" x2="64" y2="92" stroke={equipColor} strokeWidth="3" />
          {/* Seated Lifter Leaning Back Against Incline Pad */}
          <Circle cx="34" cy="26" r="5.5" fill={boneColor} />
          <Line x1="38" y1="33" x2="58" y2="64" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="58" y1="64" x2="78" y2="66" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="78" y1="66" x2="82" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Upper Arm Hanging Straight Down Behind Torso + Forearm Curling Dumbbell */}
          <Line x1="40" y1="36" x2="40" y2="58" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="40" cy="58" r="3" fill={jointColor} />
          <Line x1="40" y1="58" x2="60" y2="44" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Rect x="58" y="38" width="10" height="5" rx="1.5" fill={jointColor} />
          {/* Curling Arc Vector */}
          <Path d="M46 72 Q68 64 66 44" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="66,38 62,46 70,46" fill={vectorColor} />
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

    case 'overhead_tricep_ext':
      return (
        <G>
          {/* Standing Figure */}
          <Circle cx="56" cy="30" r="5.5" fill={boneColor} />
          <Line x1="56" y1="37" x2="56" y2="66" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="56" y1="66" x2="52" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          {/* Upper Arm Vertical Beside Ear, Forearm Extending Overhead */}
          <Line x1="56" y1="38" x2="58" y2="18" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="58" cy="18" r="3" fill={jointColor} />
          <Line x1="58" y1="18" x2="42" y2="28" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Rect x="36" y="25" width="8" height="6" rx="1.5" fill={jointColor} />
          {/* Overhead Extension Arc Vector */}
          <Path d="M36 20 Q44 6 62 8" stroke={vectorColor} strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <Polygon points="67,9 59,5 60,13" fill={vectorColor} />
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

    case 'plank':
      return (
        <G>
          {/* Prone Forearm Plank Facing Floor */}
          <Circle cx="88" cy="64" r="5" fill={boneColor} />
          <Line x1="82" y1="66" x2="22" y2="82" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Forearm on Floor */}
          <Line x1="76" y1="68" x2="76" y2="90" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="76" y1="90" x2="90" y2="90" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Circle cx="76" cy="68" r="3" fill={jointColor} />
          {/* Anterior Core Tension Arrows */}
          <Line x1="54" y1="84" x2="54" y2="74" stroke={vectorColor} strokeWidth="2" strokeDasharray="2,2" />
          <Polygon points="54,70 50,76 58,76" fill={vectorColor} />
        </G>
      );

    case 'core_floor':
      return (
        <G>
          {/* Supine Dead Bug Core Bracing */}
          <Circle cx="26" cy="76" r="5.5" fill={boneColor} />
          <Line x1="33" y1="80" x2="68" y2="80" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
          <Circle cx="50" cy="80" r="3.5" fill={jointColor} />
          <Line x1="38" y1="80" x2="34" y2="52" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="68" y1="80" x2="68" y2="56" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="56" x2="86" y2="56" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="68" y1="80" x2="96" y2="74" stroke={secondaryLimb} strokeWidth="3.5" strokeLinecap="round" />
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
          <Line x1="16" y1="34" x2="46" y2="42" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
          <Line x1="104" y1="34" x2="74" y2="42" stroke={equipColor} strokeWidth="1.5" strokeDasharray="2,2" />
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
 */
/**
 * Generates raw inline SVG markup for embedding in the PDF export (`generateWorkoutPdf.js`).
 * 1-to-1 exact visual match with the app's ExerciseIllustrationSvg posture diagrams.
 */
const EXERCISE_PDF_SVG_PATHS = {
  bench_press: `
      <rect x="22" y="68" width="58" height="5" rx="2" fill="#96839B" />
      <line x1="30" y1="73" x2="30" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="72" y1="73" x2="72" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="28" cy="60" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="63" x2="72" y2="63" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="72" y1="63" x2="88" y2="70" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="88" y1="70" x2="88" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="44" y1="63" x2="44" y2="36" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="44" cy="63" r="3" fill="#C84663" />
      <line x1="32" y1="34" x2="56" y2="34" stroke="#C84663" stroke-width="3" />
      <rect x="40" y="27" width="8" height="14" rx="2" fill="#C84663" />
      <line x1="64" y1="54" x2="64" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="64,18 60,26 68,26" fill="#C84663" />
  `,
  floor_press: `
      <rect x="16" y="88" width="88" height="4" rx="2" fill="#96839B" />
      <circle cx="26" cy="81" r="5.5" fill="#FAF4F0" />
      <line x1="33" y1="84" x2="68" y2="84" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="68" y1="84" x2="80" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="80" y1="66" x2="92" y2="88" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="42" y1="84" x2="42" y2="56" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="84" r="3" fill="#C84663" />
      <rect x="35" y="51" width="14" height="6" rx="2" fill="#C84663" />
      <line x1="58" y1="72" x2="58" y2="34" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="58,28 54,36 62,36" fill="#C84663" />
  `,
  incline_press: `
      <line x1="28" y1="45" x2="62" y2="74" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="62" y1="74" x2="78" y2="70" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="40" y1="58" x2="40" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="68" y1="74" x2="68" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="36" cy="40" r="5.5" fill="#FAF4F0" />
      <line x1="40" y1="46" x2="62" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="62" y1="68" x2="82" y2="68" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="82" y1="68" x2="86" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="52" x2="48" y2="25" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="46" cy="52" r="3" fill="#C84663" />
      <rect x="42" y="20" width="12" height="6" rx="2" fill="#C84663" />
      <line x1="64" y1="48" x2="64" y2="20" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="64,14 60,22 68,22" fill="#C84663" />
  `,
  machine_chest_press: `
      <line x1="28" y1="22" x2="28" y2="92" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="68" x2="50" y2="68" stroke="#96839B" stroke-width="4" />
      <circle cx="38" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="36" x2="36" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="64" x2="56" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="66" x2="58" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="42" x2="68" y2="42" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="36" cy="42" r="3" fill="#C84663" />
      <line x1="62" y1="16" x2="70" y2="48" stroke="#C84663" stroke-width="3" />
      <line x1="74" y1="42" x2="98" y2="42" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="104,42 96,38 96,46" fill="#C84663" />
  `,
  pushup: `
      <circle cx="88" cy="46" r="5.5" fill="#FAF4F0" />
      <line x1="82" y1="50" x2="24" y2="86" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="54" x2="70" y2="72" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="70" y1="72" x2="76" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="76" cy="54" r="3" fill="#C84663" />
      <circle cx="70" cy="72" r="2.5" fill="#C84663" />
      <line x1="58" y1="44" x2="58" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="58,18 54,26 62,26" fill="#C84663" />
  `,
  decline_pushup: `
      <rect x="14" y="64" width="22" height="28" rx="3" fill="#96839B" />
      <circle cx="90" cy="60" r="5.5" fill="#FAF4F0" />
      <line x1="84" y1="62" x2="28" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="62" x2="74" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="74" y1="76" x2="80" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="78" cy="62" r="3" fill="#C84663" />
      <line x1="88" y1="46" x2="88" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="88,18 84,26 92,26" fill="#C84663" />
  `,
  pike_pushup: `
      <line x1="28" y1="91" x2="54" y2="34" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="54" cy="34" r="4" fill="#C84663" />
      <line x1="54" y1="34" x2="78" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="82" cy="72" r="5" fill="#FAF4F0" />
      <line x1="74" y1="62" x2="84" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="94" y1="66" x2="80" y2="38" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="77,32 77,41 85,37" fill="#C84663" />
  `,
  dip: `
      <line x1="34" y1="54" x2="86" y2="54" stroke="#96839B" stroke-width="3.5" />
      <line x1="40" y1="54" x2="40" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="80" y1="54" x2="80" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="64" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="62" y1="29" x2="54" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="54" y1="58" x2="52" y2="78" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="78" x2="40" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="60" y1="34" x2="48" y2="42" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="48" y1="42" x2="58" y2="54" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="48" cy="42" r="3" fill="#C84663" />
      <line x1="82" y1="44" x2="82" y2="20" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="82,14 78,22 86,22" fill="#C84663" />
  `,
  overhead_press: `
      <circle cx="56" cy="36" r="5.5" fill="#FAF4F0" />
      <line x1="56" y1="43" x2="56" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="56" y1="68" x2="48" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="68" x2="64" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="45" x2="40" y2="34" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="40" y1="34" x2="42" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="45" x2="72" y2="34" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="72" y1="34" x2="70" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="40" cy="34" r="2.8" fill="#C84663" />
      <circle cx="72" cy="34" r="2.8" fill="#C84663" />
      <line x1="26" y1="18" x2="86" y2="18" stroke="#C84663" stroke-width="3" />
      <rect x="30" y="13" width="5" height="10" rx="1.5" fill="#C84663" />
      <rect x="77" y="13" width="5" height="10" rx="1.5" fill="#C84663" />
      <polygon points="56,6 52,13 60,13" fill="#C84663" />
  `,
  lateral_raise: `
      <circle cx="60" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="33" x2="60" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="62" x2="52" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="60" y1="62" x2="68" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="36" x2="26" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="62" y1="36" x2="94" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="56" cy="36" r="3" fill="#C84663" />
      <circle cx="64" cy="36" r="3" fill="#C84663" />
      <rect x="20" y="34" width="6" height="8" rx="1.5" fill="#C84663" />
      <rect x="94" y="34" width="6" height="8" rx="1.5" fill="#C84663" />
      <path d="M36 58 Q24 50 24 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <path d="M84 58 Q96 50 96 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
  `,
  lat_pulldown: `
      <line x1="60" y1="4" x2="60" y2="20" stroke="#96839B" stroke-width="2" />
      <line x1="30" y1="20" x2="90" y2="20" stroke="#C84663" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="60" cy="40" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="47" x2="60" y2="72" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="72" x2="76" y2="72" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="76" y1="72" x2="76" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="48" x2="38" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="38" y1="38" x2="36" y2="20" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="64" y1="48" x2="82" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="82" y1="38" x2="84" y2="20" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="28" y1="28" x2="28" y2="48" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="28,53 24,45 32,45" fill="#C84663" />
      <line x1="92" y1="28" x2="92" y2="48" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="92,53 88,45 96,45" fill="#C84663" />
  `,
  pullup: `
      <line x1="26" y1="14" x2="94" y2="14" stroke="#96839B" stroke-width="4" stroke-linecap="round" />
      <circle cx="60" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="31" x2="60" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="60" x2="58" y2="82" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="82" x2="50" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="34" x2="40" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="40" y1="28" x2="44" y2="14" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="64" y1="34" x2="80" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="80" y1="28" x2="76" y2="14" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="28" y1="54" x2="28" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="28,20 24,28 32,28" fill="#C84663" />
  `,
  straight_arm_pulldown: `
      <line x1="90" y1="10" x2="90" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="90" y1="14" x2="62" y2="48" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="44" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="42" y1="33" x2="32" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="32" y1="58" x2="36" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="42" y1="35" x2="62" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="35" r="3" fill="#C84663" />
      <path d="M72 30 Q68 50 50 62" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="45,65 54,64 50,57" fill="#C84663" />
  `,
  db_pullover: `
      <rect x="26" y="66" width="54" height="5" rx="2" fill="#96839B" />
      <line x1="34" y1="71" x2="34" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="72" y1="71" x2="72" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="30" cy="58" r="5.5" fill="#FAF4F0" />
      <line x1="37" y1="61" x2="74" y2="61" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="74" y1="61" x2="88" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="38" y1="59" x2="18" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="12" y="32" width="10" height="6" rx="2" fill="#C84663" />
      <path d="M18 28 Q34 14 50 32" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="54,36 51,28 45,33" fill="#C84663" />
  `,
  row: `
      <circle cx="76" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="70" y1="35" x2="40" y2="54" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="40" y1="54" x2="48" y2="72" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="48" y1="72" x2="44" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="64" y1="39" x2="52" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="52" y1="28" x2="62" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="52" cy="28" r="3" fill="#C84663" />
      <circle cx="62" cy="50" r="5.5" fill="#C84663" />
      <line x1="74" y1="70" x2="64" y2="56" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="61,51 62,60 69,55" fill="#C84663" />
  `,
  one_arm_db_row: `
      <rect x="52" y="64" width="44" height="5" rx="2" fill="#96839B" />
      <line x1="58" y1="69" x2="58" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="90" y1="69" x2="90" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="86" cy="36" r="5" fill="#FAF4F0" />
      <line x1="78" y1="40" x2="38" y2="42" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="40" x2="82" y2="64" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3" stroke-linecap="round" />
      <line x1="42" y1="42" x2="60" y2="64" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="38" y1="42" x2="26" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="70" y1="40" x2="56" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="28" x2="58" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="56" cy="28" r="3" fill="#C84663" />
      <rect x="52" y="48" width="12" height="5" rx="1.5" fill="#C84663" />
      <path d="M68 62 Q58 58 56 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="56,38 52,46 60,46" fill="#C84663" />
  `,
  seated_cable_row: `
      <rect x="20" y="70" width="60" height="4" rx="2" fill="#96839B" />
      <line x1="78" y1="54" x2="78" y2="74" stroke="#96839B" stroke-width="4" />
      <line x1="98" y1="20" x2="98" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="98" y1="50" x2="52" y2="50" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="36" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="37" x2="36" y2="68" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="36" y1="68" x2="56" y2="60" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="60" x2="76" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="44" x2="26" y2="52" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="26" y1="52" x2="48" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="26" cy="52" r="3" fill="#C84663" />
      <line x1="74" y1="42" x2="50" y2="42" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="44,42 52,38 52,46" fill="#C84663" />
  `,
  chest_supported_row: `
      <line x1="32" y1="78" x2="76" y2="38" stroke="#96839B" stroke-width="5" stroke-linecap="round" />
      <line x1="42" y1="70" x2="42" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="70" y1="44" x2="70" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="80" cy="28" r="5" fill="#FAF4F0" />
      <line x1="72" y1="34" x2="38" y2="66" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="38" y1="66" x2="24" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="66" y1="40" x2="54" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="54" y1="30" x2="62" y2="54" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="30" r="3" fill="#C84663" />
      <rect x="56" y="54" width="12" height="5" rx="1.5" fill="#C84663" />
      <line x1="84" y1="68" x2="84" y2="44" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="84,38 80,46 88,46" fill="#C84663" />
  `,
  inverted_row: `
      <line x1="42" y1="24" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="42" cy="38" r="4" fill="#C84663" />
      <circle cx="30" cy="48" r="5" fill="#FAF4F0" />
      <line x1="36" y1="52" x2="88" y2="88" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="42" y1="55" x2="42" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="55" r="3" fill="#C84663" />
      <line x1="62" y1="58" x2="52" y2="38" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="49,32 49,41 57,37" fill="#C84663" />
  `,
  face_pull: `
      <line x1="94" y1="12" x2="94" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="94" y1="30" x2="54" y2="30" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="36" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="33" x2="36" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="64" x2="30" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="64" x2="42" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="36" x2="24" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="24" y1="30" x2="46" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="24" cy="30" r="3" fill="#C84663" />
      <line x1="78" y1="22" x2="54" y2="22" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="48,22 56,18 56,26" fill="#C84663" />
  `,
  squat: `
      <circle cx="66" cy="24" r="5.5" fill="#FAF4F0" />
      <circle cx="60" cy="31" r="5" fill="#C84663" />
      <line x1="60" y1="31" x2="42" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="42" cy="58" r="3.5" fill="#C84663" />
      <line x1="42" y1="58" x2="70" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="70" cy="60" r="3" fill="#C84663" />
      <line x1="70" y1="60" x2="58" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  goblet_squat: `
      <circle cx="62" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="29" x2="44" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="44" cy="58" r="3.5" fill="#C84663" />
      <line x1="44" y1="58" x2="72" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="72" y1="58" x2="62" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="32" x2="66" y2="44" stroke="#FAF4F0" stroke-width="3" stroke-linecap="round" />
      <line x1="66" y1="44" x2="74" y2="34" stroke="#FAF4F0" stroke-width="3" stroke-linecap="round" />
      <rect x="72" y="28" width="7" height="12" rx="2" fill="#C84663" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  air_squat: `
      <circle cx="62" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="31" x2="42" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="42" cy="58" r="3.5" fill="#C84663" />
      <line x1="42" y1="58" x2="70" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="70" y1="60" x2="60" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="33" x2="90" y2="33" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  wall_sit: `
      <line x1="28" y1="14" x2="28" y2="92" stroke="#96839B" stroke-width="4.5" />
      <circle cx="36" cy="28" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="35" x2="35" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="35" cy="62" r="3.5" fill="#C84663" />
      <line x1="35" y1="62" x2="66" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="66" cy="62" r="3.5" fill="#C84663" />
      <line x1="66" y1="62" x2="66" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <path d="M58 62 L58 70 L66 70" stroke="#C84663" stroke-width="1.5" fill="none" />
      <line x1="50" y1="52" x2="38" y2="52" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="35,52 41,49 41,55" fill="#C84663" />
  `,
  leg_press: `
      <line x1="24" y1="86" x2="54" y2="86" stroke="#96839B" stroke-width="4" />
      <line x1="24" y1="86" x2="18" y2="64" stroke="#96839B" stroke-width="4" />
      <circle cx="24" cy="56" r="5" fill="#FAF4F0" />
      <line x1="26" y1="63" x2="36" y2="82" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="82" x2="50" y2="60" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="60" x2="72" y2="44" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="50" cy="60" r="3" fill="#C84663" />
      <line x1="66" y1="34" x2="80" y2="54" stroke="#C84663" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="40" x2="94" y2="24" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="98,20 89,23 95,29" fill="#C84663" />
  `,
  leg_extension: `
      <line x1="28" y1="28" x2="28" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="62" x2="58" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="42" y1="62" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="36" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="31" x2="35" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="35" y1="58" x2="60" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="60" cy="58" r="3.5" fill="#C84663" />
      <line x1="60" y1="58" x2="86" y2="46" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="84" cy="47" r="4" fill="#C84663" />
      <path d="M68 82 Q88 74 90 52" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="90,46 86,54 94,54" fill="#C84663" />
  `,
  leg_curl: `
      <line x1="28" y1="28" x2="28" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="62" x2="58" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="42" y1="62" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="36" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="31" x2="35" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="35" y1="58" x2="62" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="62" cy="58" r="3.5" fill="#C84663" />
      <line x1="62" y1="58" x2="54" y2="84" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="54" cy="82" r="4" fill="#C84663" />
      <path d="M88 58 Q82 78 62 84" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="56,85 64,81 64,89" fill="#C84663" />
  `,
  hinge: `
      <circle cx="78" cy="32" r="5.5" fill="#FAF4F0" />
      <line x1="72" y1="36" x2="36" y2="50" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="36" cy="50" r="3.5" fill="#C84663" />
      <line x1="36" y1="50" x2="52" y2="70" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="52" y1="70" x2="50" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="66" y1="39" x2="64" y2="68" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="64" cy="70" r="5.5" fill="#C84663" />
      <line x1="32" y1="50" x2="16" y2="50" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="12,50 19,46 19,54" fill="#C84663" />
  `,
  glute_bridge: `
      <rect x="18" y="64" width="20" height="27" rx="3" fill="#96839B" />
      <circle cx="24" cy="56" r="5" fill="#FAF4F0" />
      <line x1="30" y1="60" x2="68" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="68" cy="58" r="4" fill="#C84663" />
      <line x1="68" y1="58" x2="84" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="84" y1="62" x2="84" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="64" y1="50" x2="64" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="64,20 60,28 68,28" fill="#C84663" />
  `,
  lunge: `
      <circle cx="58" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="29" x2="56" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="58" x2="78" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="60" x2="78" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="78" cy="60" r="3" fill="#C84663" />
      <line x1="56" y1="58" x2="48" y2="82" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="48" y1="82" x2="26" y2="86" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <circle cx="48" cy="82" r="3" fill="#C84663" />
      <line x1="94" y1="60" x2="94" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="94,20 90,28 98,28" fill="#C84663" />
  `,
  bulgarian_split_squat: `
      <rect x="14" y="66" width="18" height="25" rx="3" fill="#96839B" />
      <circle cx="60" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="29" x2="56" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="58" x2="78" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="60" x2="78" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="78" cy="60" r="3" fill="#C84663" />
      <line x1="56" y1="58" x2="46" y2="78" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="78" x2="24" y2="66" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <circle cx="46" cy="78" r="3" fill="#C84663" />
      <line x1="94" y1="60" x2="94" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="94,20 90,28 98,28" fill="#C84663" />
  `,
  calf_raise: `
      <rect x="34" y="84" width="32" height="8" rx="2" fill="#96839B" />
      <circle cx="54" cy="14" r="5.5" fill="#FAF4F0" />
      <line x1="54" y1="21" x2="54" y2="50" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="54" y1="50" x2="54" y2="76" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="54" cy="76" r="3" fill="#C84663" />
      <line x1="54" y1="76" x2="44" y2="84" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="74" y1="84" x2="74" y2="60" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="74,54 70,62 78,62" fill="#C84663" />
  `,
  bicep_curl: `
      <circle cx="52" cy="20" r="5.5" fill="#FAF4F0" />
      <line x1="52" y1="27" x2="52" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="52" y1="60" x2="48" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="60" x2="58" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="30" x2="54" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="50" r="3" fill="#C84663" />
      <line x1="54" y1="50" x2="72" y2="36" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="74" cy="34" r="4" fill="#C84663" />
      <path d="M72 58 Q84 46 78 30" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="76,26 75,34 82,31" fill="#C84663" />
  `,
  incline_curl: `
      <line x1="26" y1="34" x2="56" y2="70" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="56" y1="70" x2="74" y2="68" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="48" x2="36" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="64" y1="70" x2="64" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="34" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="38" y1="33" x2="58" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="58" y1="64" x2="78" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="78" y1="66" x2="82" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="40" y1="36" x2="40" y2="58" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="40" cy="58" r="3" fill="#C84663" />
      <line x1="40" y1="58" x2="60" y2="44" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="58" y="38" width="10" height="5" rx="1.5" fill="#C84663" />
      <path d="M46 72 Q68 64 66 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="66,38 62,46 70,46" fill="#C84663" />
  `,
  tricep_ext: `
      <line x1="88" y1="10" x2="88" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="88" y1="14" x2="66" y2="48" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="46" cy="20" r="5.5" fill="#FAF4F0" />
      <line x1="46" y1="27" x2="44" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="44" y1="60" x2="42" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="30" x2="48" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="48" cy="48" r="3" fill="#C84663" />
      <line x1="48" y1="48" x2="64" y2="64" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <path d="M68 44 Q74 56 66 68" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="64,72 64,64 71,68" fill="#C84663" />
  `,
  overhead_tricep_ext: `
      <circle cx="56" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="56" y1="37" x2="56" y2="66" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="66" x2="52" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="38" x2="58" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="58" cy="18" r="3" fill="#C84663" />
      <line x1="58" y1="18" x2="42" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="36" y="25" width="8" height="6" rx="1.5" fill="#C84663" />
      <path d="M36 20 Q44 6 62 8" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="67,9 59,5 60,13" fill="#C84663" />
  `,
  core_hang: `
      <line x1="36" y1="12" x2="84" y2="12" stroke="#96839B" stroke-width="4" stroke-linecap="round" />
      <line x1="54" y1="12" x2="54" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="24" r="5" fill="#FAF4F0" />
      <line x1="54" y1="30" x2="54" y2="56" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="54" cy="56" r="3.5" fill="#C84663" />
      <line x1="54" y1="56" x2="84" y2="52" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <path d="M64 82 Q88 74 88 56" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="88,50 84,58 92,58" fill="#C84663" />
  `,
  plank: `
      <circle cx="88" cy="64" r="5" fill="#FAF4F0" />
      <line x1="82" y1="66" x2="22" y2="82" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="68" x2="76" y2="90" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="76" y1="90" x2="90" y2="90" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="76" cy="68" r="3" fill="#C84663" />
      <line x1="54" y1="84" x2="54" y2="74" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="54,70 50,76 58,76" fill="#C84663" />
  `,
  core_floor: `
      <circle cx="26" cy="76" r="5.5" fill="#FAF4F0" />
      <line x1="33" y1="80" x2="68" y2="80" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="50" cy="80" r="3.5" fill="#C84663" />
      <line x1="38" y1="80" x2="34" y2="52" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="68" y1="80" x2="68" y2="56" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="68" y1="56" x2="86" y2="56" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="68" y1="80" x2="96" y2="74" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="50" y1="60" x2="50" y2="74" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="50,76 46,69 54,69" fill="#C84663" />
  `,
  cable_fly: `
      <circle cx="60" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="31" x2="60" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="62" x2="50" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="60" y1="62" x2="70" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="16" y1="34" x2="46" y2="42" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <line x1="104" y1="34" x2="74" y2="42" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <path d="M56 35 Q42 38 52 46" stroke="#FAF4F0" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M64 35 Q78 38 68 46" stroke="#FAF4F0" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <circle cx="54" cy="46" r="3" fill="#C84663" />
      <circle cx="66" cy="46" r="3" fill="#C84663" />
  `,
};

export function getExercisePdfSvgMarkup(svgType = 'squat', svgAccuracy = 'exact') {
  const inner = EXERCISE_PDF_SVG_PATHS[svgType] || EXERCISE_PDF_SVG_PATHS.squat;
  const approxBadge =
    svgAccuracy === 'pattern'
      ? `<div style="font-size:7.5px;color:#B86B35;font-weight:700;margin-top:2px;letter-spacing:0.2px;">≈ Pattern</div>`
      : '';

  return `<div style="text-align:center;">
    <svg width="60" height="52" viewBox="0 0 120 104" xmlns="http://www.w3.org/2000/svg" style="background:#24142B;border:1px solid #4A3428;border-radius:6px;display:block;margin:0 auto;">
      <line x1="12" y1="92" x2="108" y2="92" stroke="rgba(250, 244, 240, 0.16)" stroke-width="1.5" stroke-dasharray="3,3" />
      ${inner}
    </svg>
    ${approxBadge}
  </div>`;
}

const styles = StyleSheet.create({
  outerWrap: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  diagramBoxApproximation: {
    borderColor: 'rgba(224, 159, 103, 0.45)',
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
  diagramLabelTagApproximation: {
    backgroundColor: 'rgba(224, 159, 103, 0.18)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  diagramLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.7,
  },
  diagramLabelTextApproximation: {
    color: '#E09F67',
  },
  approxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 159, 103, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(224, 159, 103, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 6,
    gap: 6,
  },
  approxIcon: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E09F67',
  },
  approxText: {
    fontSize: 11,
    color: '#E09F67',
    fontWeight: '600',
    flex: 1,
  },
});
