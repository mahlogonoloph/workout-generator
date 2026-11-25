import React, { useState, useEffect } from 'react';
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
  initialExpanded = false,
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
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  useEffect(() => {
    if (initialExpanded) {
      setIsExpanded(true);
    }
  }, [initialExpanded]);
  const showDetails = isExpanded || isSwapDrawerOpen;

  const catalogKey = exercise.catalogId || exercise.id;
  const isHeartAnimating = animatingHeartKey === catalogKey;

  const primaryMuscle = (exercise.primaryMuscleLabels || [])[0];
  const movementPattern = exercise.movementPatternLabel;

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

      {/* Calm Scannable Header: Index, Name, Primary Muscle, Favorite & Expand Toggle */}
      <View style={styles.exerciseTopRow}>
        <View style={styles.exerciseIndexBadge}>
          <Text style={styles.exerciseIndexText}>{index + 1}</Text>
        </View>

        <TouchableOpacity
          style={styles.exerciseTitleBlock}
          activeOpacity={0.75}
          onPress={() => setIsExpanded((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={`Toggle details for ${exercise.name}`}
        >
          <Text style={styles.exerciseName} numberOfLines={2}>
            {exercise.name}
          </Text>

          <View style={styles.taxonomyMetaRow}>
            {primaryMuscle && (
              <View style={styles.musclePrimaryBadge}>
                <Text style={styles.musclePrimaryBadgeText}>{primaryMuscle}</Text>
              </View>
            )}
            {movementPattern && showDetails && (
              <View style={styles.patternBadge}>
                <Text style={styles.patternBadgeText}>
                  {movementPattern.toUpperCase()}
                </Text>
              </View>
            )}
            {exercise.isFocusBoosted && (
              <View style={styles.focusBoostBadge}>
                <Text style={styles.focusBoostBadgeText}>FOCUS +1 SET</Text>
              </View>
            )}
            {exercise.stretchBiased && showDetails && (
              <View style={styles.stretchBadge}>
                <Text style={styles.stretchBadgeText}>STRETCH</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.feedbackButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onLikeToggle(catalogKey)}
            style={[styles.iconActionBtn, isLiked && styles.iconActionBtnLiked]}
            accessibilityLabel="Favorite exercise"
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
            activeOpacity={0.75}
            onPress={() => setIsExpanded((prev) => !prev)}
            style={styles.detailsToggleBtn}
            accessibilityRole="button"
            accessibilityLabel={showDetails ? 'Hide exercise details' : 'Show exercise details'}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails ? 'Hide ↑' : 'Details ↓'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary Gym-Floor Data: Prescription Metrics Bar (Always Visible, Tappable to Edit) */}
      <PrescriptionBar
        exercise={exercise}
        onPress={onOpenEditModal}
      />

      {/* Progressive Disclosure: Actions, Diagrams, Form Cues & Substitutions */}
      {showDetails && (
        <View style={styles.expandedDetailsContainer}>
          {/* Compact Action Toolbar */}
          <View style={styles.expandedActionsRow}>
            <View style={styles.reorderGroup}>
              <TouchableOpacity
                style={[styles.miniToolBtn, isFirst && styles.reorderArrowBtnDisabled]}
                activeOpacity={0.65}
                disabled={isFirst}
                onPress={() => onReorder(index, index - 1)}
                accessibilityRole="button"
                accessibilityLabel="Move exercise up"
              >
                <Text style={styles.miniToolBtnText}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.miniToolBtn, isLast && styles.reorderArrowBtnDisabled]}
                activeOpacity={0.65}
                disabled={isLast}
                onPress={() => onReorder(index, index + 1)}
                accessibilityRole="button"
                accessibilityLabel="Move exercise down"
              >
                <Text style={styles.miniToolBtnText}>▼</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onToggleSwapDrawer}
              style={[
                styles.swapActionBtn,
                isSwapDrawerOpen && styles.swapActionBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.swapActionText,
                  isSwapDrawerOpen && styles.swapActionTextActive,
                ]}
              >
                ⇄ Swap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenEditModal}
              style={styles.editActionBtn}
            >
              <Text style={styles.editActionText}>Edit Sets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDeleteExercise}
              style={styles.deleteActionBtn}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${exercise.name}`}
            >
              <Text style={styles.deleteActionText}>✕</Text>
            </TouchableOpacity>
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
            compact={true}
          />

          {/* Form & Execution Cues */}
          {exercise.formCues && exercise.formCues.length > 0 && (
            <View style={styles.cuesContainer}>
              <Text style={styles.cuesHeader}>EXECUTION &amp; FORM CUES</Text>
              {exercise.formCues.map((cue, cIdx) => (
                <View key={cIdx} style={styles.cueRow}>
                  <Text style={styles.cueStepNum}>{cIdx + 1}.</Text>
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Secondary Muscles Breakdown */}
          {exercise.secondaryMuscleLabels && exercise.secondaryMuscleLabels.length > 0 && (
            <View style={styles.secondaryMusclesRow}>
              <Text style={styles.secondaryMusclesLabel}>Secondary Synergy:</Text>
              <Text style={styles.secondaryMusclesText}>
                {exercise.secondaryMuscleLabels.join(', ')}
              </Text>
            </View>
          )}

          {/* Substitution Fallbacks */}
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
      )}
    </View>
  );
}
