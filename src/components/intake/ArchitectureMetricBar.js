import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import { PeriodizationWaveChart } from './IntakeGraphics';

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
          <Text style={styles.architectureSub}>LIVE BLUEPRINT SUMMARY</Text>
          <Text style={styles.architectureMainVal}>
            ~{estimatedWeeklySets} Sets / Wk • {selectedFrequency} Days • {selectedLocation}
          </Text>
        </View>
        <View style={styles.architectureShieldBadge}>
          <Text style={styles.architectureShieldText}>
            {selectedExclusions.length > 0
              ? `🛡 ${selectedExclusions.length} Shield(s)`
              : '🛡 Joint Safety Active'}
          </Text>
        </View>
      </View>

      {/* 8-Week Sports Science Periodization Wave Visual Chart */}
      <PeriodizationWaveChart
        estimatedWeeklySets={estimatedWeeklySets}
        selectedFrequency={selectedFrequency}
      />
    </Animated.View>
  );
}
