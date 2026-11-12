import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import styles from '../../screens/RoutineScreen.styles';

export default function RoutineBottomBar({
  insetsBottom = 0,
  isDownloading = false,
  onDownloadPdf,
  onReconfigure,
}) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insetsBottom, 16) }]}>
      <TouchableOpacity
        style={[styles.primaryButton, isDownloading && styles.primaryButtonDisabled]}
        activeOpacity={0.85}
        disabled={isDownloading}
        onPress={onDownloadPdf}
      >
        {isDownloading ? (
          <View style={styles.buttonContentRow}>
            <ActivityIndicator size="small" color={Colors.textPrimary} />
            <Text style={styles.primaryButtonText}>Generating PDF...</Text>
          </View>
        ) : (
          <View style={styles.buttonContentRow}>
            <Text style={styles.downloadIcon}>↓</Text>
            <Text style={styles.primaryButtonText}>Download Program</Text>
            <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View>
          </View>
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

