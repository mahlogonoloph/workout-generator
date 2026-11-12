import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export const DURATION_OPTIONS = [
  { minutes: 30, label: '30m', desc: 'Express' },
  { minutes: 45, label: '45m', desc: 'Moderate' },
  { minutes: 60, label: '60m', desc: 'Optimal' },
  { minutes: 75, label: '75m', desc: 'Extended' },
];

export default function DurationSelectionSection({
  selectedDuration,
  onSelectDuration,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Target Duration</Text>
      <Text style={styles.sectionSubtitle}>Average time cap per workout session</Text>
      <View style={styles.durationRow}>
        {DURATION_OPTIONS.map((item) => {
          const isSelected = selectedDuration === item.minutes;
          return (
            <TouchableOpacity
              key={item.minutes}
              activeOpacity={0.75}
              onPress={() => onSelectDuration(item.minutes)}
              style={[
                styles.durationPill,
                isSelected ? styles.durationPillSelected : styles.durationPillUnselected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.label} (${item.desc}) session`}
            >
              <Text
                style={[
                  styles.durationPillTitle,
                  isSelected ? styles.durationPillTitleSelected : styles.durationPillTitleUnselected,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.durationPillSub,
                  isSelected ? styles.durationPillSubSelected : styles.durationPillSubUnselected,
                ]}
              >
                {item.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
