import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export default function RoutineHero({
  userProfile,
  logistics,
  isEdited,
  originalGeneratedRoutine,
  programName,
  scheduleLength,
  onResetToOriginal,
}) {
  return (
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
        {isEdited && (
          <View style={styles.editedBadge}>
            <Text style={styles.editedBadgeText}>CUSTOMIZED</Text>
          </View>
        )}
      </View>

      <View style={styles.heroTitleRow}>
        <Text style={styles.programTitle}>{programName}</Text>
        {isEdited && originalGeneratedRoutine && (
          <TouchableOpacity
            style={styles.revertBtn}
            activeOpacity={0.7}
            onPress={onResetToOriginal}
          >
            <Text style={styles.revertBtnText}>↺ Reset to original Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.programMeta}>
        {scheduleLength} Days / Week • {logistics?.durationMinutes || 60} min sessions •{' '}
        {userProfile?.cycleLengthWeeks || 8} Week Block
      </Text>
    </View>
  );
}

