import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function IntakeBottomBar({
  insetsBottom = 0,
  hasExistingRoutine = false,
  summaryText = '',
  onGenerate,
}) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insetsBottom, 16) }]}>
      {Boolean(summaryText) && (
        <Text style={styles.bottomBarSummary} numberOfLines={1}>
          Ready: {summaryText}
        </Text>
      )}
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={onGenerate}
        accessibilityRole="button"
        accessibilityLabel={hasExistingRoutine ? 'Generate New Routine' : 'Generate Routine'}
      >
        <Text style={styles.primaryButtonText}>
          {hasExistingRoutine ? 'Generate New Routine' : 'Generate Routine'}
        </Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}
