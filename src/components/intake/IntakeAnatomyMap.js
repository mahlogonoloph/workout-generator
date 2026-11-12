import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export const FOCUS_AREA_TO_ANATOMY = {
  Chest: ['pectorals'],
  Back: ['lats', 'upper_back'],
  Shoulders: ['deltoid'],
  Legs: ['quads', 'hamstrings', 'calves'],
  Glutes: ['glutes'],
  Arms: ['biceps', 'triceps', 'forearms'],
  Core: ['abs', 'obliques', 'lower_back'],
};

/**
 * High-taste SVG Anatomical Silhouette Graphic for the Intake Screen
 * Dynamically highlights prioritized muscle groups in Fig Crimson (#C84663)
 */
export default function IntakeAnatomyMap({ selectedFocusAreas = [] }) {
  const activeMuscles = new Set();
  selectedFocusAreas.forEach((area) => {
    (FOCUS_AREA_TO_ANATOMY[area] || []).forEach((m) => activeMuscles.add(m));
  });

  const getFill = (muscleKey) => {
    if (activeMuscles.has(muscleKey)) {
      return Colors.primary; // #C84663 Active Crimson
    }
    return 'rgba(250, 244, 240, 0.12)'; // Inactive subtle bone tone
  };

  const getDeltoidFill = () => {
    if (activeMuscles.has('deltoid')) return Colors.primary;
    return 'rgba(250, 244, 240, 0.12)';
  };

  const getArmFill = () => {
    if (activeMuscles.has('biceps') || activeMuscles.has('triceps')) return Colors.primary;
    return 'rgba(250, 244, 240, 0.12)';
  };

  const getCoreFill = () => {
    if (
      activeMuscles.has('abs') ||
      activeMuscles.has('obliques') ||
      activeMuscles.has('lower_back')
    ) {
      return Colors.primary;
    }
    return 'rgba(250, 244, 240, 0.12)';
  };

  const getLegFill = () => {
    if (activeMuscles.has('quads') || activeMuscles.has('hamstrings')) return Colors.primary;
    return 'rgba(250, 244, 240, 0.12)';
  };

  return (
    <View style={styles.container}>
      <Svg width={80} height={100} viewBox="0 0 96 104">
        {/* Head & Neck */}
        <Circle cx="48" cy="14" r="6" fill="rgba(250, 244, 240, 0.22)" />
        <Rect x="45.5" y="21" width="5" height="4" rx="1" fill="rgba(250, 244, 240, 0.2)" />

        {/* Upper Traps / Back */}
        <Path
          d="M34 25 Q48 21 62 25 L59 30 L37 30 Z"
          fill={getFill('upper_back')}
        />

        {/* Deltoids (Shoulders) */}
        <Circle cx="31" cy="31" r="5.5" fill={getDeltoidFill()} />
        <Circle cx="65" cy="31" r="5.5" fill={getDeltoidFill()} />

        {/* Pectorals (Chest) */}
        <Rect x="37" y="27" width="10" height="9" rx="2.5" fill={getFill('pectorals')} />
        <Rect x="49" y="27" width="10" height="9" rx="2.5" fill={getFill('pectorals')} />

        {/* Lats (Back Wings) */}
        <Path d="M35 36 L39 36 L40 50 L36 46 Z" fill={getFill('lats')} />
        <Path d="M61 36 L57 36 L56 50 L60 46 Z" fill={getFill('lats')} />

        {/* Arms (Biceps / Triceps) */}
        <Rect x="25" y="36" width="6" height="13" rx="3" fill={getArmFill()} />
        <Rect x="65" y="36" width="6" height="13" rx="3" fill={getArmFill()} />

        {/* Forearms */}
        <Rect x="23.5" y="50" width="5" height="12" rx="2.5" fill={getFill('forearms')} />
        <Rect x="67.5" y="50" width="5" height="12" rx="2.5" fill={getFill('forearms')} />

        {/* Core (Abs & Obliques) */}
        <Rect x="40.5" y="37" width="15" height="17" rx="2.5" fill={getCoreFill()} />

        {/* Glutes / Pelvis */}
        <Path d="M38 55 L58 55 L60 63 L36 63 Z" fill={getFill('glutes')} />

        {/* Quads & Hamstrings (Thighs) */}
        <Rect x="36.5" y="64" width="9.5" height="18" rx="4" fill={getLegFill()} />
        <Rect x="50" y="64" width="9.5" height="18" rx="4" fill={getLegFill()} />

        {/* Calves */}
        <Rect x="38" y="83" width="6.5" height="14" rx="3" fill={getFill('calves')} />
        <Rect x="51.5" y="83" width="6.5" height="14" rx="3" fill={getFill('calves')} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 102,
    backgroundColor: 'rgba(31, 17, 36, 0.65)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(250, 244, 240, 0.08)',
    paddingVertical: 2,
  },
});

