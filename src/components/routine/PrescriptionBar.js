import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export default function PrescriptionBar({ exercise, onPress }) {
  if (!exercise) return null;

  return (
    <TouchableOpacity
      style={styles.prescriptionRow}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.prescriptionItem}>
        <Text style={styles.prescriptionLabel}>SETS</Text>
        <Text style={styles.prescriptionValue}>{exercise.sets}</Text>
      </View>
      <View style={styles.prescriptionDivider} />
      <View style={styles.prescriptionItem}>
        <Text style={styles.prescriptionLabel}>
          {exercise.prescriptionType === 'time' ? 'HOLD' : 'REPS'}
        </Text>
        <Text style={styles.prescriptionValue}>{exercise.reps}</Text>
      </View>
      <View style={styles.prescriptionDivider} />
      <View style={styles.prescriptionItem}>
        <Text style={styles.prescriptionLabel}>REST</Text>
        <Text style={styles.prescriptionValue}>{exercise.restSeconds}s</Text>
      </View>
      {exercise.targetRir && (
        <>
          <View style={styles.prescriptionDivider} />
          <View style={styles.prescriptionItem}>
            <Text style={styles.prescriptionLabel}>EFFORT</Text>
            <Text style={styles.prescriptionRirValue}>
              {exercise.targetRir.split(' (')[0]}
            </Text>
          </View>
        </>
      )}
      <View style={styles.prescriptionDivider} />
      <View style={styles.prescriptionEditIndicator}>
        <Text style={styles.prescriptionEditIcon}>✎</Text>
        <Text style={styles.prescriptionEditText}>Adjust</Text>
      </View>
    </TouchableOpacity>
  );
}

