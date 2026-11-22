import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export const INTENSITY_OPTIONS = [
  { id: 'too_easy', label: 'Too Easy', sub: '+1 Set / Less Rest' },
  { id: 'optimal', label: 'Just Right', sub: 'Balanced Volume' },
  { id: 'too_hard', label: 'Too Brutal', sub: '-1 Set / More Rest' },
];

export default function FeedbackCalibrationCard({
  likedCount = 0,
  dislikedCount = 0,
  intensityRating = 'optimal',
  onSelectIntensity,
}) {
  return (
    <View style={styles.feedbackCalibrationCard}>
      <View style={styles.feedbackHeaderRow}>
        <Text style={styles.feedbackTitle}>Adaptive Feedback Loop</Text>
        <Text style={styles.feedbackMemoryPill}>
          ♥ {likedCount} Liked • ✕ {dislikedCount} Avoided
        </Text>
      </View>
      <Text style={styles.feedbackSubtitle}>
        How does this session volume feel? Tunes sets, rest intervals & future selections:
      </Text>
      <View style={styles.intensityRow}>
        {INTENSITY_OPTIONS.map((opt) => {
          const isSelected = intensityRating === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.75}
              onPress={() => onSelectIntensity(opt.id)}
              style={[
                styles.intensityChip,
                isSelected ? styles.intensityChipActive : styles.intensityChipInactive,
              ]}
            >
              <Text
                style={[
                  styles.intensityChipLabel,
                  isSelected
                    ? styles.intensityChipLabelActive
                    : styles.intensityChipLabelInactive,
                ]}
              >
                {opt.label}
              </Text>
              <Text style={styles.intensityChipSub}>{opt.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

