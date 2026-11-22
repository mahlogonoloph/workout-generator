import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Image,
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
import ProgramStepGuide from '../components/intake/ProgramStepGuide';
import GoalSelectionSection, { GOAL_OPTIONS } from '../components/intake/GoalSelectionSection';
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
  const [fineTuneOpen, setFineTuneOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const scrollViewRef = useRef(null);
  const stepOffsetsRef = useRef({});

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

  const selectedGoalOption = GOAL_OPTIONS.find(
    (item) => selectedGoal === item.id || selectedGoal === item.title
  );
  const goalDisplayTitle = selectedGoalOption ? selectedGoalOption.title : selectedGoal;
  const bottomBarSummaryText = `${goalDisplayTitle} • ${selectedLocation} • ${selectedFrequency}d/wk • ${selectedDuration}m`;

  const handleJumpToStep = (stepNum) => {
    setActiveStep(stepNum);
    const targetY = stepOffsetsRef.current[stepNum];
    if (typeof targetY === 'number' && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: Math.max(0, targetY - 14), animated: true });
    }
  };

  const fineTuneSummary = [
    selectedFocusAreas.length > 0
      ? `${selectedFocusAreas.length} muscle${selectedFocusAreas.length > 1 ? 's' : ''} boosted`
      : 'Balanced focus',
    selectedExclusions.length > 0
      ? `${selectedExclusions.length} joint${selectedExclusions.length > 1 ? 's' : ''} shielded`
      : 'Full joint tolerance',
  ].join(' • ');

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
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(entranceHeroAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: useNative,
      }),
      Animated.timing(entranceHeroSlide, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: useNative,
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
      <View style={[styles.heroBackdropWrap, { pointerEvents: 'none' }]}>
        <Image
          source={FIG_HERO_BG}
          style={[styles.heroBackdropImage, styles.heroBackdropImageInner]}
          resizeMode="cover"
        />
        {Platform.OS === 'web' ? (
          <View style={styles.heroBackdropGradientWeb} />
        ) : (
          <Svg width="100%" height="100%" style={styles.heroBackdropSvg}>
            <Defs>
              <SvgLinearGradient id="figHeroFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#190727" stopOpacity="0.52" />
                <Stop offset="0.42" stopColor="#190727" stopOpacity="0.20" />
                <Stop offset="0.82" stopColor="#190727" stopOpacity="0.76" />
                <Stop offset="1" stopColor="#190727" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#figHeroFade)" />
          </Svg>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom + 132 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header: Minimal Brand Masthead or Active Saved Blueprint */}
        <SavedRoutineBanner
          generatedRoutine={generatedRoutine}
          isEdited={isEdited}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
          onViewPlan={() => navigation.navigate('Routine')}
        />

        {/* Frosted Glass Hero Blueprint Card */}
        <ArchitectureMetricBar
          estimatedWeeklySets={estimatedWeeklySets}
          selectedFrequency={selectedFrequency}
          selectedLocation={selectedLocation}
          selectedExclusions={selectedExclusions}
          entranceHeroAnim={entranceHeroAnim}
          entranceHeroSlide={entranceHeroSlide}
        />

        {/* Guided 4-Step Quick Navigator */}
        <ProgramStepGuide
          selectedGoal={selectedGoal}
          selectedLocation={selectedLocation}
          selectedFrequency={selectedFrequency}
          selectedDuration={selectedDuration}
          activeStep={activeStep}
          onJumpToStep={handleJumpToStep}
        />

        {/* Step 1: Primary Goal */}
        <View
          onLayout={(e) => {
            stepOffsetsRef.current[1] = e.nativeEvent.layout.y;
          }}
        >
          <GoalSelectionSection
            selectedGoal={selectedGoal}
            onSelectGoal={(goalId) => {
              setPrimaryGoal(goalId);
              setActiveStep(1);
            }}
          />
        </View>

        {/* Step 2: Environment & Equipment */}
        <View
          onLayout={(e) => {
            stepOffsetsRef.current[2] = e.nativeEvent.layout.y;
          }}
        >
          <LocationSelectionSection
            selectedLocation={selectedLocation}
            onSelectLocation={(locId) => {
              setLocation(locId);
              setActiveStep(2);
            }}
          />
        </View>

        {/* Step 3: Weekly Frequency */}
        <View
          onLayout={(e) => {
            stepOffsetsRef.current[3] = e.nativeEvent.layout.y;
          }}
        >
          <FrequencySelectionSection
            selectedFrequency={selectedFrequency}
            onSelectFrequency={(days) => {
              setFrequencyDays(days);
              setActiveStep(3);
            }}
          />
        </View>

        {/* Step 4: Target Session Duration */}
        <View
          onLayout={(e) => {
            stepOffsetsRef.current[4] = e.nativeEvent.layout.y;
          }}
        >
          <DurationSelectionSection
            selectedDuration={selectedDuration}
            onSelectDuration={(mins) => {
              setDurationMinutes(mins);
              setActiveStep(4);
            }}
          />
        </View>

        {/* Optional Progressive Disclosure: Muscle Priority & Joint Safety */}
        <View style={styles.fineTuneCard}>
          <TouchableOpacity
            style={styles.fineTuneHeader}
            activeOpacity={0.75}
            onPress={() => setFineTuneOpen((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel="Toggle optional muscle focus and joint safety settings"
          >
            <View style={styles.fineTuneTitleWrap}>
              <Text style={styles.fineTuneEyebrow}>OPTIONAL • SKIP IF UNSURE</Text>
              <Text style={styles.fineTuneTitle}>Muscle Focus &amp; Joint Shields</Text>
              <Text style={styles.fineTuneSummary}>{fineTuneSummary}</Text>
            </View>
            <View style={styles.fineTuneTogglePill}>
              <Text style={styles.fineTuneToggleText}>
                {fineTuneOpen ? 'Done ↑' : 'Customize ↓'}
              </Text>
            </View>
          </TouchableOpacity>

          {fineTuneOpen && (
            <View style={styles.fineTuneBody}>
              <FocusMuscleSection
                selectedFocusAreas={selectedFocusAreas}
                onToggleFocusArea={toggleFocusArea}
              />
              <JointExclusionSection
                selectedExclusions={selectedExclusions}
                onToggleExclusion={toggleExclusionZone}
              />
            </View>
          )}
        </View>

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
        summaryText={bottomBarSummaryText}
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
