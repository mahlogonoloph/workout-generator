import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import { WeeklyCalendarDots } from './IntakeGraphics';

export const FREQUENCY_OPTIONS = [
  { days: 2, label: '2 Days', sub: 'Full Body' },
  { days: 3, label: '3 Days', sub: 'Full Body' },
  { days: 4, label: '4 Days', sub: 'Upper / Lower' },
  { days: 5, label: '5 Days', sub: 'PPL + Upper' },
  { days: 6, label: '6 Days', sub: 'High Volume' },
];

export default function FrequencySelectionSection({
  selectedFrequency,
  onSelectFrequency,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.stepBadgeRow}>
        <View style={styles.stepPillBadge}>
          <Text style={styles.stepPillBadgeText}>STEP 3 OF 4</Text>
        </View>
        <Text style={styles.stepActionHint}>Tap one to choose</Text>
      </View>
      <Text style={styles.sectionTitle}>How Many Days Per Week?</Text>
      <Text style={styles.sectionSubtitle}>
        Pick the number of days you can realistically train each week
      </Text>
      <View style={styles.frequencyRow}>
        {FREQUENCY_OPTIONS.map((item) => {
          const isSelected = selectedFrequency === item.days;
          return (
            <TouchableOpacity
              key={item.days}
              activeOpacity={0.75}
              onPress={() => onSelectFrequency(item.days)}
              style={[
                styles.frequencyPill,
                isSelected ? styles.frequencyPillSelected : styles.frequencyPillUnselected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${item.days} days per week, ${item.sub}`}
            >
              <Text
                style={[
                  styles.frequencyPillTitle,
                  isSelected ? styles.frequencyPillTitleSelected : styles.frequencyPillTitleUnselected,
                ]}
              >
                {item.days}d
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.frequencyPillSub,
                  isSelected ? styles.frequencyPillSubSelected : styles.frequencyPillSubUnselected,
                ]}
              >
                {item.sub}
              </Text>
              <WeeklyCalendarDots days={item.days} isSelected={isSelected} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
