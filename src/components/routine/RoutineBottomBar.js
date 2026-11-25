import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import styles from '../../screens/RoutineScreen.styles';

export default function RoutineBottomBar({
  insetsBottom = 0,
  isDownloading = false,
  isCycleActive = false,
  currentDayNumber = 1,
  onStartOrOpenToday,
  onDownloadPdf,
  onReconfigure,
}) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insetsBottom, 16) }]}>
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={onStartOrOpenToday}
      >
        <View style={styles.buttonContentRow}>
          <Text style={styles.primaryButtonText}>
            {isCycleActive
              ? `Today’s Workout (Day ${currentDayNumber})`
              : 'Start Program Cycle'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, isDownloading && styles.primaryButtonDisabled]}
        activeOpacity={0.7}
        disabled={isDownloading}
        onPress={onDownloadPdf}
      >
        {isDownloading ? (
          <View style={styles.buttonContentRow}>
            <ActivityIndicator size="small" color={Colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Generating PDF...</Text>
          </View>
        ) : (
          <Text style={styles.secondaryButtonText}>Download Program PDF</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.7}
        onPress={onReconfigure}
      >
        <Text style={styles.secondaryButtonText}>Reconfigure Parameters</Text>
      </TouchableOpacity>
    </View>
  );
}

