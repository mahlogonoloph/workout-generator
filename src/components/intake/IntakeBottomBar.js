import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function IntakeBottomBar({
  insetsBottom = 0,
  hasExistingRoutine = false,
  onGenerate,
}) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insetsBottom, 16) }]}>
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={onGenerate}
      >
        <Text style={styles.primaryButtonText}>
          {hasExistingRoutine ? 'Generate New Routine' : 'Generate Routine'}
        </Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

