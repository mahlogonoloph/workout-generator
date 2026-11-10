import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { downloadWorkoutPdf } from '../utils/generateWorkoutPdf';
import ExerciseIllustrationSvg from '../components/ExerciseIllustrationSvg';
import EditPrescriptionModal from '../components/EditPrescriptionModal';
import AddExerciseModal from '../components/AddExerciseModal';
import ConfirmModal from '../components/ConfirmModal';
import { WGER_EXERCISE_CATALOG } from '../data/wgerExerciseCatalog.js';
import { getSafeSubstitutions } from '../api/generationClient.js';

const SWAP_REASONS = [
  { id: 'equipment_busy', label: 'Equipment Busy', sub: 'Swap for today only' },
  { id: 'joint_pain', label: 'Joint Discomfort', sub: 'Swap & avoid stressed joint' },
  { id: 'too_hard', label: 'Too Complex', sub: 'Prefer simpler mechanics' },
  { id: 'dislike', label: 'Dislike Exercise', sub: 'Never prescribe again' },
];

const INTENSITY_OPTIONS = [
  { id: 'too_easy', label: 'Too Easy', sub: '+1 Set / Less Rest' },
  { id: 'optimal', label: 'Just Right', sub: 'Balanced Volume' },
  { id: 'too_hard', label: 'Too Brutal', sub: '-1 Set / More Rest' },
];

