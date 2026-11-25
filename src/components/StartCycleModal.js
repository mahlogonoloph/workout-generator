import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Radii } from '../theme/colors';

export default function StartCycleModal({
  visible,
  schedule = [],
  initialDayIndex = 0,
  onStart,
  onClose,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>CHOOSE YOUR STARTING DAY</Text>
          <Text style={styles.title}>Start Workout Cycle</Text>
          <Text style={styles.subtitle}>
            Pick which split day you want to start on today. Missing a day won’t
            skip your next workout—your cycle advances when you mark a day done.
          </Text>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {schedule.map((day, index) => {
              const isSelected = index === selectedDayIndex;
              const exerciseCount = (day.exercises || []).length;
              return (
                <TouchableOpacity
                  key={`start-day-${index}`}
                  style={[styles.dayRow, isSelected && styles.dayRowSelected]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <View style={styles.dayRowLeft}>
                    <View
                      style={[
                        styles.radioDot,
                        isSelected && styles.radioDotSelected,
                      ]}
                    />
                    <View style={styles.dayTextWrap}>
                      <Text
                        style={[
                          styles.dayTitle,
                          isSelected && styles.dayTitleSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {day.dayLabel || `Day ${index + 1}`}
                      </Text>
                      <Text style={styles.dayMeta}>
                        {exerciseCount} {exerciseCount === 1 ? 'movement' : 'movements'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.75}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.startBtn}
              activeOpacity={0.85}
              onPress={() => onStart(selectedDayIndex)}
            >
              <Text style={styles.startText}>Start Day {selectedDayIndex + 1}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 3, 22, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  list: {
    maxHeight: 260,
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
    marginBottom: 8,
  },
  dayRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySubtle,
  },
  dayRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.textMuted,
  },
  radioDotSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dayTextWrap: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dayTitleSelected: {
    color: Colors.primary,
  },
  dayMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.control,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  startBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: Radii.control,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryInk,
  },
});
