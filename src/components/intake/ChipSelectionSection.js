import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import IntakeAnatomyMap from './IntakeAnatomyMap';

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
        Select muscle groups to receive +1 dedicated set priority in your movement splits
      </Text>

      <View style={styles.muscleTargetingCard}>
        {/* Left: Dynamic SVG Anatomical Map */}
        <View style={styles.muscleAnatomyBox}>
          <IntakeAnatomyMap selectedFocusAreas={selectedFocusAreas} />
          <Text style={styles.anatomyBadgeText}>
            {selectedFocusAreas.length > 0 ? `${selectedFocusAreas.length} Focused` : 'Anatomy'}
          </Text>
        </View>

        {/* Right: Muscle Selection Chips */}
        <View style={styles.muscleChipsRightCol}>
          <Text style={styles.muscleTargetingNote}>
            {selectedFocusAreas.length === 0
              ? 'Tap muscle groups below to highlight & boost volume:'
              : `Boosted: ${selectedFocusAreas.join(', ')}`}
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
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${muscle} focus`}
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
      </View>
    </View>
  );
}

export function JointExclusionSection({ selectedExclusions = [], onToggleExclusion }) {
  return (
    <View style={styles.section}>
      <View style={styles.jointHeaderRow}>
        <View style={styles.jointHeaderTitles}>
          <Text style={styles.sectionTitle}>Joint Sensitivity / Exclusions</Text>
          <Text style={styles.sectionSubtitle}>
            Shield sensitive joints from high shear or compressive loading
          </Text>
        </View>
        <View style={styles.jointShieldBadge}>
          <Text style={styles.jointShieldBadgeText}>
            {selectedExclusions.length > 0
              ? `🛡 ${selectedExclusions.length} Protected`
              : '🛡 Full Tolerance'}
          </Text>
        </View>
      </View>

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
              accessibilityRole="button"
              accessibilityLabel={`Exclude ${joint}`}
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
