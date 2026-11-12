import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export const JOINT_SAFETY_OPTIONS = [
  'Shoulders',
  'Lower Back',
  'Knees',
  'Wrists',
  'Elbows',
];

export const FOCUS_MUSCLE_OPTIONS = [
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Glutes',
  'Arms',
  'Core',
];

export function FocusMuscleSection({ selectedFocusAreas = [], onToggleFocusArea }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Target Muscle Priority</Text>
      <Text style={styles.sectionSubtitle}>
        Prioritize specific muscle groups within the wger movement pattern taxonomy
      </Text>
      <View style={styles.jointChipsRow}>
        {FOCUS_MUSCLE_OPTIONS.map((muscle) => {
          const isFocused = selectedFocusAreas.includes(muscle);
          return (
            <TouchableOpacity
              key={muscle}
              activeOpacity={0.75}
              onPress={() => onToggleFocusArea(muscle)}
              style={[
                styles.jointChip,
                isFocused ? styles.focusChipSelected : styles.jointChipSafe,
              ]}
            >
              <Text
                style={[
                  styles.jointChipText,
                  isFocused ? styles.focusChipTextSelected : styles.jointChipTextSafe,
                ]}
              >
                {isFocused ? `★ ${muscle}` : `+ ${muscle}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function JointExclusionSection({ selectedExclusions = [], onToggleExclusion }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Joint Sensitivity / Exclusions</Text>
      <Text style={styles.sectionSubtitle}>
        Tap to exclude exercises placing high shear or compression stress on joints
      </Text>
      <View style={styles.jointChipsRow}>
        {JOINT_SAFETY_OPTIONS.map((joint) => {
          const isExcluded = selectedExclusions.includes(joint);
          return (
            <TouchableOpacity
              key={joint}
              activeOpacity={0.75}
              onPress={() => onToggleExclusion(joint)}
              style={[
                styles.jointChip,
                isExcluded ? styles.jointChipExcluded : styles.jointChipSafe,
              ]}
            >
              <Text
                style={[
                  styles.jointChipText,
                  isExcluded ? styles.jointChipTextExcluded : styles.jointChipTextSafe,
                ]}
              >
                {isExcluded ? `✕ Avoid ${joint}` : `+ ${joint}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

