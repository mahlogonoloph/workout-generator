import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export default function WarmupCard({ warmupRoutine }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!warmupRoutine) return null;

  return (
    <View style={styles.warmupCard}>
      <TouchableOpacity
        style={styles.warmupHeaderButton}
        activeOpacity={0.7}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <View style={styles.warmupTitleRow}>
          <View style={styles.warmupDot} />
          <Text style={styles.warmupTitle}>Warmup & Movement Prep</Text>
        </View>
        <Text style={styles.warmupToggle}>
          {isExpanded ? 'Collapse ↑' : 'View ↓'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.warmupBody}>
          {warmupRoutine.cardioPrimer ? (
            <Text style={styles.warmupPrimer}>{warmupRoutine.cardioPrimer}</Text>
          ) : null}
          <View style={styles.mobilityList}>
            {(warmupRoutine.dynamicMobility || []).map((item, mIdx) => (
              <View key={mIdx} style={styles.mobilityRow}>
                <View style={styles.bullet} />
                <Text style={styles.mobilityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

