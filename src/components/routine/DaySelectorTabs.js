import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export default function DaySelectorTabs({
  schedule = [],
  activeDayIndex = 0,
  onSelectDay,
}) {
  if (!schedule || schedule.length <= 1) return null;

  return (
    <View style={styles.tabSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScroll}
      >
        {schedule.map((day, index) => {
          const isActive = index === activeDayIndex;
          const cleanLabel =
            day.dayLabel?.replace(/^Day \d+:\s*/, '') || `Session ${day.dayNumber}`;
          return (
            <TouchableOpacity
              key={day.dayNumber || index}
              activeOpacity={0.75}
              onPress={() => onSelectDay(index)}
              style={[
                styles.dayTab,
                isActive ? styles.dayTabActive : styles.dayTabInactive,
              ]}
            >
              <Text
                style={[
                  styles.dayTabNumber,
                  isActive ? styles.dayTabNumberActive : styles.dayTabNumberInactive,
                ]}
              >
                Day {day.dayNumber}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.dayTabLabel,
                  isActive ? styles.dayTabLabelActive : styles.dayTabLabelInactive,
                ]}
              >
                {cleanLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

