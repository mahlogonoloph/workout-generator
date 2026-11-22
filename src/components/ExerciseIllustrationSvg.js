import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import AnatomyMuscleMap from './illustration/AnatomyMuscleMap';
import renderMovementVector, { MOTION_TYPES } from './illustration/ExerciseMovementVectors';
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
 *    - Interactive PLAY/PAUSE button previews the rep using a constant-bone-length skeleton (no stretching limbs)
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
  // Only movements with a real skeleton motion model can be played (isometric holds / unknown types stay static)
  const canPlay = isKnownType && MOTION_TYPES.has(svgType);

  const [isPlaying, setIsPlaying] = useState(false);
  const [motionProgress, setMotionProgress] = useState(0);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animRef.current);
      }
      setMotionProgress(0);
      startTimeRef.current = null;
      return;
    }

    const DURATION = 2400; // 2.4 seconds per complete rep cycle
    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      // Smooth sinusoidal phase: 0 (start) -> 1 (peak displacement) -> 0 (finish)
      const phase = (1 - Math.cos(((elapsed % DURATION) / DURATION) * 2 * Math.PI)) / 2;
      setMotionProgress(phase);
      if (typeof requestAnimationFrame !== 'undefined') {
        animRef.current = requestAnimationFrame(step);
      }
    };

    if (typeof requestAnimationFrame !== 'undefined') {
      animRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (animRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animRef.current);
      }
      startTimeRef.current = null;
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
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
          {/* Header Tag */}
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

          {/* Interactive Play Motion Button */}
          {canPlay && (
          <TouchableOpacity
            style={[styles.playMotionBtn, isPlaying && styles.playMotionBtnActive]}
            activeOpacity={0.75}
            onPress={togglePlay}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause movement motion preview' : 'Play movement motion preview'}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={[styles.playMotionIcon, isPlaying && styles.playMotionIconActive]}>
              {isPlaying ? '❚❚' : '▶'}
            </Text>
            <Text style={[styles.playMotionText, isPlaying && styles.playMotionTextActive]}>
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </Text>
          </TouchableOpacity>
          )}

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
            {renderMovementVector(svgType, motionProgress)}
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
