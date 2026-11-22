import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  ImageBackground,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { estimateWeeklyVolume } from '../api/generationClient';
import ConfirmModal from '../components/ConfirmModal';

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

const FIG_HERO_BG = require('../../assets/fig-hero-bg.jpg');

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

  // Dynamic Science-Based Volume Calculation
  const volumeEstimate = estimateWeeklyVolume({
    primaryGoal: selectedGoal,
    frequencyDays: selectedFrequency,
    durationMinutes: selectedDuration,
    intensityRating: feedback?.intensityRating || 'optimal',
    focusAreas: selectedFocusAreas,
  });
  const estimatedWeeklySets = volumeEstimate.weeklySets;

  // Entrance Animation (one clean entrance on mount)
  const entranceHeroAnim = useRef(new Animated.Value(0)).current;
  const entranceHeroSlide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceHeroAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(entranceHeroSlide, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

      {/* Full-bleed Atmospheric Ripe Figs Hero Backdrop */}
      <View style={styles.heroBackdropWrap} pointerEvents="none">
        <ImageBackground
          source={FIG_HERO_BG}
          style={styles.heroBackdropImage}
          imageStyle={styles.heroBackdropImageInner}
          resizeMode="cover"
        >
          {Platform.OS === 'web' ? (
            <View style={styles.heroBackdropGradientWeb} />
          ) : (
            <Svg width="100%" height="100%" style={styles.heroBackdropSvg}>
              <Defs>
                <SvgLinearGradient id="figHeroFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#190727" stopOpacity="0.58" />
                  <Stop offset="0.38" stopColor="#190727" stopOpacity="0.38" />
                  <Stop offset="0.78" stopColor="#190727" stopOpacity="0.86" />
                  <Stop offset="1" stopColor="#190727" stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#figHeroFade)" />
            </Svg>
          )}
        </ImageBackground>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom + 116 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header: Active Saved Blueprint or Brand Masthead */}
        <SavedRoutineBanner
          generatedRoutine={generatedRoutine}
          isEdited={isEdited}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
          onViewPlan={() => navigation.navigate('Routine')}
        />

        {/* Frosted Glass Hero Blueprint Card (Figma 1001:94) */}
        <ArchitectureMetricBar
          estimatedWeeklySets={estimatedWeeklySets}
          selectedFrequency={selectedFrequency}
          selectedLocation={selectedLocation}
          selectedDuration={selectedDuration}
          selectedExclusions={selectedExclusions}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
        />

        {/* Primary Goal: Acid Lime Hero Card + Collapsed Plum Steppers (Figma 1001:96) */}
        <GoalSelectionSection
          selectedGoal={selectedGoal}
          onSelectGoal={setPrimaryGoal}
        />

        {/* Environment & Equipment */}
        <LocationSelectionSection
          selectedLocation={selectedLocation}
          onSelectLocation={setLocation}
        />

        {/* Weekly Frequency */}
        <FrequencySelectionSection
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setFrequencyDays}
        />

        {/* Target Session Duration */}
        <DurationSelectionSection
          selectedDuration={selectedDuration}
          onSelectDuration={setDurationMinutes}
        />

        {/* Target Muscle Priority */}
        <FocusMuscleSection
          selectedFocusAreas={selectedFocusAreas}
          onToggleFocusArea={toggleFocusArea}
        />

        {/* Joint Sensitivity / Exclusions */}
        <JointExclusionSection
          selectedExclusions={selectedExclusions}
          onToggleExclusion={toggleExclusionZone}
        />

        {/* Active Feedback Memory Banner */}
        <FeedbackMemoryBanner
          hasFeedbackMemory={hasFeedbackMemory}
          likedCount={likedCount}
          dislikedCount={dislikedCount}
          intensityRating={feedback?.intensityRating}
          onResetFeedback={resetFeedback}
        />

        {/* Open-Source Attribution & Health Disclaimer */}
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
