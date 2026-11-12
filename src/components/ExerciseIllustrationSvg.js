import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import AnatomyMuscleMap from './illustration/AnatomyMuscleMap';
import renderMovementVector from './illustration/ExerciseMovementVectors';
import styles from './illustration/ExerciseIllustrationSvg.styles';

export { getExercisePdfSvgMarkup } from './illustration/exercisePdfSvg';

export const KNOWN_SVG_TYPES = new Set([
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
        <AnatomyMuscleMap
          primaryMuscles={primaryMuscles}
          secondaryMuscles={secondaryMuscles}
          compact={compact}
        />
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
