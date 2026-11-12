import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';
import { downloadWorkoutPdf } from '../utils/generateWorkoutPdf';
import EditPrescriptionModal from '../components/EditPrescriptionModal';
import AddExerciseModal from '../components/AddExerciseModal';
import ConfirmModal from '../components/ConfirmModal';
import { WGER_EXERCISE_CATALOG } from '../data/wgerExerciseCatalog.js';
import { getSafeSubstitutions } from '../api/generationClient.js';

import RoutineHero from '../components/routine/RoutineHero';
import FeedbackCalibrationCard from '../components/routine/FeedbackCalibrationCard';
import DaySelectorTabs from '../components/routine/DaySelectorTabs';
import WarmupCard from '../components/routine/WarmupCard';
import ExerciseCard from '../components/routine/ExerciseCard';
import RoutineDisclaimer from '../components/routine/RoutineDisclaimer';
import RoutineBottomBar from '../components/routine/RoutineBottomBar';
import styles from './RoutineScreen.styles';

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
        exercises: [],
      },
    ],
  };

  const schedule = routine.schedule || [];
  const [activeDayIndex, setActiveDayIndex] = useState(0);
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
        <RoutineHero
          userProfile={userProfile}
          logistics={logistics}
          isEdited={isEdited}
          originalGeneratedRoutine={originalGeneratedRoutine}
          programName={routine.programName}
          scheduleLength={schedule.length}
          onResetToOriginal={handleResetToOriginal}
        />

        {/* Feedback Loop & Volume Calibration Card */}
        <FeedbackCalibrationCard
          likedCount={likedIds.length}
          dislikedCount={dislikedIds.length}
          intensityRating={intensityRating}
          onSelectIntensity={setIntensityRating}
        />

        {/* Schedule Day Selector Tabs */}
        <DaySelectorTabs
          schedule={schedule}
          activeDayIndex={activeDayIndex}
          onSelectDay={handleDaySelect}
        />

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
        <WarmupCard warmupRoutine={routine.warmupRoutine} />

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

            return (
              <ExerciseCard
                key={exercise.id || index}
                exercise={exercise}
                index={index}
                isFirst={index === 0}
                isLast={index === (activeDay.exercises?.length - 1)}
                isLiked={isLiked}
                isSwapDrawerOpen={isSwapDrawerOpen}
                animatingHeartKey={animatingHeartKey}
                heartPopAnim={heartPopAnim}
                safeSubstitutions={displaySubs}
                onReorder={(fromIdx, toIdx) =>
                  reorderExercise({
                    dayIndex: activeDayIndex,
                    fromIndex: fromIdx,
                    toIndex: toIdx,
                  })
                }
                onLikeToggle={handleLikeToggle}
                onToggleSwapDrawer={() =>
                  setOpenSwapCardId(isSwapDrawerOpen ? null : exercise.id)
                }
                onOpenEditModal={() =>
                  setEditingModalData({
                    exercise,
                    dayIndex: activeDayIndex,
                    exerciseIndex: index,
                  })
                }
                onDeleteExercise={() =>
                  handleDeleteExercise(index, exercise.name)
                }
                onChooseFromLibrary={() => {
                  setOpenSwapCardId(null);
                  setCatalogModalConfig({
                    visible: true,
                    mode: 'swap',
                    exerciseIndex: index,
                    swappingExercise: exercise,
                  });
                }}
                onSelectSwapReason={(reasonId) =>
                  handleSwapReasonSelect(index, reasonId)
                }
                onDirectSubstitutionTap={(sub) =>
                  handleDirectSubstitutionTap(index, exercise, sub)
                }
              />
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
        <RoutineDisclaimer />
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <RoutineBottomBar
        insetsBottom={insets.bottom}
        isDownloading={isDownloading}
        onDownloadPdf={handleDownloadPdf}
        onReconfigure={() => navigation.navigate('Intake')}
      />

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
