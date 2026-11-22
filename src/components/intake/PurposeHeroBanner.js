import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function PurposeHeroBanner({
  entranceHeroAnim,
  entranceHeroSlide,
  beaconPulse,
  beaconOpacity,
}) {
  return (
    <Animated.View
      style={[
        styles.purposeHeroBanner,
        {
          opacity: entranceHeroAnim,
          transform: [{ translateY: entranceHeroSlide }],
        },
      ]}
    >
      <View style={styles.purposeTagRow}>
        <View style={styles.purposeBeaconDot}>
          <Animated.View
            style={[
              styles.purposeBeaconPulse,
              {
                transform: [{ scale: beaconPulse }],
                opacity: beaconOpacity,
              },
            ]}
          />
        </View>
        <Text style={styles.purposeTagLabel}>FIG TRAINING ENGINE • ZERO-DISTRACTION</Text>
      </View>
      <Text style={styles.purposeStatementText}>
        Generate a clean, distraction-free 8-Week Physical Training Binder &amp; Printable PDF.
      </Text>
    </Animated.View>
  );
}

