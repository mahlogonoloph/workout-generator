import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function SavedRoutineBanner({
  generatedRoutine,
  isEdited,
  entranceHeroAnim,
  entranceHeroSlide,
  onViewPlan,
}) {
  if (!generatedRoutine || !Array.isArray(generatedRoutine.schedule) || generatedRoutine.schedule.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.savedRoutineBanner,
        {
          opacity: entranceHeroAnim,
          transform: [{ translateY: entranceHeroSlide }],
        },
      ]}
    >
      <View style={styles.savedRoutineInfo}>
        <View style={styles.savedRoutineBadgeRow}>
          <Text style={styles.savedRoutineEyebrow}>ACTIVE BLUEPRINT SAVED</Text>
          {isEdited && (
            <View style={styles.savedEditedBadge}>
              <Text style={styles.savedEditedBadgeText}>CUSTOMIZED</Text>
            </View>
          )}
        </View>
        <Text style={styles.savedRoutineTitle} numberOfLines={1}>
          {generatedRoutine.programName || 'Your 8-Week Routine'}
        </Text>
        <Text style={styles.savedRoutineMeta}>
          {generatedRoutine.schedule.length} Days / Week • Ready to view or export PDF
        </Text>
      </View>
      <TouchableOpacity
        style={styles.resumeRoutineBtn}
        activeOpacity={0.8}
        onPress={onViewPlan}
      >
        <Text style={styles.resumeRoutineBtnText}>View Plan →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

