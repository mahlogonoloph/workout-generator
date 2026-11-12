import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { estimateWeeklyVolume } from '../api/generationClient';
import ConfirmModal from '../components/ConfirmModal';

import PurposeHeroBanner from '../components/intake/PurposeHeroBanner';
import SavedRoutineBanner from '../components/intake/SavedRoutineBanner';
import ArchitectureMetricBar from '../components/intake/ArchitectureMetricBar';
import GoalSelectionSection from '../components/intake/GoalSelectionSection';
import LocationSelectionSection from '../components/intake/LocationSelectionSection';
import FrequencySelectionSection from '../components/intake/FrequencySelectionSection';
import DurationSelectionSection from '../components/intake/DurationSelectionSection';
import { FocusMuscleSection, JointExclusionSection } from '../components/intake/ChipSelectionSection';
import FeedbackMemoryBanner from '../components/intake/FeedbackMemoryBanner';
import AttributionDisclaimerFooter from '../components/intake/AttributionDisclaimerFooter';
import IntakeBottomBar from '../components/intake/IntakeBottomBar';
import styles from './IntakeScreen.styles';

export default function IntakeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Zustand Store
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const logistics = useWorkoutStore((state) => state.logistics);
  const targeting = useWorkoutStore((state) => state.targeting);
  const feedback = useWorkoutStore((state) => state.feedback);
  const generatedRoutine = useWorkoutStore((state) => state.generatedRoutine);
  const isEdited = useWorkoutStore((state) => state.isEdited);
  const setPrimaryGoal = useWorkoutStore((state) => state.setPrimaryGoal);
  const setLocation = useWorkoutStore((state) => state.setLocation);
  const setFrequencyDays = useWorkoutStore((state) => state.setFrequencyDays);
  const setDurationMinutes = useWorkoutStore((state) => state.setDurationMinutes);
  const toggleExclusionZone = useWorkoutStore((state) => state.toggleExclusionZone);
  const toggleFocusArea = useWorkoutStore((state) => state.toggleFocusArea);
  const resetFeedback = useWorkoutStore((state) => state.resetFeedback);

  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

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
    if (generatedRoutine && isEdited) {
      setShowOverwriteConfirm(true);
      return;
    }
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
        {/* App Purpose Hero Banner */}
        <PurposeHeroBanner
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
          beaconPulse={beaconPulse}
          beaconOpacity={beaconOpacity}
        />

        {/* Resume Saved Routine Banner */}
        <SavedRoutineBanner
          generatedRoutine={generatedRoutine}
          isEdited={isEdited}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
          onViewPlan={() => navigation.navigate('Routine')}
        />

        {/* Live Biomechanical Architecture Metric Bar */}
        <ArchitectureMetricBar
          estimatedWeeklySets={estimatedWeeklySets}
          selectedFrequency={selectedFrequency}
          selectedLocation={selectedLocation}
          selectedExclusions={selectedExclusions}
          volumeMeterWidth={volumeMeterWidth}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
        />

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
        <GoalSelectionSection
          selectedGoal={selectedGoal}
          onSelectGoal={setPrimaryGoal}
        />

        {/* Section 2: Environment */}
        <LocationSelectionSection
          selectedLocation={selectedLocation}
          onSelectLocation={setLocation}
        />

        {/* Section 3: Weekly Frequency */}
        <FrequencySelectionSection
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setFrequencyDays}
        />

        {/* Section 4: Target Session Duration */}
        <DurationSelectionSection
          selectedDuration={selectedDuration}
          onSelectDuration={setDurationMinutes}
        />

        {/* Section 5: Target Muscle Group Focus */}
        <FocusMuscleSection
          selectedFocusAreas={selectedFocusAreas}
          onToggleFocusArea={toggleFocusArea}
        />

        {/* Section 6: Joint & Recovery Constraints */}
        <JointExclusionSection
          selectedExclusions={selectedExclusions}
          onToggleExclusion={toggleExclusionZone}
        />

        {/* Section 7: Active Feedback Memory Banner */}
        <FeedbackMemoryBanner
          hasFeedbackMemory={hasFeedbackMemory}
          likedCount={likedCount}
          dislikedCount={dislikedCount}
          intensityRating={feedback?.intensityRating}
          onResetFeedback={resetFeedback}
        />

        {/* Section 8: Open-Source Attribution & Health Disclaimer */}
        <AttributionDisclaimerFooter />
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <IntakeBottomBar
        insetsBottom={insets.bottom}
        hasExistingRoutine={Boolean(generatedRoutine)}
        onGenerate={handleGenerate}
      />

      {/* Overwrite Confirmation Modal */}
      <ConfirmModal
        visible={showOverwriteConfirm}
        title="Replace Customized Plan?"
        message="You have manual edits on your saved workout plan. Generating a new routine will replace those customizations."
        confirmText="Generate New Plan"
        cancelText="Keep Saved Plan"
        isDestructive={false}
        icon="↻"
        onConfirm={() => {
          setShowOverwriteConfirm(false);
          navigation.navigate('Loading');
        }}
        onCancel={() => {
          setShowOverwriteConfirm(false);
          navigation.navigate('Routine');
        }}
      />
    </View>
  );
}