export default function RoutineScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const generatedRoutine = useWorkoutStore((state) => state.generatedRoutine);
  const logistics = useWorkoutStore((state) => state.logistics);
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const targeting = useWorkoutStore((state) => state.targeting);
  const feedback = useWorkoutStore((state) => state.feedback);
  const isEdited = useWorkoutStore((state) => state.isEdited);
  const originalGeneratedRoutine = useWorkoutStore((state) => state.originalGeneratedRoutine);

  const toggleLikeExercise = useWorkoutStore((state) => state.toggleLikeExercise);
  const swapExerciseWithFeedback = useWorkoutStore((state) => state.swapExerciseWithFeedback);
  const replaceExerciseWithCatalogItem = useWorkoutStore((state) => state.replaceExerciseWithCatalogItem);
  const setIntensityRating = useWorkoutStore((state) => state.setIntensityRating);
  const updateExercisePrescription = useWorkoutStore((state) => state.updateExercisePrescription);
  const deleteExercise = useWorkoutStore((state) => state.deleteExercise);
  const addExerciseToDay = useWorkoutStore((state) => state.addExerciseToDay);
  const reorderExercise = useWorkoutStore((state) => state.reorderExercise);
  const resetToOriginalRoutine = useWorkoutStore((state) => state.resetToOriginalRoutine);

  // Fallback data if store hasn't generated yet
  const routine = generatedRoutine || {
    id: 'demo-plan',
    programName: '8-Week Fig Hypertrophy Blueprint',
    warmupRoutine: {
      cardioPrimer:
        '5-7 minutes light dynamic cardio (treadmill incline walk or bike) to raise core body temp.',
      dynamicMobility: [
        'World’s Greatest Stretch with thoracic rotations (5 reps/side)',
        'Arm Circles & Shoulder Band Dislocates (15 reps)',
        'Bodyweight Deep Squats with Pause (10 reps)',
      ],
    },
    schedule: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1: Upper Body A: Strength & Horizontal Focus',
        exercises: [
          {
            id: 'ex-1-1-wger_192',
            catalogId: 'wger_192',
            wgerId: 192,
            name: 'Barbell Bench Press',
            category: 'Chest',
            movementPattern: 'horizontal_push',
            movementPatternLabel: 'Horizontal Push',
            tier: 'compound',
            svgType: 'bench_press',
            primaryMuscles: ['pectorals'],
            secondaryMuscles: ['triceps', 'anterior_deltoid'],
            primaryMuscleLabels: ['Chest'],
            secondaryMuscleLabels: ['Triceps', 'Front Delts'],
            formCues: [
              'Retract and depress shoulder blades firmly into the bench pad.',
              'Lower the bar under control to your lower sternum with elbows tucked ~45°.',
              'Drive feet into the floor and press the bar slightly back toward the rack.',
            ],
            sets: 4,
            reps: '6-10',
            restSeconds: 105,
            substitutions: ['Dumbbell Flat Bench Press', 'Machine Chest Press'],
          },
          {
            id: 'ex-1-2-wger_143',
            catalogId: 'wger_143',
            wgerId: 143,
            name: 'Seated Neutral-Grip Cable Row',
            category: 'Back',
            movementPattern: 'horizontal_pull',
            movementPatternLabel: 'Horizontal Pull',
            tier: 'compound',
            svgType: 'seated_cable_row',
            svgAccuracy: 'exact',
            primaryMuscles: ['upper_back', 'lats'],
            secondaryMuscles: ['biceps', 'posterior_deltoid'],
            primaryMuscleLabels: ['Upper Back', 'Lats'],
            secondaryMuscleLabels: ['Biceps', 'Rear Delts'],
            formCues: [
              'Sit tall with knees slightly bent and chest up.',
              'Pull the handle to your midsection while driving elbows past your torso.',
              'Pause 1 second squeezing the mid-back before extending forward.',
            ],
            sets: 4,
            reps: '6-10',
            restSeconds: 105,
            substitutions: ['One-Arm Dumbbell Row', 'Chest-Supported Dumbbell Row'],
          },
          {
            id: 'ex-1-3-wger_123',
            catalogId: 'wger_123',
            wgerId: 123,
            name: 'Seated Dumbbell Shoulder Press',
            category: 'Shoulders',
            movementPattern: 'vertical_push',
            movementPatternLabel: 'Vertical Push',
            tier: 'compound',
            svgType: 'overhead_press',
            svgAccuracy: 'pattern',
            svgNote: 'Standing overhead path shown • Perform seated on bench',
            primaryMuscles: ['anterior_deltoid', 'lateral_deltoid'],
            secondaryMuscles: ['triceps'],
            primaryMuscleLabels: ['Front Delts', 'Side Delts'],
            secondaryMuscleLabels: ['Triceps'],
            formCues: [
              'Press in the scapular plane (elbows angled ~30° forward).',
              'Lower dumbbells until bells touch just above shoulder level.',
              'Exhale as you press overhead without locking elbows aggressively.',
            ],
            sets: 3,
            reps: '8-12',
            restSeconds: 90,
            substitutions: ['Standing Overhead Barbell Press', 'Arnold Dumbbell Press'],
          },
        ],
      },
    ],
  };

  const schedule = routine.schedule || [];
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isWarmupExpanded, setIsWarmupExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openSwapCardId, setOpenSwapCardId] = useState(null);
  const [editingModalData, setEditingModalData] = useState(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);
  const [catalogModalConfig, setCatalogModalConfig] = useState({
    visible: false,
    mode: 'add',
    exerciseIndex: null,
    swappingExercise: null,
  });

  // Innovative animations
  const dayFadeAnim = useRef(new Animated.Value(1)).current;
  const heartPopAnim = useRef(new Animated.Value(1)).current;
  const [animatingHeartKey, setAnimatingHeartKey] = useState(null);

  const likedIds = feedback?.likedExerciseIds || [];
  const dislikedIds = feedback?.dislikedExerciseIds || [];
  const intensityRating = feedback?.intensityRating || 'optimal';

  const handleDaySelect = (index) => {
    if (index === activeDayIndex) return;
    setOpenSwapCardId(null);
    Animated.sequence([
      Animated.timing(dayFadeAnim, {
        toValue: 0.15,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(dayFadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    setActiveDayIndex(index);
  };

  const handleLikeToggle = (catalogKey) => {
    setAnimatingHeartKey(catalogKey);
    Animated.sequence([
      Animated.timing(heartPopAnim, {
        toValue: 1.35,
        duration: 100,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.spring(heartPopAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimatingHeartKey((prev) => (prev === catalogKey ? null : prev));
    });
    toggleLikeExercise(catalogKey);
  };

  const handleDirectSubstitutionTap = (exerciseIndex, exercise, subName) => {
    const normalizedSub = (subName || '').toLowerCase().trim();
    const directMatch =
      WGER_EXERCISE_CATALOG.find((item) => item.name.toLowerCase() === normalizedSub) ||
      WGER_EXERCISE_CATALOG.find(
        (item) =>
          item.name.toLowerCase().includes(normalizedSub) ||
          normalizedSub.includes(item.name.toLowerCase())
      );
    if (directMatch) {
      setConfirmModalConfig({
        title: 'Swap Exercise?',
        message: `Replace "${exercise.name}" with "${directMatch.name}"?`,
        confirmText: 'Swap Movement',
        cancelText: 'Cancel',
        isDestructive: false,
        icon: '⇄',
        onConfirm: () => {
          replaceExerciseWithCatalogItem({
            dayIndex: activeDayIndex,
            exerciseIndex,
            catalogExercise: directMatch,
            keepPrescription: true,
          });
          setConfirmModalConfig(null);
        },
        onCancel: () => setConfirmModalConfig(null),
      });
    } else {
      setCatalogModalConfig({
        visible: true,
        mode: 'swap',
        exerciseIndex,
        swappingExercise: exercise,
      });
    }
  };

  const handleDownloadPdf = async () => {
    // On mobile web, synchronously obtain a new tab reference inside the direct user tap gesture
    // so strict mobile pop-up blockers (iOS Safari, Android Chrome) do not suppress the tab.
    let targetWindow = null;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ''
      );
      if (isMobile) {
        try {
          targetWindow = window.open('', '_blank');
          if (targetWindow) {
            targetWindow.document.write(
              '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Generating Workout Blueprint...</title><style>body{background:#1F1124;color:#FAF4F0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;font-size:14px;}</style></head><body><div><div style="font-size:32px;margin-bottom:12px;">🏋️</div><div style="font-weight:700;">Generating Workout Blueprint...</div><div style="font-size:12px;color:#E2CAD4;margin-top:6px;">Preparing your printable 8-week guide</div></div></body></html>'
            );
          }
        } catch (e) {
          targetWindow = null;
        }
      }
    }

    try {
      setIsDownloading(true);
      await downloadWorkoutPdf({
        routine,
        userProfile,
        logistics,
        targeting,
        targetWindow,
      });
    } catch (error) {
      if (targetWindow && !targetWindow.closed) {
        try {
          targetWindow.close();
        } catch (e) {}
      }
      console.error('Failed to generate or download workout PDF:', error);
      setConfirmModalConfig({
        title: 'Download Error',
        message: 'Unable to generate your workout program PDF. Please try again.',
        confirmText: 'Got It',
        cancelText: null,
        isDestructive: false,
        icon: '!',
        onConfirm: () => setConfirmModalConfig(null),
        onCancel: () => setConfirmModalConfig(null),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSwapReasonSelect = (exerciseIndex, reasonId) => {
    swapExerciseWithFeedback({
      dayIndex: activeDayIndex,
      exerciseIndex,
      reason: reasonId,
    });
    setOpenSwapCardId(null);
  };

  const handleDeleteExercise = (exerciseIndex, exerciseName) => {
    setConfirmModalConfig({
      title: 'Remove Exercise?',
      message: `Remove "${exerciseName}" from ${activeDay.dayLabel || 'this workout'}?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      isDestructive: true,
      icon: '✕',
      onConfirm: () => {
        deleteExercise({
          dayIndex: activeDayIndex,
          exerciseIndex,
        });
        if (openSwapCardId) setOpenSwapCardId(null);
        setConfirmModalConfig(null);
      },
      onCancel: () => setConfirmModalConfig(null),
    });
  };

  const handleResetToOriginal = () => {
    setConfirmModalConfig({
      title: 'Reset to AI Blueprint?',
      message:
        'All your manual adjustments, added movements, reordered exercises, and custom sets/reps will be reverted back to the initial AI generation.',
      confirmText: 'Reset to Original',
      cancelText: 'Keep Edits',
      isDestructive: true,
      icon: '↺',
      onConfirm: () => {
        resetToOriginalRoutine();
        setOpenSwapCardId(null);
        setConfirmModalConfig(null);
      },
      onCancel: () => setConfirmModalConfig(null),
    });
  };

  const activeDay = schedule[activeDayIndex] || schedule[0] || {
    dayNumber: 1,
    dayLabel: 'Day 1',
    exercises: [],
  };

  const totalDaySets = (activeDay.exercises || []).reduce(
    (sum, ex) => sum + (Number(ex.sets) || 0),
    0
  );

  const estimatedMinutes =
    Math.round(
      (activeDay.exercises || []).reduce((sum, ex) => {
        const sets = Number(ex.sets) || 3;
        const rest = Number(ex.restSeconds) || 90;
        return sum + (sets * 40 + Math.max(0, sets - 1) * rest);
      }, 0) / 60
    ) || logistics?.durationMinutes || 60;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 16, paddingBottom: insets.bottom + 115 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {userProfile?.primaryGoal?.toUpperCase() || 'HYPERTROPHY'}
              </Text>
            </View>
            <View style={styles.badgeSubtle}>
              <Text style={styles.badgeSubtleText}>
                {logistics?.location || 'Commercial Gym'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.badgeSubtle}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('https://wger.de')}
            >
              <Text style={styles.badgeSubtleText}>wger Open-Source DB ↗</Text>
            </TouchableOpacity>
            {isEdited && (
              <View style={styles.editedBadge}>
                <Text style={styles.editedBadgeText}>CUSTOMIZED</Text>
              </View>
            )}
          </View>

          <View style={styles.heroTitleRow}>
            <Text style={styles.programTitle}>{routine.programName}</Text>
            {isEdited && originalGeneratedRoutine && (
              <TouchableOpacity
                style={styles.revertBtn}
                activeOpacity={0.7}
                onPress={handleResetToOriginal}
              >
                <Text style={styles.revertBtnText}>↺ Reset to original Plan</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.programMeta}>
            {schedule.length} Days / Week • {logistics?.durationMinutes || 60} min sessions •{' '}
            {userProfile?.cycleLengthWeeks || 8} Week Block
          </Text>
        </View>

        {/* Feedback Loop & Volume Calibration Card */}
        <View style={styles.feedbackCalibrationCard}>
          <View style={styles.feedbackHeaderRow}>
            <Text style={styles.feedbackTitle}>Adaptive Feedback Loop</Text>
            <Text style={styles.feedbackMemoryPill}>
              ♥ {likedIds.length} Liked • ✕ {dislikedIds.length} Avoided
            </Text>
          </View>
          <Text style={styles.feedbackSubtitle}>
            How does this session volume feel? Tunes sets, rest intervals & future selections:
          </Text>
          <View style={styles.intensityRow}>
            {INTENSITY_OPTIONS.map((opt) => {
              const isSelected = intensityRating === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.75}
                  onPress={() => setIntensityRating(opt.id)}
                  style={[
                    styles.intensityChip,
                    isSelected ? styles.intensityChipActive : styles.intensityChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.intensityChipLabel,
                      isSelected
                        ? styles.intensityChipLabelActive
                        : styles.intensityChipLabelInactive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.intensityChipSub}>{opt.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
                const cleanLabel =
                  day.dayLabel?.replace(/^Day \d+:\s*/, '') || `Session ${day.dayNumber}`;
                return (
                  <TouchableOpacity
                    key={day.dayNumber || index}
                    activeOpacity={0.75}
                    onPress={() => handleDaySelect(index)}
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
          <View style={styles.dayHeaderTitleRow}>
            <Text style={styles.dayTitle}>{activeDay.dayLabel}</Text>
            <View style={styles.dayStatsPill}>
              <Text style={styles.dayStatsPillText}>~{estimatedMinutes} min</Text>
            </View>
          </View>
          <Text style={styles.daySubtitle}>
            {activeDay.exercises?.length || 0} Movements • {totalDaySets} Total Sets • Sequenced by Movement Pattern
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
              <Text style={styles.warmupToggle}>
                {isWarmupExpanded ? 'Collapse ↑' : 'View ↓'}
              </Text>
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
        <Animated.View style={[styles.exerciseList, { opacity: dayFadeAnim }]}>
          {(!activeDay.exercises || activeDay.exercises.length === 0) && (
            <View style={styles.emptyExercisesCard}>
              <Text style={styles.emptyExercisesTitle}>No exercises in this session</Text>
              <Text style={styles.emptyExercisesSub}>
                Use "＋ Add Exercise to Day" below to add movements from the catalog, or tap "↺ Reset to original Plan" at the top to restore the generated blueprint.
              </Text>
            </View>
          )}

          {(activeDay.exercises || []).map((exercise, index) => {
            const catalogKey = exercise.catalogId || exercise.id;
            const isLiked = likedIds.includes(catalogKey);
            const isSwapDrawerOpen = openSwapCardId === exercise.id;

            return (
              <View key={exercise.id || index} style={styles.exerciseCard}>
                {/* Swapped Notification Banner */}
                {exercise.swappedFrom && (
                  <View style={styles.swappedBanner}>
                    <Text style={styles.swappedBannerText}>
                      ✓ Swapped from {exercise.swappedFrom} • Feedback recorded
                    </Text>
                  </View>
                )}

                {/* Top Header Row: Index & Reorder, Name, Actions */}
                <View style={styles.exerciseTopRow}>
                  {/* Reorder and Index Column */}
                  <View style={styles.indexReorderCol}>
                    <TouchableOpacity
                      style={[styles.reorderArrowBtn, index === 0 && styles.reorderArrowBtnDisabled]}
                      activeOpacity={0.6}
                      disabled={index === 0}
                      onPress={() =>
                        reorderExercise({
                          dayIndex: activeDayIndex,
                          fromIndex: index,
                          toIndex: index - 1,
                        })
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Move exercise up"
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={[styles.reorderArrowText, index === 0 && styles.reorderArrowTextDisabled]}>
                        ▲
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.exerciseIndexBadge}>
                      <Text style={styles.exerciseIndexText}>{index + 1}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.reorderArrowBtn,
                        index === (activeDay.exercises?.length - 1) && styles.reorderArrowBtnDisabled,
                      ]}
                      activeOpacity={0.6}
                      disabled={index === (activeDay.exercises?.length - 1)}
                      onPress={() =>
                        reorderExercise({
                          dayIndex: activeDayIndex,
                          fromIndex: index,
                          toIndex: index + 1,
                        })
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Move exercise down"
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text
                        style={[
                          styles.reorderArrowText,
                          index === (activeDay.exercises?.length - 1) && styles.reorderArrowTextDisabled,
                        ]}
                      >
                        ▼
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exerciseTitleBlock}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <View style={styles.taxonomyMetaRow}>
                      {exercise.isFocusBoosted && (
                        <View style={styles.focusBoostBadge}>
                          <Text style={styles.focusBoostBadgeText}>★ FOCUS +1 SET</Text>
                        </View>
                      )}
                      {exercise.stretchBiased && (
                        <View style={styles.stretchBadge}>
                          <Text style={styles.stretchBadgeText}>↔ STRETCH</Text>
                        </View>
                      )}
                      {exercise.movementPatternLabel && (
                        <View style={styles.patternBadge}>
                          <Text style={styles.patternBadgeText}>
                            {exercise.movementPatternLabel.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      {(exercise.primaryMuscleLabels || []).map((mLabel, mIdx) => (
                        <View key={mIdx} style={styles.musclePrimaryBadge}>
                          <Text style={styles.musclePrimaryBadgeText}>{mLabel}</Text>
                        </View>
                      ))}
                      {(exercise.secondaryMuscleLabels || []).slice(0, 2).map((sLabel, sIdx) => (
                        <View key={sIdx} style={styles.muscleSecondaryBadge}>
                          <Text style={styles.muscleSecondaryBadgeText}>{sLabel}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Feedback Action Buttons */}
                  <View style={styles.feedbackButtonsRow}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleLikeToggle(catalogKey)}
                      style={[
                        styles.iconActionBtn,
                        isLiked && styles.iconActionBtnLiked,
                      ]}
                    >
                      <Animated.View
                        style={
                          animatingHeartKey === catalogKey
                            ? { transform: [{ scale: heartPopAnim }] }
                            : undefined
                        }
                      >
                        <Text
                          style={[
                            styles.iconActionText,
                            isLiked && styles.iconActionTextLiked,
                          ]}
                        >
                          {isLiked ? '♥' : '♡'}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setOpenSwapCardId(isSwapDrawerOpen ? null : exercise.id)
                      }
                      style={[
                        styles.swapActionBtn,
                        isSwapDrawerOpen && styles.swapActionBtnActive,
                      ]}
                    >
                      <Text style={styles.swapActionText}>⇄ Swap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setEditingModalData({
                          exercise,
                          dayIndex: activeDayIndex,
                          exerciseIndex: index,
                        })
                      }
                      style={styles.editActionBtn}
                    >
                      <Text style={styles.editActionText}>✎ Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDeleteExercise(index, exercise.name)}
                      style={styles.deleteActionBtn}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${exercise.name}`}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.deleteActionText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Inline Feedback Swap Reason Drawer */}
                {isSwapDrawerOpen && (
                  <View style={styles.swapReasonDrawer}>
                    {/* OPTION 1: CHOOSE DIRECTLY FROM LIBRARY */}
                    <TouchableOpacity
                      style={styles.chooseFromLibraryBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        setOpenSwapCardId(null);
                        setCatalogModalConfig({
                          visible: true,
                          mode: 'swap',
                          exerciseIndex: index,
                          swappingExercise: exercise,
                        });
                      }}
                    >
                      <View style={styles.chooseLibraryIconWrap}>
                        <Text style={styles.chooseLibraryIcon}>🔍</Text>
                      </View>
                      <View style={styles.chooseLibraryTextWrap}>
                        <Text style={styles.chooseLibraryTitle}>Choose from Exercise Library</Text>
                        <Text style={styles.chooseLibrarySubtitle}>
                          Browse 100+ exercises to select your preferred replacement
                        </Text>
                      </View>
                      <Text style={styles.chooseLibraryArrow}>➔</Text>
                    </TouchableOpacity>

                    <View style={styles.swapDividerRow}>
                      <View style={styles.swapDividerLine} />
                      <Text style={styles.swapDividerText}>OR INSTANT AI AUTO-SWAP</Text>
                      <View style={styles.swapDividerLine} />
                    </View>

                    <Text style={styles.swapDrawerTitle}>
                      Why swap this movement? (Trains your recommendation profile)
                    </Text>
                    <View style={styles.swapReasonsGrid}>
                      {SWAP_REASONS.map((reason) => (
                        <TouchableOpacity
                          key={reason.id}
                          activeOpacity={0.75}
                          onPress={() => handleSwapReasonSelect(index, reason.id)}
                          style={styles.swapReasonChip}
                        >
                          <Text style={styles.swapReasonLabel}>{reason.label}</Text>
                          <Text style={styles.swapReasonSub}>{reason.sub}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Visual SVG Diagram + Anatomical Muscle Map */}
                <ExerciseIllustrationSvg
                  svgType={exercise.svgType || 'squat'}
                  svgAccuracy={exercise.svgAccuracy || 'exact'}
                  svgNote={exercise.svgNote || null}
                  primaryMuscles={exercise.primaryMuscles || []}
                  secondaryMuscles={exercise.secondaryMuscles || []}
                />

                {/* Prescription Metrics Bar (Tappable to Edit) */}
                <TouchableOpacity
                  style={styles.prescriptionRow}
                  activeOpacity={0.75}
                  onPress={() =>
                    setEditingModalData({
                      exercise,
                      dayIndex: activeDayIndex,
                      exerciseIndex: index,
                    })
                  }
                >
                  <View style={styles.prescriptionItem}>
                    <Text style={styles.prescriptionLabel}>SETS</Text>
                    <Text style={styles.prescriptionValue}>{exercise.sets}</Text>
                  </View>
                  <View style={styles.prescriptionDivider} />
                  <View style={styles.prescriptionItem}>
                    <Text style={styles.prescriptionLabel}>
                      {exercise.prescriptionType === 'time' ? 'HOLD' : 'REPS'}
                    </Text>
                    <Text style={styles.prescriptionValue}>{exercise.reps}</Text>
                  </View>
                  <View style={styles.prescriptionDivider} />
                  <View style={styles.prescriptionItem}>
                    <Text style={styles.prescriptionLabel}>REST</Text>
                    <Text style={styles.prescriptionValue}>{exercise.restSeconds}s</Text>
                  </View>
                  {exercise.targetRir && (
                    <>
                      <View style={styles.prescriptionDivider} />
                      <View style={styles.prescriptionItem}>
                        <Text style={styles.prescriptionLabel}>EFFORT</Text>
                        <Text style={styles.prescriptionRirValue}>
                          {exercise.targetRir.split(' (')[0]}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.prescriptionDivider} />
                  <View style={styles.prescriptionEditIndicator}>
                    <Text style={styles.prescriptionEditIcon}>✎</Text>
                    <Text style={styles.prescriptionEditText}>Adjust</Text>
                  </View>
                </TouchableOpacity>

                {/* Form & Execution Cues (So Users Never Need to Google the Exercise) */}
                {exercise.formCues && exercise.formCues.length > 0 && (
                  <View style={styles.cuesContainer}>
                    <Text style={styles.cuesHeader}>EXECUTION & FORM CUES</Text>
                    {exercise.formCues.map((cue, cIdx) => (
                      <View key={cIdx} style={styles.cueRow}>
                        <Text style={styles.cueStepNum}>{cIdx + 1}.</Text>
                        <Text style={styles.cueText}>{cue}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Substitution Fallbacks (Filtered for User Setup & Joint Safety) */}
                {(() => {
                  const safeSubs = getSafeSubstitutions(exercise, {
                    location: logistics?.location,
                    exclusionZones: targeting?.exclusionZones,
                    dislikedExerciseIds: dislikedIds,
                    existingDayCatalogIds: (activeDay.exercises || []).map(
                      (e) => e.catalogId || e.id
                    ),
                  });
                  const displaySubs =
                    safeSubs.length > 0 ? safeSubs : exercise.substitutions || [];
                  if (displaySubs.length === 0) return null;
                  return (
                    <View style={styles.subsContainer}>
                      <Text style={styles.subsHeader}>DIRECT SUBSTITUTIONS</Text>
                      <View style={styles.subsRow}>
                        {displaySubs.map((sub, sIdx) => (
                          <TouchableOpacity
                            key={sIdx}
                            style={styles.subTag}
                            activeOpacity={0.7}
                            onPress={() => handleDirectSubstitutionTap(index, exercise, sub)}
                          >
                            <Text style={styles.subTagText}>⇄ {sub}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })()}
              </View>
            );
          })}
        </Animated.View>

        {/* Add Exercise to Day Button */}
        <TouchableOpacity
          style={styles.addExerciseToDayButton}
          activeOpacity={0.8}
          onPress={() =>
            setCatalogModalConfig({
              visible: true,
              mode: 'add',
              exerciseIndex: null,
              swappingExercise: null,
            })
          }
        >
          <View style={styles.addExerciseIconCircle}>
            <Text style={styles.addExerciseIconPlus}>＋</Text>
          </View>
          <View style={styles.addExerciseTextWrap}>
            <Text style={styles.addExerciseTitle}>
              Add Movement to {activeDay.dayLabel ? activeDay.dayLabel.split(':')[0] : `Day ${activeDayIndex + 1}`}
            </Text>
            <Text style={styles.addExerciseSubtitle}>
              Select from catalog exercises with illustrations & form cues
            </Text>
          </View>
        </TouchableOpacity>

        {/* Attribution & Health Disclaimer Footer */}
        <View style={styles.routineDisclaimerCard}>
          <Text style={styles.routineDisclaimerText}>
            <Text style={styles.routineDisclaimerBold}>Open-Source Attribution: </Text>
            Exercise and muscle taxonomy seeded from{' '}
            <Text
              style={styles.routineDisclaimerLink}
              onPress={() => Linking.openURL('https://wger.de')}
            >
              wger Workout Manager (wger.de)
            </Text>{' '}
            under CC-BY-SA / AGPL-3.0.
          </Text>
          <Text style={[styles.routineDisclaimerText, { marginTop: 4 }]}>
            <Text style={styles.routineDisclaimerBold}>Health Notice: </Text>
            For educational purposes only. Consult a physician before starting a new training program and stop immediately if you experience sharp joint pain.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.primaryButton, isDownloading && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={isDownloading}
          onPress={handleDownloadPdf}
        >
          {isDownloading ? (
            <View style={styles.buttonContentRow}>
              <ActivityIndicator size="small" color={Colors.textPrimary} />
              <Text style={styles.primaryButtonText}>Generating PDF...</Text>
            </View>
          ) : (
            <View style={styles.buttonContentRow}>
              <Text style={styles.downloadIcon}>↓</Text>
              <Text style={styles.primaryButtonText}>Download Program</Text>
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfBadgeText}>PDF</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Intake')}
        >
          <Text style={styles.secondaryButtonText}>Reconfigure Parameters</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Prescription Modal */}
      <EditPrescriptionModal
        visible={!!editingModalData}
        exercise={editingModalData?.exercise}
        onClose={() => setEditingModalData(null)}
        onRequestSwap={(exercise) => {
          const idx = editingModalData.exerciseIndex;
          setEditingModalData(null);
          setCatalogModalConfig({
            visible: true,
            mode: 'swap',
            exerciseIndex: idx,
            swappingExercise: exercise,
          });
        }}
        onSave={(updates) => {
          if (editingModalData) {
            updateExercisePrescription({
              dayIndex: editingModalData.dayIndex,
              exerciseIndex: editingModalData.exerciseIndex,
              ...updates,
            });
          }
        }}
      />

      {/* Exercise Catalog Modal (Handles both Adding & Swapping/Replacing) */}
      <AddExerciseModal
        visible={catalogModalConfig.visible}
        mode={catalogModalConfig.mode}
        swappingExercise={catalogModalConfig.swappingExercise}
        dayLabel={activeDay.dayLabel}
        existingCatalogIds={(activeDay.exercises || []).map(
          (e) => e.catalogId || e.id
        )}
        onClose={() => setCatalogModalConfig((prev) => ({ ...prev, visible: false }))}
        onSelectExercise={(catalogExercise) => {
          if (catalogModalConfig.mode === 'swap' && catalogModalConfig.exerciseIndex !== null) {
            replaceExerciseWithCatalogItem({
              dayIndex: activeDayIndex,
              exerciseIndex: catalogModalConfig.exerciseIndex,
              catalogExercise,
              keepPrescription: true,
            });
          } else {
            addExerciseToDay({
              dayIndex: activeDayIndex,
              catalogExercise,
            });
          }
        }}
      />

      {/* Confirmation & Alert Modal */}
      <ConfirmModal
        visible={!!confirmModalConfig}
        title={confirmModalConfig?.title}
        message={confirmModalConfig?.message}
        confirmText={confirmModalConfig?.confirmText}
        cancelText={confirmModalConfig?.cancelText}
        isDestructive={confirmModalConfig?.isDestructive}
        icon={confirmModalConfig?.icon}
        onConfirm={confirmModalConfig?.onConfirm}
        onCancel={confirmModalConfig?.onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  editedBadge: {
    backgroundColor: 'rgba(200, 70, 99, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editedBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  revertBtn: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
  },
  revertBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  programTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  programMeta: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  feedbackCalibrationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  feedbackMemoryPill: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  feedbackSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  intensityChipInactive: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.border,
  },
  intensityChipActive: {
    backgroundColor: 'rgba(200, 70, 99, 0.18)',
    borderColor: Colors.primary,
  },
  intensityChipLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  intensityChipLabelInactive: {
    color: Colors.textSecondary,
  },
  intensityChipLabelActive: {
    color: Colors.textPrimary,
  },
  intensityChipSub: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
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
    minWidth: 104,
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
  dayHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dayStatsPill: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayStatsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  daySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  warmupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
    overflow: 'hidden',
  },
  warmupHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  warmupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  warmupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  warmupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  warmupToggle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  warmupBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  warmupPrimer: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  mobilityList: {
    gap: 6,
  },
  mobilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  mobilityText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  exerciseList: {
    gap: 14,
  },
  emptyExercisesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyExercisesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyExercisesSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swappedBanner: {
    backgroundColor: 'rgba(78, 159, 116, 0.16)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(78, 159, 116, 0.35)',
  },
  swappedBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  exerciseTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  indexReorderCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  reorderArrowBtn: {
    width: 22,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderArrowBtnDisabled: {
    opacity: 0.25,
  },
  reorderArrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  reorderArrowTextDisabled: {
    color: Colors.textMuted,
  },
  exerciseIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  exerciseIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  exerciseTitleBlock: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  taxonomyMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  focusBoostBadge: {
    backgroundColor: 'rgba(200, 70, 99, 0.24)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  focusBoostBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  stretchBadge: {
    backgroundColor: 'rgba(78, 159, 116, 0.2)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(78, 159, 116, 0.45)',
  },
  stretchBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.3,
  },
  patternBadge: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  patternBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  musclePrimaryBadge: {
    backgroundColor: 'rgba(200, 70, 99, 0.18)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  musclePrimaryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  muscleSecondaryBadge: {
    backgroundColor: 'rgba(125, 79, 56, 0.25)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  muscleSecondaryBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#E09F67',
  },
  feedbackButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconActionBtnLiked: {
    backgroundColor: 'rgba(200, 70, 99, 0.2)',
    borderColor: Colors.primary,
  },
  iconActionText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  iconActionTextLiked: {
    color: Colors.primary,
  },
  swapActionBtn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swapActionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  swapActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editActionBtn: {
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  deleteActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  deleteActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.error,
  },
  swapReasonDrawer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
  },
  swapDrawerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  swapReasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swapReasonChip: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swapReasonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  swapReasonSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chooseFromLibraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 70, 99, 0.16)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 10,
  },
  chooseLibraryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseLibraryIcon: {
    fontSize: 13,
  },
  chooseLibraryTextWrap: {
    flex: 1,
  },
  chooseLibraryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  chooseLibrarySubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  chooseLibraryArrow: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  swapDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 8,
  },
  swapDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  swapDividerText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
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
  prescriptionRirValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 3,
  },
  prescriptionDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  prescriptionEditIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
  },
  prescriptionEditIcon: {
    fontSize: 10,
    color: Colors.primary,
  },
  prescriptionEditText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  cuesContainer: {
    backgroundColor: 'rgba(31, 17, 36, 0.45)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cuesHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  cueStepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    width: 14,
  },
  cueText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    flex: 1,
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
  addExerciseToDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 70, 99, 0.35)',
    borderStyle: 'dashed',
    marginTop: 6,
    marginBottom: 10,
    gap: 12,
  },
  addExerciseIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addExerciseIconPlus: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: -1,
  },
  addExerciseTextWrap: {
    flex: 1,
  },
  addExerciseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  addExerciseSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  routineDisclaimerCard: {
    backgroundColor: 'rgba(41, 22, 48, 0.55)',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routineDisclaimerText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: Colors.textMuted,
  },
  routineDisclaimerBold: {
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  routineDisclaimerLink: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadIcon: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: -2,
  },
  pdfBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 2,
  },
  pdfBadgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
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
