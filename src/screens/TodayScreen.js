import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Glass, Radii } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { validateExerciseDeepLink } from '../utils/widgetBridge';
import DaySelectorTabs from '../components/routine/DaySelectorTabs';
import WarmupCard from '../components/routine/WarmupCard';
import ExerciseCard from '../components/routine/ExerciseCard';
import { getSafeSubstitutions } from '../api/generationClient.js';

function isSameCalendarDay(isoA, dateB = new Date()) {
  if (!isoA) return false;
  const d = new Date(isoA);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === dateB.getFullYear() &&
    d.getMonth() === dateB.getMonth() &&
    d.getDate() === dateB.getDate()
  );
}

export default function TodayScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const generatedRoutine = useWorkoutStore((state) => state.generatedRoutine);
  const activeCycle = useWorkoutStore((state) => state.activeCycle);
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const logistics = useWorkoutStore((state) => state.logistics);
  const targeting = useWorkoutStore((state) => state.targeting);
  const feedback = useWorkoutStore((state) => state.feedback);

  const toggleLikeExercise = useWorkoutStore((state) => state.toggleLikeExercise);
  const completeCurrentWorkout = useWorkoutStore((state) => state.completeCurrentWorkout);
  const setCycleDay = useWorkoutStore((state) => state.setCycleDay);
  const startProgramCycle = useWorkoutStore((state) => state.startProgramCycle);

  const [justAdvancedMsg, setJustAdvancedMsg] = useState(null);
  const [animatingHeartKey, setAnimatingHeartKey] = useState(null);
  const heartPopAnim = useRef(new Animated.Value(1)).current;

  const schedule = generatedRoutine?.schedule || [];
  const totalDays = schedule.length;
  const currentDayIndex = Math.max(
    0,
    Math.min(activeCycle?.currentDayIndex || 0, Math.max(0, totalDays - 1))
  );
  const currentDay = schedule[currentDayIndex] || null;

  const deepLinkedExerciseId = useMemo(
    () => validateExerciseDeepLink(route?.params?.exerciseId, currentDay),
    [route?.params?.exerciseId, currentDay]
  );

  const cycleLengthWeeks = userProfile?.cycleLengthWeeks || 8;
  const currentWeek = activeCycle?.currentWeek || 1;
  const completedToday = isSameCalendarDay(activeCycle?.lastCompletedAt);
  const nextDayIndex = totalDays > 0 ? (currentDayIndex + 1) % totalDays : 0;

  const likedIds = feedback?.likedExerciseIds || [];

  const handleLikeToggle = (catalogKey) => {
    setAnimatingHeartKey(catalogKey);
    const useNative = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(heartPopAnim, {
        toValue: 1.35,
        duration: 100,
        useNativeDriver: useNative,
      }),
      Animated.spring(heartPopAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: useNative,
      }),
    ]).start(() => {
      setAnimatingHeartKey((prev) => (prev === catalogKey ? null : prev));
    });
    toggleLikeExercise(catalogKey);
  };

  const handleCompleteWorkout = () => {
    if (!activeCycle?.isActive) {
      startProgramCycle(currentDayIndex);
    }
    const completedDayNum = currentDayIndex + 1;
    completeCurrentWorkout();
    setJustAdvancedMsg(
      `Day ${completedDayNum} complete! Up next: Day ${nextDayIndex + 1}.`
    );
  };

  if (!generatedRoutine || totalDays === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.emptyEyebrow}>TODAY’S WORKOUT</Text>
        <Text style={styles.emptyTitle}>No Active Program Yet</Text>
        <Text style={styles.emptySubtitle}>
          Generate your personalized routine first, then start your cycle to see
          today’s movements here and on your home screen widget.
        </Text>
        <TouchableOpacity
          style={styles.primaryCta}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Intake')}
        >
          <Text style={styles.primaryCtaText}>Configure Workout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 12, 20), paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Meta Bar */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backPill}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Routine')}
          >
            <Text style={styles.backPillText}>← Full Plan</Text>
          </TouchableOpacity>

          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>
              WEEK {currentWeek} OF {cycleLengthWeeks}
            </Text>
          </View>
        </View>

        {/* Hero Summary Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <Text style={styles.heroEyebrow}>
              {activeCycle?.isActive ? 'TODAY’S SESSION' : 'PREVIEW SESSION'}
            </Text>
            {completedToday && (
              <View style={styles.doneTodayBadge}>
                <Text style={styles.doneTodayText}>✓ Logged Today</Text>
              </View>
            )}
          </View>

          <Text style={styles.heroTitle}>
            {currentDay?.dayLabel || `Day ${currentDayIndex + 1}`}
          </Text>

          <Text style={styles.heroMeta}>
            {(currentDay?.exercises || []).length} movements •{' '}
            {logistics?.durationMinutes || 60} min •{' '}
            {activeCycle?.totalWorkoutsCompleted || 0} sessions completed
          </Text>

          {justAdvancedMsg && (
            <View style={styles.advancedBanner}>
              <Text style={styles.advancedBannerText}>✓ {justAdvancedMsg}</Text>
            </View>
          )}
        </View>

        {/* Quick Split Day Switcher */}
        <DaySelectorTabs
          schedule={schedule}
          activeDayIndex={currentDayIndex}
          onSelectDay={(idx) => {
            setJustAdvancedMsg(null);
            setCycleDay(idx);
          }}
        />

        {/* Warmup Card */}
        {generatedRoutine?.warmupRoutine && (
          <WarmupCard warmupRoutine={generatedRoutine.warmupRoutine} />
        )}

        {/* Today's Exercises (tap any exercise to expand its movement path) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movements</Text>
          <Text style={styles.sectionHint}>Tap any movement for path & cues</Text>
        </View>

        {(currentDay?.exercises || []).map((exercise, index) => {
          const catalogKey = exercise.catalogId || exercise.id;
          const isDeepLinked =
            deepLinkedExerciseId !== null &&
            String(catalogKey) === deepLinkedExerciseId;
          const safeSubs = getSafeSubstitutions(exercise, {
            logistics,
            targeting,
            feedback,
          });

          return (
            <ExerciseCard
              key={`today-ex-${catalogKey}-${index}`}
              exercise={exercise}
              index={index}
              isFirst={index === 0}
              isLast={index === (currentDay?.exercises || []).length - 1}
              isLiked={likedIds.includes(catalogKey)}
              initialExpanded={isDeepLinked}
              animatingHeartKey={animatingHeartKey}
              heartPopAnim={heartPopAnim}
              safeSubstitutions={safeSubs}
              onLikeToggle={() => handleLikeToggle(catalogKey)}
              onReorder={() => {}}
              onToggleSwapDrawer={() => {}}
              onOpenEditModal={() => navigation.navigate('Routine')}
              onDeleteExercise={() => {}}
              onChooseFromLibrary={() => navigation.navigate('Routine')}
              onSelectSwapReason={() => {}}
              onDirectSubstitutionTap={() => {}}
            />
          );
        })}
      </ScrollView>

      {/* Bottom Complete & Auto-Cycle Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryCta}
          activeOpacity={0.85}
          onPress={handleCompleteWorkout}
        >
          <Text style={styles.primaryCtaText}>
            ✓ Complete Day {currentDayIndex + 1} → Advance to Day {nextDayIndex + 1}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primary,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 340,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceGlass,
  },
  backPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  weekBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  weekBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.primary,
  },
  heroCard: {
    ...Glass.elevated,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primary,
  },
  doneTodayBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(91, 228, 155, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(91, 228, 155, 0.45)',
  },
  doneTodayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  heroMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  advancedBanner: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.control,
    backgroundColor: 'rgba(91, 228, 155, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(91, 228, 155, 0.38)',
  },
  advancedBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionHint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bottomBar: {
    ...Glass.bar,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  primaryCta: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.control,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryInk,
  },
});
