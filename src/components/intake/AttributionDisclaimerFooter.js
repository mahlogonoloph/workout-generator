import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export default function AttributionDisclaimerFooter() {
  return (
    <View style={styles.attributionFooterCard}>
      <View style={styles.attributionHeaderRow}>
        <Text style={styles.attributionTitle}>OPEN-SOURCE CREDITS &amp; SAFETY NOTICE</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL('https://wger.de')}
        >
          <Text style={styles.attributionLink}>wger.de ↗</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.attributionText}>
        Exercise and muscle taxonomy seeded from the{' '}
        <Text
          style={styles.attributionInlineLink}
          onPress={() => Linking.openURL('https://github.com/wger-project/wger')}
        >
          wger Workout Manager
        </Text>{' '}
        open-source project (licensed under CC-BY-SA / AGPL-3.0). Custom biomechanical scoring, periodization, and vector posture diagrams by Fig Fitness.
      </Text>
      <Text style={styles.disclaimerText}>
        Medical Disclaimer: This tool provides general strength and conditioning templates for educational purposes only and is not medical advice. Consult a qualified healthcare professional before beginning any exercise program, especially if you have pre-existing injuries or joint conditions.
      </Text>
    </View>
  );
}

