import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { estimateWeeklyVolume } from '../api/generationClient';

const GOAL_OPTIONS = [
  { id: 'Hypertrophy / Muscle', title: 'Hypertrophy', desc: 'Maximal muscular volume & density' },
  { id: 'Strength & Power', title: 'Strength & Power', desc: 'Heavy progressive overload on compound lifts' },
  { id: 'Endurance & Stamina', title: 'Endurance', desc: 'Aerobic work capacity & conditioning' },
  { id: 'Fat Loss & Tone', title: 'Fat Loss & Tone', desc: 'High metabolic output & density circuits' },
  { id: 'Longevity & Mobility', title: 'Longevity & Mobility', desc: 'Joint resilience, posture & full range of motion' },
];

const LOCATION_OPTIONS = [
  { id: 'Commercial Gym', title: 'Commercial Gym', desc: 'Full barbells, dumbbells, cables & machines' },
  { id: 'Home Gym', title: 'Home Gym', desc: 'Free weights, adjustable bench & pull-up bar' },
  { id: 'Bodyweight Only', title: 'Bodyweight Only', desc: 'Calisthenics requiring zero external equipment' },
];

const FREQUENCY_OPTIONS = [
  { days: 2, label: '2 Days', sub: 'Full Body' },
  { days: 3, label: '3 Days', sub: 'Full Body' },
  { days: 4, label: '4 Days', sub: 'Upper / Lower' },
  { days: 5, label: '5 Days', sub: 'PPL + Upper' },
  { days: 6, label: '6 Days', sub: 'High Volume' },
];

const DURATION_OPTIONS = [
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '60 min' },
  { minutes: 75, label: '75 min' },
];

const JOINT_SAFETY_OPTIONS = [
  'Shoulders',
  'Lower Back',
  'Knees',
  'Wrists',
  'Elbows',
];

const FOCUS_MUSCLE_OPTIONS = [
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Glutes',
  'Arms',
  'Core',
];

