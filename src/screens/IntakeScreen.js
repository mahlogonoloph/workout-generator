import React from 'react';
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

export default function IntakeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Zustand Store
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const logistics = useWorkoutStore((state) => state.logistics);
  const targeting = useWorkoutStore((state) => state.targeting);
  const setPrimaryGoal = useWorkoutStore((state) => state.setPrimaryGoal);
  const setLocation = useWorkoutStore((state) => state.setLocation);
  const setFrequencyDays = useWorkoutStore((state) => state.setFrequencyDays);
  const setDurationMinutes = useWorkoutStore((state) => state.setDurationMinutes);
  const toggleExclusionZone = useWorkoutStore((state) => state.toggleExclusionZone);

  const selectedGoal = userProfile.primaryGoal || 'Hypertrophy / Muscle';
  const selectedLocation = logistics.location || 'Commercial Gym';
  const selectedFrequency = logistics.frequencyDays || 4;
  const selectedDuration = logistics.durationMinutes || 60;
  const selectedExclusions = targeting.exclusionZones || [];

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
        {/* Header Hero */}
        <View style={styles.header}>
          <Text style={styles.title}>Configure Routine</Text>
          <Text style={styles.subtitle}>
            Select your training parameters. The engine calculates volume, periodization, and joint-safe exercise paths.
          </Text>
        </View>

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

        {/* Section 5: Joint & Recovery Constraints */}
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
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleGenerate}
        >
          <Text style={styles.primaryButtonText}>Generate Routine</Text>
          <Text style={styles.buttonArrow}>→</Text>
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
  header: {
    marginBottom: 28,
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
