import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import {
  StackedPeriodizationBars,
  CalendarOutlineIcon,
  MicroArrowUpIcon,
} from './IntakeGraphics';

export default function ArchitectureMetricBar({
  estimatedWeeklySets = 72,
  selectedFrequency = 4,
  selectedLocation = 'Commercial Gym',
  selectedDuration = 60,
  selectedExclusions = [],
  entranceHeroAnim,
  entranceHeroSlide,
}) {
  const peakSets = Math.round(estimatedWeeklySets * 1.2);
  const deloadSets = Math.round(estimatedWeeklySets * 0.7);
  const totalBlockSets = estimatedWeeklySets * 8;

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

      {/* Second Row: Concise Subtitle + Joint Safety Active Indicator */}
      <View style={styles.glassSubRow}>
        <Text style={styles.glassSubtitle}>
          Calibrated volume, exercise selection, and joint-safe periodization.
        </Text>
        <Text style={styles.jointSafetyTag}>
          {selectedExclusions.length > 0
            ? `${selectedExclusions.length} JOINT SHIELD${selectedExclusions.length > 1 ? 'S' : ''}`
            : 'JOINT SAFETY ACTIVE'}
        </Text>
      </View>

      {/* Hairline Divider */}
      <View style={styles.glassDivider} />

      {/* Bottom Split: Stacked Bar Chart Well + Live Blueprint Summary */}
      <View style={styles.glassSplitRow}>
        <View style={styles.chartWell}>
          <StackedPeriodizationBars
            estimatedWeeklySets={estimatedWeeklySets}
            selectedFrequency={selectedFrequency}
          />
        </View>

        <View style={styles.summaryCol}>
          <View>
            <Text style={styles.summaryEyebrow}>LIVE BLUEPRINT SUMMARY</Text>
            <Text style={styles.summaryMainVal}>
              ~{estimatedWeeklySets} Sets / Wk • {selectedFrequency} Days • {selectedLocation}
            </Text>
          </View>

          <View style={styles.telemetryList}>
            <View style={styles.telemetryRow}>
              <View style={styles.telemetryCodeWrap}>
                <Text style={styles.telemetryCode}>W7</Text>
                <MicroArrowUpIcon size={8} />
              </View>
              <Text style={styles.telemetryText} numberOfLines={1}>
                Peak: ~{peakSets} sets/wk
              </Text>
            </View>

            <View style={styles.telemetryRow}>
              <View style={styles.telemetryCodeWrap}>
                <Text style={styles.telemetryCode}>W4</Text>
                <MicroArrowUpIcon size={8} />
              </View>
              <Text style={styles.telemetryText} numberOfLines={1}>
                Deload: ~{deloadSets} sets
              </Text>
            </View>

            <View style={styles.telemetryRow}>
              <View style={styles.telemetryCodeWrap}>
                <Text style={styles.telemetryCode}>8W</Text>
                <MicroArrowUpIcon size={8} />
              </View>
              <Text style={styles.telemetryText} numberOfLines={1}>
                Total: ~{totalBlockSets} sets
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
