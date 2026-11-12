import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export const DURATION_OPTIONS = [
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '60 min' },
  { minutes: 75, label: '75 min' },
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
            >
              <Text
                style={[
                  styles.durationPillText,
                  isSelected ? styles.durationPillTextSelected : styles.durationPillTextUnselected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

