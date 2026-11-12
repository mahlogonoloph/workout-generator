import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function FeedbackMemoryBanner({
  hasFeedbackMemory,
  likedCount = 0,
  dislikedCount = 0,
  intensityRating = 'OPTIMAL',
  onResetFeedback,
}) {
  if (!hasFeedbackMemory) return null;

  return (
    <View style={styles.feedbackMemoryCard}>
      <View style={styles.feedbackMemoryHeader}>
        <Text style={styles.feedbackMemoryTitle}>Learned User Preferences Active</Text>
        <TouchableOpacity onPress={onResetFeedback} activeOpacity={0.7}>
          <Text style={styles.feedbackResetBtn}>Reset Memory</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.feedbackMemoryDesc}>
        • {likedCount} Favorited movement(s) prioritized{'\n'}
        • {dislikedCount} Disliked/Swapped movement(s) excluded{'\n'}
        • Volume Calibration: {(intensityRating || 'OPTIMAL').toUpperCase()}
      </Text>
    </View>
  );
}

