import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import styles from './ExerciseIllustrationSvg.styles';

/**
 * Anatomical Target Muscle Highlight Map (wger-inspired)
 * Highlights primary muscles in vibrant Fig Crimson (#C84663)
 * and secondary muscles in Bronze/Amber (#E09F67)
 */
export default function AnatomyMuscleMap({
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
  );
}

