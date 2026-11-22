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
  const hasSaved =
    Boolean(generatedRoutine) &&
    Array.isArray(generatedRoutine.schedule) &&
    generatedRoutine.schedule.length > 0;

  if (!hasSaved) {
    return (
      <Animated.View
        style={[
          styles.topHeaderRow,
          styles.topHeaderRowCompact,
          {
            opacity: entranceHeroAnim,
            transform: [{ translateY: entranceHeroSlide }],
          },
        ]}
      >
        <View style={styles.topHeaderInfo}>
          <View style={styles.topHeaderBadgeRow}>
            <Text style={styles.eyebrowWide}>FIG TRAINING SYSTEM</Text>
          </View>
          <Text style={styles.topHeaderTitle}>8-Week Periodized Blueprint</Text>
          <Text style={styles.topHeaderMeta}>
            Calibrated volume, joint-safe movement selection, and progressive overload built for your space.
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.topHeaderRow,
        {
          opacity: entranceHeroAnim,
          transform: [{ translateY: entranceHeroSlide }],
        },
      ]}
    >
      <View style={styles.topHeaderInfo}>
        <View style={styles.topHeaderBadgeRow}>
          <Text style={styles.eyebrowWide}>ACTIVE BLUEPRINT SAVED</Text>
          {isEdited && (
            <View style={styles.savedEditedBadge}>
              <Text style={styles.savedEditedBadgeText}>EDITED</Text>
            </View>
          )}
        </View>
        <Text style={styles.topHeaderTitle} numberOfLines={2}>
          {generatedRoutine.programName || '8-Week Hypertrophy Blueprint'}
        </Text>
        <Text style={styles.topHeaderMeta}>
          {generatedRoutine.schedule.length} days / week • Ready to train or export to PDF.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.viewPlanBtn}
        activeOpacity={0.85}
        onPress={onViewPlan}
        accessibilityRole="button"
        accessibilityLabel="View saved workout plan"
      >
        <Text style={styles.viewPlanBtnText}>View Plan</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
