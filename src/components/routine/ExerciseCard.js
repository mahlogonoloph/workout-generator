import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import ExerciseIllustrationSvg from '../ExerciseIllustrationSvg';
import PrescriptionBar from './PrescriptionBar';
import SwapReasonDrawer from './SwapReasonDrawer';
import styles from '../../screens/RoutineScreen.styles';

export default function ExerciseCard({
  exercise,
  index,
  isFirst = false,
  isLast = false,
  isLiked = false,
  isSwapDrawerOpen = false,
  animatingHeartKey = null,
  heartPopAnim = null,
  safeSubstitutions = [],
  onReorder,
  onLikeToggle,
  onToggleSwapDrawer,
  onOpenEditModal,
  onDeleteExercise,
  onChooseFromLibrary,
  onSelectSwapReason,
  onDirectSubstitutionTap,
}) {
  const catalogKey = exercise.catalogId || exercise.id;
  const isHeartAnimating = animatingHeartKey === catalogKey;

  return (
    <View style={styles.exerciseCard}>
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
            style={[styles.reorderArrowBtn, isFirst && styles.reorderArrowBtnDisabled]}
            activeOpacity={0.6}
            disabled={isFirst}
            onPress={() => onReorder(index, index - 1)}
            accessibilityRole="button"
            accessibilityLabel="Move exercise up"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={[styles.reorderArrowText, isFirst && styles.reorderArrowTextDisabled]}>
              ▲
            </Text>
          </TouchableOpacity>

          <View style={styles.exerciseIndexBadge}>
            <Text style={styles.exerciseIndexText}>{index + 1}</Text>
          </View>

          <TouchableOpacity
            style={[styles.reorderArrowBtn, isLast && styles.reorderArrowBtnDisabled]}
            activeOpacity={0.6}
            disabled={isLast}
            onPress={() => onReorder(index, index + 1)}
            accessibilityRole="button"
            accessibilityLabel="Move exercise down"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={[styles.reorderArrowText, isLast && styles.reorderArrowTextDisabled]}>
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
            onPress={() => onLikeToggle(catalogKey)}
            style={[styles.iconActionBtn, isLiked && styles.iconActionBtnLiked]}
          >
            <Animated.View
              style={
                isHeartAnimating && heartPopAnim
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
            onPress={onToggleSwapDrawer}
            style={[
              styles.swapActionBtn,
              isSwapDrawerOpen && styles.swapActionBtnActive,
            ]}
          >
            <Text style={styles.swapActionText}>⇄ Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenEditModal}
            style={styles.editActionBtn}
          >
            <Text style={styles.editActionText}>✎ Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDeleteExercise}
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
        <SwapReasonDrawer
          onChooseFromLibrary={onChooseFromLibrary}
          onSelectSwapReason={onSelectSwapReason}
        />
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
      <PrescriptionBar
        exercise={exercise}
        onPress={onOpenEditModal}
      />

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
      {safeSubstitutions.length > 0 && (
        <View style={styles.subsContainer}>
          <Text style={styles.subsHeader}>DIRECT SUBSTITUTIONS</Text>
          <View style={styles.subsRow}>
            {safeSubstitutions.map((sub, sIdx) => (
              <TouchableOpacity
                key={sIdx}
                style={styles.subTag}
                activeOpacity={0.7}
                onPress={() => onDirectSubstitutionTap(sub)}
              >
                <Text style={styles.subTagText}>⇄ {sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

