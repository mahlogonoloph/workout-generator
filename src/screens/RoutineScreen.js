import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';

export default function RoutineScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const generatedRoutine = useWorkoutStore((state) => state.generatedRoutine);
  const logistics = useWorkoutStore((state) => state.logistics);
  const userProfile = useWorkoutStore((state) => state.userProfile);

  // Fallback data if store hasn't generated yet
  const routine = generatedRoutine || {
    id: 'demo-plan',
    programName: '8-Week Fig Hypertrophy Blueprint',
    warmupRoutine: {
      cardioPrimer: '5-7 minutes light dynamic cardio (treadmill walk or bike) to raise core body temp.',
      dynamicMobility: [
        'World’s Greatest Stretch with rotations (5 reps/side)',
        'Arm Circles & Shoulder Band Dislocates (15 reps)',
        'Bodyweight Deep Squats with Pause (10 reps)',
      ],
    },
    schedule: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1: Upper Body Power',
        exercises: [
          {
            id: 'ex-1-1',
            name: 'Incline Barbell Bench Press',
            sets: 4,
            reps: '6-8',
            restSeconds: 120,
            substitutions: ['Incline Dumbbell Press', 'Machine Chest Press'],
          },
          {
            id: 'ex-1-2',
            name: 'Chest-Supported T-Bar Row',
            sets: 4,
            reps: '8-10',
            restSeconds: 90,
            substitutions: ['Seated Cable Row', 'One-Arm Dumbbell Row'],
          },
          {
            id: 'ex-1-3',
            name: 'Standing Overhead Barbell Press',
            sets: 3,
            reps: '8-10',
            restSeconds: 90,
            substitutions: ['Seated Dumbbell Shoulder Press', 'Landmine Press'],
          },
        ],
      },
    ],
  };

  const schedule = routine.schedule || [];
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isWarmupExpanded, setIsWarmupExpanded] = useState(false);

  const activeDay = schedule[activeDayIndex] || schedule[0] || {
    dayNumber: 1,
    dayLabel: 'Day 1',
    exercises: [],
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{userProfile?.primaryGoal?.toUpperCase() || 'HYPERTROPHY'}</Text>
            </View>
            <View style={styles.badgeSubtle}>
              <Text style={styles.badgeSubtleText}>{logistics?.location || 'Commercial Gym'}</Text>
            </View>
          </View>

          <Text style={styles.programTitle}>{routine.programName}</Text>
          <Text style={styles.programMeta}>
            {schedule.length} Days / Week • {logistics?.durationMinutes || 60} min sessions • {userProfile?.cycleLengthWeeks || 8} Week Block
          </Text>
        </View>

        {/* Schedule Day Selector Tabs */}
        {schedule.length > 1 && (
          <View style={styles.tabSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysScroll}
            >
              {schedule.map((day, index) => {
                const isActive = index === activeDayIndex;
                const cleanLabel = day.dayLabel?.replace(/^Day \d+:\s*/, '') || `Session ${day.dayNumber}`;
                return (
                  <TouchableOpacity
                    key={day.dayNumber || index}
                    activeOpacity={0.75}
                    onPress={() => setActiveDayIndex(index)}
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
        )}

        {/* Active Day Header */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{activeDay.dayLabel}</Text>
          <Text style={styles.daySubtitle}>
            {activeDay.exercises?.length || 0} Prescribed Movements • Primary Focus
          </Text>
        </View>

        {/* Collapsible Warmup Card */}
        {routine.warmupRoutine && (
          <View style={styles.warmupCard}>
            <TouchableOpacity
              style={styles.warmupHeaderButton}
              activeOpacity={0.7}
              onPress={() => setIsWarmupExpanded((prev) => !prev)}
            >
              <View style={styles.warmupTitleRow}>
                <View style={styles.warmupDot} />
                <Text style={styles.warmupTitle}>Warmup & Movement Prep</Text>
              </View>
              <Text style={styles.warmupToggle}>{isWarmupExpanded ? 'Collapse ↑' : 'View ↓'}</Text>
            </TouchableOpacity>

            {isWarmupExpanded && (
              <View style={styles.warmupBody}>
                <Text style={styles.warmupPrimer}>{routine.warmupRoutine.cardioPrimer}</Text>
                <View style={styles.mobilityList}>
                  {(routine.warmupRoutine.dynamicMobility || []).map((item, mIdx) => (
                    <View key={mIdx} style={styles.mobilityRow}>
                      <View style={styles.bullet} />
                      <Text style={styles.mobilityText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Exercise Cards List */}
        <View style={styles.exerciseList}>
          {(activeDay.exercises || []).map((exercise, index) => (
            <View key={exercise.id || index} style={styles.exerciseCard}>
              <View style={styles.exerciseTopRow}>
                <View style={styles.exerciseIndexBadge}>
                  <Text style={styles.exerciseIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </View>

              {/* Prescription Metrics Bar */}
              <View style={styles.prescriptionRow}>
                <View style={styles.prescriptionItem}>
                  <Text style={styles.prescriptionLabel}>SETS</Text>
                  <Text style={styles.prescriptionValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.prescriptionDivider} />
                <View style={styles.prescriptionItem}>
                  <Text style={styles.prescriptionLabel}>REPS</Text>
                  <Text style={styles.prescriptionValue}>{exercise.reps}</Text>
                </View>
                <View style={styles.prescriptionDivider} />
                <View style={styles.prescriptionItem}>
                  <Text style={styles.prescriptionLabel}>REST</Text>
                  <Text style={styles.prescriptionValue}>{exercise.restSeconds}s</Text>
                </View>
              </View>

              {/* Substitution Fallbacks */}
              {exercise.substitutions && exercise.substitutions.length > 0 && (
                <View style={styles.subsContainer}>
                  <Text style={styles.subsHeader}>ALTERNATIVES / SUBSTITUTIONS</Text>
                  <View style={styles.subsRow}>
                    {exercise.substitutions.map((sub, sIdx) => (
                      <View key={sIdx} style={styles.subTag}>
                        <Text style={styles.subTagText}>{sub}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => alert(`Starting ${activeDay.dayLabel}!`)}
        >
          <Text style={styles.primaryButtonText}>Start Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Intake')}
        >
          <Text style={styles.secondaryButtonText}>Reconfigure Parameters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // #1F1124 Deep plum background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(200, 70, 99, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.3)',
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  badgeSubtle: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeSubtleText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  programTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary, // #FAF4F0 Off-white
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  programMeta: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  tabSection: {
    marginBottom: 18,
  },
  daysScroll: {
    gap: 8,
  },
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 96,
  },
  dayTabInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  dayTabActive: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  dayTabNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayTabNumberInactive: {
    color: Colors.textPrimary,
  },
  dayTabNumberActive: {
    color: Colors.textPrimary,
  },
  dayTabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  dayTabLabelInactive: {
    color: Colors.textMuted,
  },
  dayTabLabelActive: {
    color: 'rgba(250, 244, 240, 0.85)',
  },
  dayHeader: {
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  daySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  warmupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  warmupHeaderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warmupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warmupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  warmupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  warmupToggle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  warmupBody: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  warmupPrimer: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mobilityList: {
    gap: 6,
  },
  mobilityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: 6,
  },
  mobilityText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  exerciseIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  prescriptionRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  prescriptionItem: {
    alignItems: 'center',
  },
  prescriptionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  prescriptionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  prescriptionDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  subsContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subsHeader: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  subsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subTag: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