export default function IntakeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Zustand Store
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const logistics = useWorkoutStore((state) => state.logistics);
  const targeting = useWorkoutStore((state) => state.targeting);
  const feedback = useWorkoutStore((state) => state.feedback);
  const setPrimaryGoal = useWorkoutStore((state) => state.setPrimaryGoal);
  const setLocation = useWorkoutStore((state) => state.setLocation);
  const setFrequencyDays = useWorkoutStore((state) => state.setFrequencyDays);
  const setDurationMinutes = useWorkoutStore((state) => state.setDurationMinutes);
  const toggleExclusionZone = useWorkoutStore((state) => state.toggleExclusionZone);
  const toggleFocusArea = useWorkoutStore((state) => state.toggleFocusArea);
  const resetFeedback = useWorkoutStore((state) => state.resetFeedback);

  const selectedGoal = userProfile.primaryGoal || 'Hypertrophy / Muscle';
  const selectedLocation = logistics.location || 'Commercial Gym';
  const selectedFrequency = logistics.frequencyDays || 4;
  const selectedDuration = logistics.durationMinutes || 60;
  const selectedExclusions = targeting.exclusionZones || [];
  const selectedFocusAreas = targeting.focusAreas || [];
  const likedCount = (feedback?.likedExerciseIds || []).length;
  const dislikedCount = (feedback?.dislikedExerciseIds || []).length;
  const hasFeedbackMemory =
    likedCount > 0 || dislikedCount > 0 || (feedback?.intensityRating && feedback.intensityRating !== 'optimal');

  // Dynamic Science-Based Volume Calculation for Motion Graphic
  const volumeEstimate = estimateWeeklyVolume({
    primaryGoal: selectedGoal,
    frequencyDays: selectedFrequency,
    durationMinutes: selectedDuration,
    intensityRating: feedback?.intensityRating || 'optimal',
    focusAreas: selectedFocusAreas,
  });
  const estimatedWeeklySets = volumeEstimate.weeklySets;

  // Innovative Animations & Micro-Interactions
  const entranceHeroAnim = useRef(new Animated.Value(0)).current;
  const entranceHeroSlide = useRef(new Animated.Value(14)).current;
  const entranceSectionAnim = useRef(new Animated.Value(0)).current;
  const beaconPulse = useRef(new Animated.Value(1)).current;
  const beaconOpacity = useRef(new Animated.Value(0.75)).current;
  const ctaPulseScale = useRef(new Animated.Value(1)).current;
  const volumeMeterAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // 1. Staggered Entrance
    Animated.parallel([
      Animated.timing(entranceHeroAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(entranceHeroSlide, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(entranceSectionAnim, {
        toValue: 1,
        duration: 650,
        delay: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Kinetic Beacon Pulse (Signaling active engine)
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(beaconPulse, {
            toValue: 2.2,
            duration: 1600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(beaconPulse, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(beaconOpacity, {
            toValue: 0,
            duration: 1600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(beaconOpacity, {
            toValue: 0.75,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 3. CTA Breathing Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulseScale, {
          toValue: 1.02,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulseScale, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Update volume meter whenever parameters change
  useEffect(() => {
    const targetRatio = Math.max(0.15, Math.min(1, estimatedWeeklySets / 110));
    Animated.spring(volumeMeterAnim, {
      toValue: targetRatio,
      friction: 6,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [estimatedWeeklySets]);

  const volumeMeterWidth = volumeMeterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleGenerate = () => {
    navigation.navigate('Loading');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 16), paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Purpose Hero Banner (Distraction-free statement for new users) */}
        <Animated.View
          style={[
            styles.purposeHeroBanner,
            {
              opacity: entranceHeroAnim,
              transform: [{ translateY: entranceHeroSlide }],
            },
          ]}
        >
          <View style={styles.purposeTagRow}>
            <View style={styles.purposeBeaconDot}>
              <Animated.View
                style={[
                  styles.purposeBeaconPulse,
                  {
                    transform: [{ scale: beaconPulse }],
                    opacity: beaconOpacity,
                  },
                ]}
              />
            </View>
            <Text style={styles.purposeTagLabel}>Just a routine generator :D</Text>
          </View>
          <Text style={styles.purposeStatementText}>
            a tool that generates a clean, distraction-free 8-Week Physical Training Binder / PDF
          </Text>
        </Animated.View>

        {/* Live Biomechanical Architecture Metric Bar (Motion Graphic) */}
        <Animated.View
          style={[
            styles.architectureCard,
            {
              opacity: entranceHeroAnim,
              transform: [{ translateY: entranceHeroSlide }],
            },
          ]}
        >
          <View style={styles.architectureHeaderRow}>
            <View style={styles.architectureTitleWrap}>
              <Text style={styles.architectureSub}>CALCULATED ARCHITECTURE</Text>
              <Text style={styles.architectureMainVal}>
                ~{estimatedWeeklySets} Sets / Wk • {selectedFrequency} Days/Wk
              </Text>
            </View>
            <View style={styles.architectureBadge}>
              <Text style={styles.architectureBadgeText}>{selectedLocation}</Text>
            </View>
          </View>

          {/* Volume progress meter */}
          <View style={styles.volumeMeterTrack}>
            <Animated.View style={[styles.volumeMeterFill, { width: volumeMeterWidth }]} />
          </View>

          <View style={styles.architectureFooterRow}>
            <Text style={styles.architectureFooterText}>
              8-Week Total: ~{estimatedWeeklySets * 8} Working Sets
            </Text>
            <Text style={styles.architectureShieldText}>
              {selectedExclusions.length > 0
                ? `🛡 ${selectedExclusions.length} Joint Shield(s)`
                : '🛡 Joint Safety Active'}
            </Text>
          </View>
        </Animated.View>

        {/* Header Hero */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: entranceSectionAnim,
            },
          ]}
        >
          <Text style={styles.title}>Configure Routine</Text>
          <Text style={styles.subtitle}>
            Select your training parameters. The engine calculates volume, periodization, and joint-safe exercise paths.
          </Text>
        </Animated.View>

        {/* Section 1: Primary Training Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Goal</Text>
          <Text style={styles.sectionSubtitle}>Select your main adaptation target for this 8-week block</Text>
          <View style={styles.verticalPillsContainer}>
            {GOAL_OPTIONS.map((item) => {
              const isSelected = selectedGoal === item.id || selectedGoal === item.title;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  onPress={() => setPrimaryGoal(item.id)}
                  style={[
                    styles.goalPill,
                    isSelected ? styles.goalPillSelected : styles.goalPillUnselected,
                  ]}
                >
                  <View style={styles.pillTextWrap}>
                    <Text
                      style={[
                        styles.goalPillTitle,
                        isSelected ? styles.goalPillTitleSelected : styles.goalPillTitleUnselected,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.goalPillDesc,
                        isSelected ? styles.goalPillDescSelected : styles.goalPillDescUnselected,
                      ]}
                    >
                      {item.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected ? styles.selectionIndicatorActive : styles.selectionIndicatorInactive,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Environment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environment & Equipment</Text>
          <Text style={styles.sectionSubtitle}>Where you will perform the majority of your sessions</Text>
          <View style={styles.verticalPillsContainer}>
            {LOCATION_OPTIONS.map((item) => {
              const isSelected = selectedLocation === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  onPress={() => setLocation(item.id)}
                  style={[
                    styles.goalPill,
                    isSelected ? styles.goalPillSelected : styles.goalPillUnselected,
                  ]}
                >
                  <View style={styles.pillTextWrap}>
                    <Text
                      style={[
                        styles.goalPillTitle,
                        isSelected ? styles.goalPillTitleSelected : styles.goalPillTitleUnselected,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.goalPillDesc,
                        isSelected ? styles.goalPillDescSelected : styles.goalPillDescUnselected,
                      ]}
                    >
                      {item.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected ? styles.selectionIndicatorActive : styles.selectionIndicatorInactive,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Weekly Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Frequency</Text>
          <Text style={styles.sectionSubtitle}>Number of training days committed per week</Text>
          <View style={styles.frequencyRow}>
            {FREQUENCY_OPTIONS.map((item) => {
              const isSelected = selectedFrequency === item.days;
              return (
                <TouchableOpacity
                  key={item.days}
                  activeOpacity={0.75}
                  onPress={() => setFrequencyDays(item.days)}
                  style={[
                    styles.frequencyPill,
                    isSelected ? styles.frequencyPillSelected : styles.frequencyPillUnselected,
                  ]}
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 4: Target Session Duration */}
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
                  onPress={() => setDurationMinutes(item.minutes)}
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

        {/* Section 5: Target Muscle Group Focus (Taxonomy Priority) */}
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
                  onPress={() => toggleFocusArea(muscle)}
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

        {/* Section 6: Joint & Recovery Constraints */}
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
                  onPress={() => toggleExclusionZone(joint)}
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

        {/* Section 7: Active Feedback Memory Banner */}
        {hasFeedbackMemory && (
          <View style={styles.feedbackMemoryCard}>
            <View style={styles.feedbackMemoryHeader}>
              <Text style={styles.feedbackMemoryTitle}>Learned User Preferences Active</Text>
              <TouchableOpacity onPress={resetFeedback} activeOpacity={0.7}>
                <Text style={styles.feedbackResetBtn}>Reset Memory</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.feedbackMemoryDesc}>
              • {likedCount} Favorited movement(s) prioritized{'\n'}
              • {dislikedCount} Disliked/Swapped movement(s) excluded{'\n'}
              • Volume Calibration: {feedback?.intensityRating?.toUpperCase() || 'OPTIMAL'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Animated.View style={{ transform: [{ scale: ctaPulseScale }], width: '100%' }}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleGenerate}
          >
            <Text style={styles.primaryButtonText}>Generate Routine</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
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
  purposeHeroBanner: {
    backgroundColor: 'rgba(41, 22, 48, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  purposeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  purposeBeaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeBeaconPulse: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  purposeTagLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.1,
  },
  purposeStatementText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  architectureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  architectureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  architectureTitleWrap: {
    flex: 1,
  },
  architectureSub: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.9,
    marginBottom: 2,
  },
  architectureMainVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  architectureBadge: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  architectureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
  },
  volumeMeterTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  volumeMeterFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  architectureFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  architectureFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  architectureShieldText: {
    fontSize: 11,
    color: Colors.success || '#4E9F74',
    fontWeight: '700',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary, // #FAF4F0 Off-white
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary, // #C5B5C9
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  verticalPillsContainer: {
    gap: 8,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  goalPillUnselected: {
    backgroundColor: Colors.surface, // #291630
    borderColor: Colors.border,
  },
  goalPillSelected: {
    backgroundColor: Colors.primary, // #C84663 Vibrant primary CTA
    borderColor: 'transparent',
  },
  pillTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  goalPillTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  goalPillTitleSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  goalPillDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  goalPillDescUnselected: {
    color: Colors.textSecondary,
  },
  goalPillDescSelected: {
    color: 'rgba(250, 244, 240, 0.85)',
  },
  selectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectionIndicatorInactive: {
    backgroundColor: 'transparent',
  },
  selectionIndicatorActive: {
    backgroundColor: Colors.textPrimary,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyPill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyPillUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  frequencyPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  frequencyPillTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  frequencyPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  frequencyPillTitleSelected: {
    color: Colors.textPrimary,
  },
  frequencyPillSub: {
    fontSize: 10,
    marginTop: 2,
  },
  frequencyPillSubUnselected: {
    color: Colors.textMuted,
  },
  frequencyPillSubSelected: {
    color: 'rgba(250, 244, 240, 0.85)',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  durationPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  durationPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  durationPillTextUnselected: {
    color: Colors.textPrimary,
  },
  durationPillTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  jointChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jointChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  jointChipSafe: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  jointChipExcluded: {
    backgroundColor: 'rgba(200, 70, 99, 0.16)',
    borderColor: Colors.primary,
  },
  jointChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jointChipTextSafe: {
    color: Colors.textSecondary,
  },
  jointChipTextExcluded: {
    color: Colors.primary,
  },
  focusChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  focusChipTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  feedbackMemoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
  },
  feedbackMemoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackMemoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  feedbackResetBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  feedbackMemoryDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
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
  },
  primaryButton: {
    backgroundColor: Colors.primary, // #C84663
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
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
    letterSpacing: 0.2,
    marginRight: 8,
  },
  buttonArrow: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
