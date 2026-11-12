import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function ArchitectureMetricBar({
  estimatedWeeklySets = 0,
  selectedFrequency = 4,
  selectedLocation = 'Commercial Gym',
  selectedExclusions = [],
  volumeMeterWidth,
  entranceHeroAnim,
  entranceHeroSlide,
}) {
  return (
    <Animated.View
      style={[
        styles.architectureCard,
        {
          opacity: entranceHeroAnim,
          transform: [{ translateY: entranceHeroSlide }],
        },
      ]}
    >
      <View style={styles.architectureHeaderRow}>
        <View style={styles.architectureTitleWrap}>
          <Text style={styles.architectureSub}>CALCULATED ARCHITECTURE</Text>
          <Text style={styles.architectureMainVal}>
            ~{estimatedWeeklySets} Sets / Wk • {selectedFrequency} Days/Wk
          </Text>
        </View>
        <View style={styles.architectureBadge}>
          <Text style={styles.architectureBadgeText}>{selectedLocation}</Text>
        </View>
      </View>

      {/* Volume progress meter */}
      <View style={styles.volumeMeterTrack}>
        <Animated.View style={[styles.volumeMeterFill, { width: volumeMeterWidth }]} />
      </View>

      <View style={styles.architectureFooterRow}>
        <Text style={styles.architectureFooterText}>
          8-Week Total: ~{estimatedWeeklySets * 8} Working Sets
        </Text>
        <Text style={styles.architectureShieldText}>
          {selectedExclusions.length > 0
            ? `🛡 ${selectedExclusions.length} Joint Shield(s)`
            : '🛡 Joint Safety Active'}
        </Text>
      </View>
    </Animated.View>
  );
}

