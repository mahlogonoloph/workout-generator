import React from 'react';
import { View, Text, Linking } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export default function RoutineDisclaimer() {
  return (
    <View style={styles.routineDisclaimerCard}>
      <Text style={styles.routineDisclaimerText}>
        <Text style={styles.routineDisclaimerBold}>Open-Source Attribution: </Text>
        Exercise and muscle taxonomy seeded from{' '}
        <Text
          style={styles.routineDisclaimerLink}
          onPress={() => Linking.openURL('https://wger.de')}
        >
          wger Workout Manager (wger.de)
        </Text>{' '}
        under CC-BY-SA / AGPL-3.0.
      </Text>
      <Text style={[styles.routineDisclaimerText, { marginTop: 4 }]}>
        <Text style={styles.routineDisclaimerBold}>Health Notice: </Text>
        For educational purposes only. Consult a physician before starting a new training program and stop immediately if you experience sharp joint pain.
      </Text>
    </View>
  );
}

