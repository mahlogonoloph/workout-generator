import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import {
  StackedPeriodizationBars,
  CalendarOutlineIcon,
} from './IntakeGraphics';

export default function ArchitectureMetricBar({
  estimatedWeeklySets = 72,
  selectedFrequency = 4,
  selectedLocation = 'Commercial Gym',
  selectedExclusions = [],
  entranceHeroAnim,
  entranceHeroSlide,
}) {
  const peakSets = Math.round(estimatedWeeklySets * 1.2);
  const deloadSets = Math.round(estimatedWeeklySets * 0.7);

  return (
    <Animated.View
      style={[
        styles.glassBlueprintCard,
        {
          opacity: entranceHeroAnim,
          transform: [{ translateY: entranceHeroSlide }],
        },
      ]}
    >
      {/* Top Row: Program Title + Calendar Icon */}
      <View style={styles.glassHeaderRow}>
        <Text style={styles.glassTitle}>Design Your 8-Week Program</Text>
        <CalendarOutlineIcon size={16} color="#FFFFFF" />
      </View>

      {/* Single Clean Status Line */}
      <View style={styles.glassStatusRow}>
        <Text style={styles.jointSafetyTag}>
          {selectedExclusions.length > 0
            ? `${selectedExclusions.length} JOINT SHIELD${selectedExclusions.length > 1 ? 'S' : ''} ACTIVE`
            : 'JOINT SAFETY ACTIVE'}
        </Text>
      </View>

      {/* Hairline Divider */}
      <View style={styles.glassDivider} />

      {/* Bottom Split: Stacked Bar Chart Well + Concise Blueprint Summary */}
      <View style={styles.glassSplitRow}>
        <View style={styles.chartWell}>
          <StackedPeriodizationBars
            estimatedWeeklySets={estimatedWeeklySets}
            selectedFrequency={selectedFrequency}
          />
        </View>

        <View style={styles.summaryCol}>
          <View>
            <Text style={styles.summaryEyebrow}>LIVE BLUEPRINT</Text>
            <Text style={styles.summaryMainVal}>
              ~{estimatedWeeklySets} Sets / Wk
            </Text>
            <Text style={styles.summaryMetaLine}>
              {selectedFrequency} Days • {selectedLocation}
            </Text>
          </View>

          <Text style={styles.summaryPeriodLine}>
            Deload W4 (~{deloadSets}) • Peak W7 (~{peakSets})
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
