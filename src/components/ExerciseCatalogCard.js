import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MOVEMENT_PATTERNS, MUSCLE_GROUPS } from '../data/wgerExerciseCatalog.js';
import styles from './AddExerciseModal.styles';

export default function ExerciseCatalogCard({
  item,
  isSwapMode = false,
  isCurrentSwapping = false,
  isAlreadyAdded = false,
  exclusionZones = [],
  onSelect,
}) {
  const isDisabled = isCurrentSwapping || isAlreadyAdded;

  const patternMeta = Object.values(MOVEMENT_PATTERNS).find(
    (p) => p.id === item.movementPattern
  );
  const primaryMuscleLabels = (item.primaryMuscles || []).map(
    (m) => MUSCLE_GROUPS[m]?.label || m
  );
  const conflictingJoints = (item.jointStress || []).filter((j) =>
    exclusionZones.some((ez) => ez.toLowerCase() === j.toLowerCase())
  );

  return (
    <View style={[styles.exerciseCard, isCurrentSwapping && styles.currentExerciseCard]}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <View style={styles.cardMetaRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{item.category}</Text>
          </View>
          {patternMeta && (
            <View style={styles.patternPill}>
              <Text style={styles.patternPillText}>{patternMeta.label}</Text>
            </View>
          )}
          <View style={styles.difficultyPill}>
            <Text style={styles.difficultyPillText}>
              {item.difficulty?.toUpperCase()}
            </Text>
          </View>
          {item.stretchBiased && (
            <View style={styles.stretchPill}>
              <Text style={styles.stretchPillText}>↔ Stretch-Biased</Text>
            </View>
          )}
          {conflictingJoints.length > 0 && (
            <View style={styles.warningPill}>
              <Text style={styles.warningPillText}>
                {`⚠ Stresses: ${conflictingJoints.join(', ')}`}
              </Text>
            </View>
          )}
        </View>

        {primaryMuscleLabels.length > 0 && (
          <Text style={styles.muscleTargetText} numberOfLines={1}>
            Targets: {primaryMuscleLabels.join(', ')}
          </Text>
        )}

        {item.equipment && item.equipment.length > 0 && (
          <Text style={styles.equipmentText} numberOfLines={1}>
            Equipment: {item.equipment.join(' • ')}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.addBtn,
          isSwapMode && styles.swapSelectBtn,
          isDisabled && styles.addBtnDisabled,
        ]}
        activeOpacity={0.75}
        disabled={isDisabled}
        onPress={() => onSelect(item)}
      >
        <Text
          style={[
            styles.addBtnText,
            isDisabled && styles.addBtnTextDisabled,
          ]}
        >
          {isCurrentSwapping
            ? 'Current'
            : isAlreadyAdded
            ? 'In Workout'
            : isSwapMode
            ? '⇄ Swap'
            : '＋ Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

